import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"
import { extractReceipt } from "@/lib/gemini"
import { readFile } from "fs/promises"
import { join } from "path"

// POST /api/expenses/extract
// body: { fileId?: string, imagePath?: string }
// returns: { amount, vatAmount, vendor, receiptDate, receiptNumber, category, confidence } | null
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { fileId, imagePath } = body

    let path: string | null = null
    let mimeType = "image/jpeg"

    if (fileId) {
      const file = await prisma.file.findFirst({
        where: { id: fileId, companyId: user.companyId },
      })
      if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 404 })
      }
      path = file.path
      if (file.mimeType) mimeType = file.mimeType
    } else if (imagePath) {
      path = imagePath
    }

    if (!path) {
      return NextResponse.json(
        { error: "fileId or imagePath required" },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ extracted: null, reason: "no_api_key" })
    }

    const clean = path.startsWith("/") ? path.slice(1) : path
    const buffer = await readFile(join(process.cwd(), clean))

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
