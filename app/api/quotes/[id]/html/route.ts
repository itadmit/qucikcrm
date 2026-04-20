import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateQuoteHTML } from "@/lib/pdf-generator"
import { getAuthUser } from "@/lib/mobile-auth"

// GET /api/quotes/[id]/html - קבלת HTML של הצעת מחיר לתצוגה מקדימה
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { companyId: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const quote = await prisma.quote.findFirst({
      where: {
        id: id,
        companyId: dbUser.companyId,
      },
      include: {
        lead: true,
        items: {
          orderBy: {
            position: "asc",
          },
        },
        company: {
          select: {
            name: true,
            settings: true,
          },
        },
      },
    })

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    const html = await generateQuoteHTML(quote)

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Error generating HTML:", error)
    return NextResponse.json(
      { error: "Failed to generate HTML" },
      { status: 500 }
    )
  }
}

