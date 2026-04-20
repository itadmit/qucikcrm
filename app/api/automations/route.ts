import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const automations = await prisma.automation.findMany({
      where: {
        companyId: user.companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(automations)
  } catch (error) {
    console.error("Error fetching automations:", error)
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
    const { name, description, trigger, action, conditions, isActive } = body

    // Convert single action to actions array
    const actions = action ? [action] : []

    const automation = await prisma.automation.create({
      data: {
        name,
        description,
        trigger,
        actions,
        conditions: conditions || {},
        isActive: isActive ?? true,
        company: {
          connect: {
            id: user.companyId,
          },
        },
        creator: {
          connect: {
            id: user.id!,
          },
        },
      },
    })

    return NextResponse.json(automation, { status: 201 })
  } catch (error) {
    console.error("Error creating automation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

