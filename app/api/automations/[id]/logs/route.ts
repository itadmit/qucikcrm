import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

/**
 * Get logs for a specific automation
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify automation belongs to user's company
    const automation = await prisma.automation.findFirst({
      where: {
        id: id,
        companyId: user.companyId,
      },
    })

    if (!automation) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') // 'success' or 'failed'

    // Get automation logs
    const logs = await prisma.automationLog.findMany({
      where: {
        automationId: id,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching automation logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

