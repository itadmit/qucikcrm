import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

// DELETE - מחיקת תבנית
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // בדיקה שהתבנית שייכת לחברה
    const template = await prisma.quote.findFirst({
      where: {
        id: id,
        companyId: user.companyId,
        isTemplate: true,
      },
    })

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      )
    }

    // מחיקת התבנית (הפריטים יימחקו אוטומטית בגלל onDelete: Cascade)
    await prisma.quote.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

