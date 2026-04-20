import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { triggerAutomation } from "@/lib/automation-engine"
import { notifyClientAdded } from "@/lib/notification-service"
import { getAuthUser } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clients = await prisma.client.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        _count: {
          select: {
            projects: true,
            budgets: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error fetching clients:", error)
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
    const { name, email, phone, address, notes } = body

    const client = await prisma.client.create({
      data: {
        companyId: user.companyId,
        name,
        email,
        phone,
        address,
        notes,
        status: "ACTIVE",
        ownerId: user.id!,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Send notification (in-app + email)
    await notifyClientAdded({
      userId: user.id!,
      companyId: user.companyId,
      clientId: client.id,
      clientName: client.name,
    })

    // Trigger automation for client creation
    await triggerAutomation(
      'client_added',
      client.id,
      'client',
      client,
      user.id!,
      user.companyId
    )

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

