import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"
import { unlink } from "fs/promises"
import { join } from "path"

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const expense = await prisma.expense.findFirst({
      where: { id, companyId: user.companyId },
    })

    if (!expense) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error fetching expense:", error)
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.expense.findFirst({
      where: { id, companyId: user.companyId },
    })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await req.json()
    const data: any = {}

    if (typeof body.amount === "number" && body.amount > 0) data.amount = body.amount
    if (typeof body.currency === "string") data.currency = body.currency
    if (body.vatAmount === null || typeof body.vatAmount === "number")
      data.vatAmount = body.vatAmount
    if (body.category && VALID_CATEGORIES.includes(body.category))
      data.category = body.category
    if (body.vendor !== undefined) data.vendor = body.vendor || null
    if (body.description !== undefined) data.description = body.description || null
    if (body.receiptDate !== undefined)
      data.receiptDate = body.receiptDate ? new Date(body.receiptDate) : null
    if (body.receiptNumber !== undefined)
      data.receiptNumber = body.receiptNumber || null
    if (body.notes !== undefined) data.notes = body.notes || null

    const expense = await prisma.expense.update({ where: { id }, data })
    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error updating expense:", error)
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const expense = await prisma.expense.findFirst({
      where: { id, companyId: user.companyId },
    })
    if (!expense) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (expense.fileId) {
      const file = await prisma.file.findFirst({
        where: { id: expense.fileId, companyId: user.companyId },
      })
      if (file) {
        const clean = file.path.startsWith("/") ? file.path.slice(1) : file.path
        await unlink(join(process.cwd(), clean)).catch(() => {})
        await prisma.file.delete({ where: { id: file.id } }).catch(() => {})
      }
    }

    await prisma.expense.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    )
  }
}
