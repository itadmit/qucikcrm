import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only allow admins to reset data
    const user = session?.user as { companyId?: string; role?: string } | null
    if (!user || !user.companyId || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 })
    }

    const companyId = user.companyId

    console.log('🗑️ Starting data reset for company:', companyId)

    // Delete all data for the company (in correct order due to foreign keys)
    await prisma.notification.deleteMany({ where: { companyId } })
    await prisma.file.deleteMany({ where: { companyId } })
    await prisma.budget.deleteMany({ where: { companyId } })
    await prisma.task.deleteMany({ where: { companyId } })
    await prisma.project.deleteMany({ where: { companyId } })
    await prisma.lead.deleteMany({ where: { companyId } })
    await prisma.client.deleteMany({ where: { companyId } })
    await prisma.automationLog.deleteMany({ 
      where: { 
        automation: { companyId } 
      } 
    })
    await prisma.automation.deleteMany({ where: { companyId } })
    await prisma.auditLog.deleteMany({ where: { companyId } })
    await prisma.webhookLog.deleteMany({ where: { companyId } })
    await prisma.emailTemplate.deleteMany({ where: { companyId } })
    
    // Delete pipeline stages first, then pipelines
    const pipelines = await prisma.pipeline.findMany({ 
      where: { companyId },
      select: { id: true }
    })
    for (const pipeline of pipelines) {
      await prisma.pipelineStage.deleteMany({ where: { pipelineId: pipeline.id } })
    }
    await prisma.pipeline.deleteMany({ where: { companyId } })

    console.log('✅ All data deleted successfully')

    return NextResponse.json({ 
      success: true, 
      message: "כל הנתונים נמחקו בהצלחה" 
    })
  } catch (error) {
    console.error("Error resetting data:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

