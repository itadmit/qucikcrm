import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

// GET - קבלת כל התבניות של החברה
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const templates = await prisma.taskTemplate.findMany({
      where: {
        companyId: user.companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching task templates:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - יצירת תבנית חדשה
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    const { name, description, tasks } = body

    if (!name || !tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: "Name and tasks array are required" },
        { status: 400 }
      )
    }

    const template = await prisma.taskTemplate.create({
      data: {
        companyId: user.companyId,
        name,
        description: description || null,
        tasks: tasks.filter((t: string) => t.trim() !== ""),
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error creating task template:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

