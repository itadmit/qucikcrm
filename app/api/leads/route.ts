import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { triggerAutomation } from "@/lib/automation-engine"
import { notifyLeadCreated } from "@/lib/notification-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { companyId?: string } | null
    
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leads = await prisma.lead.findMany({
      where: {
        companyId: user.companyId,
        // לא להציג לידים שהומרו ללקוח (WON)
        status: {
          not: "WON",
        },
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        stage: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { companyId?: string; id?: string } | null
    
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, phone, source, notes, tags } = body

    const lead = await prisma.lead.create({
      data: {
        companyId: user.companyId,
        name,
        email,
        phone,
        source,
        notes,
        tags: tags || [],
        status: "NEW",
        ownerId: user.id!,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        stage: true,
      },
    })

    // Send notification (in-app + email)
    await notifyLeadCreated({
      userId: user.id!,
      companyId: user.companyId,
      leadId: lead.id,
      leadName: lead.name,
      leadEmail: lead.email || '',
      source: lead.source || 'לא צוין',
    })

    // Trigger automation for lead creation
    await triggerAutomation(
      'lead_created',
      lead.id,
      'lead',
      lead,
      user.id!,
      user.companyId
    )

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

