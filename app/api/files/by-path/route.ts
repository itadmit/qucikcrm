import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { getAuthUser } from "@/lib/mobile-auth"

// GET /api/files/by-path?path=<full URL or /uploads/...>
// Serves the file inline. Verifies the path belongs to the user's company.
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const path = req.nextUrl.searchParams.get("path")
    if (!path) {
      return NextResponse.json({ error: "path required" }, { status: 400 })
    }

    // Verify the file belongs to user's company
    const file = await prisma.file.findFirst({
      where: { path, companyId: user.companyId },
    })
    if (!file) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Vercel Blob (or any external) URL — redirect
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return NextResponse.redirect(path)
    }

    // Local file — serve inline
    if (!path.startsWith("/uploads/") || path.includes("..")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 })
    }
    const clean = path.startsWith("/") ? path.slice(1) : path
    const fullPath = join(process.cwd(), clean)
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: "File missing on disk" }, { status: 404 })
    }

    const buffer = await readFile(fullPath)
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": file.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(file.name)}"`,
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error serving file by path:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
