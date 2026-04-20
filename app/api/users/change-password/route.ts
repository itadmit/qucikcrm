import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getAuthUser } from "@/lib/mobile-auth"

// PATCH - שינוי סיסמה
export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // קבלת המשתמש עם הסיסמה
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, password: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // בדיקת הסיסמה הנוכחית
    const isPasswordValid = await bcrypt.compare(currentPassword, dbUser.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    // הצפנת הסיסמה החדשה
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // עדכון הסיסמה
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

