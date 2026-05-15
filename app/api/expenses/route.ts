import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

const VALID_CATEGORIES = [
  "FUEL",
  "OFFICE",
  "MEALS",
  "CLOTHING",
  "EQUIPMENT",
  "TRAVEL",
  "COMMUNICATION",
  "OTHER",
] as const

// GET /api/expenses?from&to&category&q
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sp = req.nextUrl.searchParams
    const from = sp.get("from")
    const to = sp.get("to")
    const category = sp.get("category")
    const q = sp.get("q")

    const where: any = { companyId: user.companyId }

    if (category && VALID_CATEGORIES.includes(category as any)) {
      where.category = category
    }

    if (from || to) {
      where.OR = [
        {
          receiptDate: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        },
        {
          AND: [
            { receiptDate: null },
            {
              createdAt: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
              },
            },
          ],
        },
      ]
    }

    if (q) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { vendor: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { receiptNumber: { contains: q, mode: "insensitive" } },
          ],
        },
      ]
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: [{ receiptDate: "desc" }, { createdAt: "desc" }],
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    )
  }
}

// POST /api/expenses
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      amount,
      currency = "ILS",
      vatAmount,
      category = "OTHER",
      vendor,
      description,
      receiptDate,
      receiptNumber,
      fileId,
      imagePath,
      aiExtracted = false,
      aiConfidence,
      notes,
    } = body

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "amount is required and must be positive" },
        { status: 400 }
      )
    }

    const finalCategory = VALID_CATEGORIES.includes(category) ? category : "OTHER"

    let finalImagePath: string | null = imagePath || null
    let finalFileId: string | null = fileId || null

    if (fileId && !finalImagePath) {
      const file = await prisma.file.findFirst({
        where: { id: fileId, companyId: user.companyId },
      })
      if (file) finalImagePath = file.path
    }

    const expense = await prisma.expense.create({
      data: {
        companyId: user.companyId,
        userId: user.id,
        amount,
        currency,
        vatAmount: typeof vatAmount === "number" ? vatAmount : null,
        category: finalCategory,
        vendor: vendor || null,
        description: description || null,
        receiptDate: receiptDate ? new Date(receiptDate) : null,
        receiptNumber: receiptNumber || null,
        fileId: finalFileId,
        imagePath: finalImagePath,
        aiExtracted: !!aiExtracted,
        aiConfidence: typeof aiConfidence === "number" ? aiConfidence : null,
        notes: notes || null,
      },
    })

    if (finalFileId) {
      await prisma.file
        .update({
          where: { id: finalFileId },
          data: { entityType: "expense", entityId: expense.id },
        })
        .catch(() => {})
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    )
  }
}
