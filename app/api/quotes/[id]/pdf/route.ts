import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateQuotePDF } from "@/lib/pdf-generator"
import { getAuthUser } from "@/lib/mobile-auth"

// GET /api/quotes/[id]/pdf - יצירת PDF של הצעת מחיר
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
        client: {
          select: {
            name: true,
            email: true,
          },
        },
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

    // עדכון שההצעת מחיר נצפתה (אם היא נשלחה)
    if (quote.status === "SENT" && !quote.viewedAt) {
      await prisma.quote.update({
        where: { id: id },
        data: {
          status: "VIEWED",
          viewedAt: new Date(),
        },
      })
    }

    const pdfBuffer = await generateQuotePDF(quote)

    // בדיקה אם זו תצוגה מקדימה או הורדה
    const { searchParams } = new URL(req.url)
    const isPreview = searchParams.get('preview') === 'true'

    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": isPreview 
          ? `inline; filename="quote-${quote.quoteNumber}.pdf"`
          : `attachment; filename="quote-${quote.quoteNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}

