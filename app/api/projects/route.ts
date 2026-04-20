import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        payments: {
          where: {
            status: "COMPLETED",
          },
          select: {
            amount: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // הוספת סכום ששולם לכל פרויקט
    const projectsWithPaid = projects.map((project) => ({
      ...project,
      paidAmount: project.payments.reduce((sum, p) => sum + p.amount, 0),
    }))

    return NextResponse.json(projectsWithPaid)
  } catch (error) {
    console.error("Error fetching projects:", error)
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
    const { name, description, clientId, startDate, endDate, budget } = body

    const project = await prisma.project.create({
      data: {
        companyId: user.companyId,
        name,
        description,
        clientId,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ? parseFloat(budget) : null,
        status: "PLANNING",
      },
    })

    // הפעלת אוטומציות עם טריגר project_created
    try {
      const automations = await prisma.automation.findMany({
        where: {
          companyId: user.companyId,
          isActive: true,
        },
      })

      for (const auto of automations) {
        const trigger = auto.trigger as any
        if (trigger?.type !== 'project_created') continue

        const actionsList = auto.actions as any[]
        if (!actionsList || !Array.isArray(actionsList)) continue

        for (const action of actionsList) {
          if (action.type === 'create_task' && action.params?.taskTitle) {
            const checklistItems = (action.params.checklist || []).map((text: string, i: number) => ({
              id: `ci-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
              text,
              checked: false,
            }))

            await prisma.task.create({
              data: {
                companyId: user.companyId,
                projectId: project.id,
                title: action.params.taskTitle,
                status: "TODO",
                priority: "NORMAL",
                position: 0,
                checklist: checklistItems.length > 0 ? checklistItems : undefined,
              },
            })
          }
        }

        // לוג
        await prisma.automationLog.create({
          data: {
            automationId: auto.id,
            status: "success",
            payload: { projectId: project.id, projectName: name },
          },
        }).catch(() => {})
      }
    } catch (e) {
      console.error("Error running project automations:", e)
    }

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

