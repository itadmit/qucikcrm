import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !('companyId' in session.user) || !session.user.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = session.user as { id: string; companyId: string }
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
