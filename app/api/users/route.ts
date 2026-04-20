import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

// GET - קבלת כל המשתמשים בחברה
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      where: {
        companyId: user.companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

