import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

// GET /api/company/ai-settings
// Returns: { geminiApiKey: string | null, isConfigured: boolean }
// The key is masked (only last 4 chars) for safety on read.
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const company = await prisma.company.findUnique({
      where: { id: user.companyId },
      select: { settings: true },
    })

    const settings = (company?.settings as any) || {}
    const key = settings.aiSettings?.geminiApiKey || null

    return NextResponse.json({
      isConfigured: !!key,
      maskedKey: key ? `${key.slice(0, 4)}...${key.slice(-4)}` : null,
    })
  } catch (error) {
    console.error("Error reading AI settings:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// PUT /api/company/ai-settings
// Body: { geminiApiKey: string | null }   (null/empty removes the key)
export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins should be able to set this
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Only admins can manage AI settings" },
        { status: 403 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const newKey =
      typeof body.geminiApiKey === "string" && body.geminiApiKey.trim()
        ? body.geminiApiKey.trim()
        : null

    const company = await prisma.company.findUnique({
      where: { id: user.companyId },
      select: { settings: true },
    })

    const settings = (company?.settings as any) || {}
    const aiSettings = settings.aiSettings || {}
    if (newKey) {
      aiSettings.geminiApiKey = newKey
    } else {
      delete aiSettings.geminiApiKey
    }
    settings.aiSettings = aiSettings

    await prisma.company.update({
      where: { id: user.companyId },
      data: { settings },
    })

    return NextResponse.json({
      isConfigured: !!newKey,
      maskedKey: newKey ? `${newKey.slice(0, 4)}...${newKey.slice(-4)}` : null,
    })
  } catch (error) {
    console.error("Error updating AI settings:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
