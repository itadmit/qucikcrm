import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { triggerAutomation } from "@/lib/automation-engine"
import { notifyTaskAssigned, notifyTaskCompleted } from "@/lib/notification-service"
import { getAuthUser } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const myTasks = searchParams.get('my') === 'true'

    const tasks = await prisma.task.findMany({
      where: {
        companyId: user.companyId,
        ...(myTasks && { assigneeId: user.id }),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
        column: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    const { title, description, projectId, clientId, leadId, dueDate, priority, status, skipEmail, columnId: reqColumnId } = body

    let finalColumnId = reqColumnId
    if (!finalColumnId) {
      const targetStatus = status || 'TODO'
      const defaultColumn = await prisma.taskColumn.findFirst({
        where: { companyId: user.companyId, status: targetStatus },
        orderBy: { position: 'asc' },
      })
      finalColumnId = defaultColumn?.id || null
    }

    const maxPos = await prisma.task.aggregate({
      where: { columnId: finalColumnId, companyId: user.companyId },
      _max: { position: true },
    })

    const task = await prisma.task.create({
      data: {
        companyId: user.companyId,
        title,
        description,
        projectId,
        clientId,
        leadId,
        columnId: finalColumnId,
        position: (maxPos._max.position ?? -1) + 1,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || "NORMAL",
        status: status || "TODO",
        assigneeId: user.id,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
      },
    })

    // Send notification (in-app + email) - רק אם לא מדלגים על מייל
    if (!skipEmail) {
      await notifyTaskAssigned({
        userId: task.assigneeId || user.id,
        companyId: user.companyId,
        taskId: task.id,
        taskTitle: task.title,
        assigneeName: task.assignee?.name || user.name || 'Unknown',
        dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('he-IL') : undefined,
      })
    } else {
      // רק התראה בתוך המערכת, ללא מייל
      await prisma.notification.create({
        data: {
          userId: task.assigneeId || user.id,
          companyId: user.companyId,
          type: 'task',
          title: 'משימה חדשה',
          message: task.title,
          entityType: 'task',
          entityId: task.id,
          isRead: false,
        },
      })
    }

    // Trigger automation for task creation
    await triggerAutomation(
      'task_created',
      task.id,
      'task',
      task,
      user.id,
      user.companyId
    )

    // עדכון progress של הפרויקט
    if (projectId) {
      await recalcProjectProgress(projectId)
    }

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    const { id, status, assigneeId, columnId, position, batchPositions, ...updateData } = body

    if (batchPositions && Array.isArray(batchPositions)) {
      await prisma.$transaction(
        batchPositions.map((item: { id: string; position: number; columnId?: string; status?: string }) =>
          prisma.task.update({
            where: { id: item.id, companyId: user.companyId },
            data: {
              position: item.position,
              ...(item.columnId ? { columnId: item.columnId } : {}),
              ...(item.status ? { status: item.status as any } : {}),
            },
          })
        )
      )

      // עדכון progress של פרויקטים מושפעים
      const taskIds = batchPositions.map((item: any) => item.id)
      const affectedTasks = await prisma.task.findMany({
        where: { id: { in: taskIds }, projectId: { not: null } },
        select: { projectId: true },
      })
      const projectIds = Array.from(new Set(affectedTasks.map(t => t.projectId).filter(Boolean))) as string[]

      for (const pid of projectIds) {
        await recalcProjectProgress(pid)
      }

      return NextResponse.json({ success: true })
    }

    // Get old task data to check for status and assignee changes
    const oldTask = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!oldTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // בדיקה שהמשימה שייכת לחברה
    if (oldTask.companyId !== user.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    let resolvedStatus = status
    if (columnId && !status) {
      const column = await prisma.taskColumn.findUnique({ where: { id: columnId } })
      if (column) {
        resolvedStatus = column.status
      }
    }

    const task = await prisma.task.update({
      where: {
        id,
        companyId: user.companyId,
      },
      data: {
        ...updateData,
        ...(resolvedStatus && { status: resolvedStatus }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(columnId !== undefined && { columnId }),
        ...(position !== undefined && { position }),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
      },
    })

    // אם המשימה הועברה למישהו אחר - שלח מייל
    if (assigneeId !== undefined && assigneeId !== oldTask.assigneeId && assigneeId) {
      // בדיקה שהמשתמש החדש שייך לחברה
      const newAssignee = await prisma.user.findFirst({
        where: {
          id: assigneeId,
          companyId: user.companyId,
        },
        select: {
          name: true,
          email: true,
        },
      })

      if (newAssignee) {
        // שלח מייל למקבל המשימה החדש
        await notifyTaskAssigned({
          userId: assigneeId,
          companyId: user.companyId,
          taskId: task.id,
          taskTitle: task.title,
          assigneeName: newAssignee.name,
          dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('he-IL') : undefined,
        })
      }
    }

    // Trigger automation and notification if task was completed
    if (resolvedStatus && oldTask.status !== 'DONE' && resolvedStatus === 'DONE') {
      await notifyTaskCompleted({
        userId: task.assigneeId || user.id,
        companyId: user.companyId,
        taskId: task.id,
        taskTitle: task.title,
      })

      await triggerAutomation(
        'task_completed',
        task.id,
        'task',
        task,
        user.id,
        user.companyId
      )
    }

    // עדכון progress של הפרויקט אם המשימה שייכת לפרויקט
    if (oldTask.projectId && (resolvedStatus || updateData.checklist !== undefined)) {
      await recalcProjectProgress(oldTask.projectId)
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function recalcProjectProgress(projectId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { status: true, checklist: true },
    })

    if (tasks.length === 0) {
      await prisma.project.update({ where: { id: projectId }, data: { progress: 0 } })
      return
    }

    let totalWeight = 0
    let completedWeight = 0

    for (const task of tasks) {
      const checklist = task.checklist as any[] | null

      if (checklist && checklist.length > 0) {
        totalWeight += checklist.length
        completedWeight += checklist.filter((item: any) => item.checked).length
      } else {
        totalWeight += 1
        if (task.status === 'DONE') completedWeight += 1
      }
    }

    const progress = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0
    await prisma.project.update({ where: { id: projectId }, data: { progress } })
  } catch (e) {
    console.error("Error recalculating project progress:", e)
  }
}

