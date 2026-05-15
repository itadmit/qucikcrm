import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"
import { extractReceipt } from "@/lib/gemini"
import { readFile } from "fs/promises"
import { join } from "path"

// POST /api/expenses/extract
// Accepts one of:
//   - multipart/form-data with field "file" (one-shot, image NOT persisted)
//   - JSON body { fileId } or { imagePath } (reads existing uploaded file)
// returns: { extracted: { amount, vatAmount, vendor, receiptDate, receiptNumber, category, confidence } | null }
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ extracted: null, reason: "no_api_key" })
    }

    let buffer: Buffer | null = null
    let mimeType = "image/jpeg"

    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const file = formData.get("file") as File | null
      if (!file) {
        return NextResponse.json({ error: "file required" }, { status: 400 })
      }
      buffer = Buffer.from(await file.arrayBuffer())
      if (file.type) mimeType = file.type
    } else {
      const body = await req.json().catch(() => ({}))
      const { fileId, imagePath } = body
      let path: string | null = null

      if (fileId) {
        const dbFile = await prisma.file.findFirst({
          where: { id: fileId, companyId: user.companyId },
        })
        if (!dbFile) {
          return NextResponse.json({ error: "File not found" }, { status: 404 })
        }
        path = dbFile.path
        if (dbFile.mimeType) mimeType = dbFile.mimeType
      } else if (imagePath) {
        path = imagePath
      }

      if (!path) {
        return NextResponse.json(
          { error: "file, fileId, or imagePath required" },
          { status: 400 }
        )
      }

      const clean = path.startsWith("/") ? path.slice(1) : path
      buffer = await readFile(join(process.cwd(), clean))
    }

    const extracted = await extractReceipt(buffer, mimeType)
    return NextResponse.json({ extracted })
  } catch (error) {
    console.error("Error extracting receipt:", error)
    return NextResponse.json(
      { error: "Failed to extract receipt", extracted: null },
      { status: 500 }
    )
  }
}
