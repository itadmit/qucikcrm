import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

// PUT - עדכון תבנית
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    const { name, description, tasks } = body

    // בדיקה שהתבנית שייכת לחברה
    const existingTemplate = await prisma.taskTemplate.findFirst({
      where: {
        id: id,
        companyId: user.companyId,
      },
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      )
    }

    const template = await prisma.taskTemplate.update({
      where: { id: id },
      data: {
        name: name || existingTemplate.name,
        description: description !== undefined ? description : existingTemplate.description,
        tasks: tasks && Array.isArray(tasks) 
          ? tasks.filter((t: string) => t.trim() !== "")
          : existingTemplate.tasks,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error updating task template:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - מחיקת תבנית
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // בדיקה שהתבנית שייכת לחברה
    const existingTemplate = await prisma.taskTemplate.findFirst({
      where: {
        id: id,
        companyId: user.companyId,
      },
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      )
    }

    await prisma.taskTemplate.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task template:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

