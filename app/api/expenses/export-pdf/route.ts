import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"
import { generateExpensesPdf } from "@/lib/pdf-receipts"

// GET /api/expenses/export-pdf?from=YYYY-MM-DD&to=YYYY-MM-DD&category=
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sp = req.nextUrl.searchParams
    const fromParam = sp.get("from")
    const toParam = sp.get("to")
    const category = sp.get("category")

    // Default: last 2 months
    const now = new Date()
    const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    const from = fromParam ? new Date(fromParam) : defaultFrom
    const to = toParam ? new Date(toParam) : defaultTo

    const where: any = {
      companyId: user.companyId,
      OR: [
        { receiptDate: { gte: from, lte: to } },
        {
          AND: [
            { receiptDate: null },
            { createdAt: { gte: from, lte: to } },
          ],
        },
      ],
    }

    if (category) {
      where.category = category
    }

    const [expenses, company] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: [{ receiptDate: "asc" }, { createdAt: "asc" }],
      }),
      prisma.company.findUnique({
        where: { id: user.companyId },
        select: { name: true },
      }),
    ])

    if (expenses.length === 0) {
      return NextResponse.json(
        { error: "No expenses found in this period" },
        { status: 404 }
      )
    }

    const pdfBuffer = await generateExpensesPdf(
      expenses.map((e) => ({
        id: e.id,
        amount: e.amount,
        vatAmount: e.vatAmount,
        currency: e.currency,
        category: e.category,
        vendor: e.vendor,
        description: e.description,
        receiptDate: e.receiptDate,
        receiptNumber: e.receiptNumber,
        imagePath: e.imagePath,
        createdAt: e.createdAt,
      })),
      company?.name || "QuickCRM",
      from,
      to
    )

    // Mark as exported
    const ids = expenses.map((e) => e.id)
    await prisma.expense
      .updateMany({
        where: { id: { in: ids } },
        data: { exportedAt: new Date() },
      })
      .catch(() => {})

    const fromStr = from.toISOString().slice(0, 10)
    const toStr = to.toISOString().slice(0, 10)
    const filename = `expenses_${fromStr}_${toStr}.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    })
  } catch (error) {
    console.error("Error generating expenses PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}
