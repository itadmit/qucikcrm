import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { getAuthUser } from "@/lib/mobile-auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    const fileId = id
    console.log("📥 Downloading file:", fileId, "Session:", user?.id ? "authenticated" : "not authenticated")

    // מציאת הקובץ - אם יש session, נבדוק גם לפי companyId
    let file
    if (user?.id) {
      file = await prisma.file.findFirst({
        where: {
          id: fileId,
          companyId: user.companyId,
        },
        include: {
          lead: {
            select: {
              id: true,
            },
          },
          client: {
            select: {
              id: true,
            },
          },
        },
      })
    } else {
      // אם אין session, נבדוק אם הקובץ קשור להצעה (quote)
      // זה מאפשר הורדה גם ללא authentication עבור קבצים של הצעות
      file = await prisma.file.findFirst({
        where: {
          id: fileId,
          entityType: "quote",
        },
        include: {
          lead: {
            select: {
              id: true,
            },
          },
          client: {
            select: {
              id: true,
            },
          },
        },
      })
    }

    if (!file) {
      console.error("❌ File not found in database:", fileId)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // אם יש session, נבדוק שהקובץ שייך לחברה של המשתמש
    if (user?.id && file.companyId !== user.companyId) {
      console.error("❌ File belongs to different company")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    console.log("✅ File found in database:", {
      id: file.id,
      name: file.name,
      path: file.path,
      size: file.size,
    })

    // קריאת הקובץ מהדיסק
    // אם הנתיב מתחיל ב-/, נסיר אותו כי join כבר מוסיף את process.cwd()
    const normalizedPath = file.path.startsWith("/") ? file.path.slice(1) : file.path
    const filePath = join(process.cwd(), normalizedPath)
    
    console.log("🔍 Looking for file at:", filePath)
    
    if (!existsSync(filePath)) {
      console.error("❌ File not found on disk:", filePath)
      // נוסיף גם בדיקה אם הנתיב עם / מתחיל
      const altPath = join(process.cwd(), file.path)
      if (altPath !== filePath && existsSync(altPath)) {
        console.log("✅ Found file at alternative path:", altPath)
        const fileBuffer = await readFile(altPath)
        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": file.mimeType || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"`,
            "Content-Length": file.size.toString(),
          },
        })
      }
      return NextResponse.json({ 
        error: "File not found on disk",
        details: `Expected path: ${filePath}` 
      }, { status: 404 })
    }

    console.log("✅ File exists on disk, reading...")
    const fileBuffer = await readFile(filePath)

    // בדיקה שהגודל תואם
    if (fileBuffer.length !== file.size) {
      console.warn("⚠️ File size mismatch:", {
        expected: file.size,
        actual: fileBuffer.length,
      })
    }

    console.log("✅ File read successfully, sending response")

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": file.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("❌ Error downloading file:", error)
    return NextResponse.json(
      { 
        error: "Failed to download file",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

