import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

// GET - קבלת הרשאות המשתמש הנוכחי
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // אם המשתמש הוא ADMIN או SUPER_ADMIN, יש לו גישה לכל דבר
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      // החזר כל ההרשאות כפעילות
      return NextResponse.json({
        permissions: {
          dashboard: true,
          tasks: true,
          calendar: true,
          attendance: true,
          notifications: true,
          reports: true,
          leads: true,
          clients: true,
          projects: true,
          quotes: true,
          payments: true,
          expenses: true,
          settings: true,
          integrations: true,
          automations: true,
        },
      })
    }

    // קבלת הרשאות המשתמש
    const permissions = await prisma.userPermission.findMany({
      where: {
        userId: user.id,
        allowed: true,
      },
      select: {
        permission: true,
      },
    })

    // המרה למערך של שמות הרשאות
    const permissionMap: Record<string, boolean> = {}
    permissions.forEach((perm) => {
      permissionMap[perm.permission] = true
    })

    // הרשאות נדרשות תמיד פעילות
    permissionMap.dashboard = true
    permissionMap.notifications = true

    return NextResponse.json({ permissions: permissionMap })
  } catch (error) {
    console.error("Error fetching user permissions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

