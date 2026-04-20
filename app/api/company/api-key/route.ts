import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

// GET - קבלת מפתח ה-API של החברה
export async function GET() {
  try {
    const user = await getAuthUser(req)
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            apiKey: true,
          },
        },
      },
    })

    if (!user || !user.company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json({
      companyName: user.company.name,
      apiKey: user.company.apiKey,
      webhookUrl: `${process.env.NEXTAUTH_URL || "https://quick-crm.com"}/api/webhooks/quotes`,
      documentation: `${process.env.NEXTAUTH_URL || "https://quick-crm.com"}/api/webhooks/quotes`,
    })
  } catch (error) {
    console.error("Error fetching API key:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - יצירת מפתח API חדש (רענון)
export async function POST() {
  try {
    const user = await getAuthUser(req)
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // רק אדמינים יכולים לרענן את ה-API Key
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only admins can regenerate API keys" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: user.id },
      select: { companyId: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // יצירת מפתח חדש
    const crypto = require("crypto")
    const newApiKey = `qcrm_${crypto.randomBytes(24).toString("hex")}`

    const company = await prisma.company.update({
      where: { id: user.companyId },
      data: { apiKey: newApiKey },
      select: {
        name: true,
        apiKey: true,
      },
    })

    return NextResponse.json({
      companyName: company.name,
      apiKey: company.apiKey,
      webhookUrl: `${process.env.NEXTAUTH_URL || "https://quick-crm.com"}/api/webhooks/quotes`,
      message: "API Key regenerated successfully",
    })
  } catch (error) {
    console.error("Error regenerating API key:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

