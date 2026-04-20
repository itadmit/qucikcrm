import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { triggerAutomation } from "@/lib/automation-engine"
import { getAuthUser } from "@/lib/mobile-auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lead = await prisma.lead.findFirst({
      where: {
        id: id,
        companyId: user.companyId,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        stage: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    })

    console.log('Lead found:', !!lead)

    if (!lead) {
      console.log('Lead not found for:', { leadId: id, companyId: user.companyId })
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    console.log('Returning lead:', { id: lead.id, name: lead.name, status: lead.status })
    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error fetching lead:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, phone, source, notes, status, tags } = body

    // Get old lead data to check for status changes
    const oldLead = await prisma.lead.findUnique({
      where: { id: id },
      include: {
        owner: true,
        stage: true,
      },
    })

    const lead = await prisma.lead.update({
      where: {
        id: id,
        companyId: user.companyId,
      },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(source !== undefined && { source }),
        ...(notes !== undefined && { notes }),
        ...(status && { status }),
        ...(tags && { tags }),
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        stage: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    })

    // Trigger automation if status changed
    if (status && oldLead && oldLead.status !== status) {
      await triggerAutomation(
        'lead_status_changed',
        lead.id,
        'lead',
        { ...lead, oldStatus: oldLead.status, newStatus: status },
        user.id!,
        user.companyId
      )
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.lead.delete({
      where: {
        id: id,
        companyId: user.companyId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

