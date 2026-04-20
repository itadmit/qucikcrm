import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !('companyId' in session.user) || !session.user.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = session.user as { id: string; companyId: string }

    let columns = await prisma.taskColumn.findMany({
      where: { companyId: user.companyId },
      orderBy: { position: 'asc' },
    })

    if (columns.length === 0) {
      const defaults = [
        { name: 'לביצוע', position: 0, color: '#e2e8f0', status: 'TODO' as const },
        { name: 'בתהליך', position: 1, color: '#67e8f9', status: 'IN_PROGRESS' as const },
        { name: 'הושלם', position: 2, color: '#86efac', status: 'DONE' as const },
      ]
      for (const col of defaults) {
        await prisma.taskColumn.create({
          data: { companyId: user.companyId, ...col },
        })
      }
      columns = await prisma.taskColumn.findMany({
        where: { companyId: user.companyId },
        orderBy: { position: 'asc' },
      })
    }

    return NextResponse.json(columns)
  } catch (error) {
    console.error("Error fetching task columns:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !('companyId' in session.user) || !session.user.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = session.user as { id: string; companyId: string }
    const { name, color, status } = await req.json()

    const maxPos = await prisma.taskColumn.aggregate({
      where: { companyId: user.companyId },
      _max: { position: true },
    })

    const column = await prisma.taskColumn.create({
      data: {
        companyId: user.companyId,
        name,
        color: color || '#e2e8f0',
        status: status || 'TODO',
        position: (maxPos._max.position ?? -1) + 1,
      },
    })

    return NextResponse.json(column, { status: 201 })
  } catch (error) {
    console.error("Error creating task column:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !('companyId' in session.user) || !session.user.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = session.user as { id: string; companyId: string }
    const { id, name, color, status } = await req.json()

    const column = await prisma.taskColumn.update({
      where: { id, companyId: user.companyId },
      data: {
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
        ...(status !== undefined && { status }),
      },
    })

    return NextResponse.json(column)
  } catch (error) {
    console.error("Error updating task column:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !('companyId' in session.user) || !session.user.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = session.user as { id: string; companyId: string }
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const moveToColumnId = searchParams.get('moveTo')

    if (!id) {
      return NextResponse.json({ error: "Missing column id" }, { status: 400 })
    }

    if (moveToColumnId) {
      await prisma.task.updateMany({
        where: { columnId: id, companyId: user.companyId },
        data: { columnId: moveToColumnId },
      })
    } else {
      await prisma.task.updateMany({
        where: { columnId: id, companyId: user.companyId },
        data: { columnId: null },
      })
    }

    await prisma.taskColumn.delete({
      where: { id, companyId: user.companyId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task column:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
