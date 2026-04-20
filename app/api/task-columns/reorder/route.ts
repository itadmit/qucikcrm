import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { columns } = await req.json() as { columns: { id: string; position: number }[] }

    await prisma.$transaction(
      columns.map((col) =>
        prisma.taskColumn.update({
          where: { id: col.id, companyId: user.companyId },
          data: { position: col.position },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reordering columns:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
