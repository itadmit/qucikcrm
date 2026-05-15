import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { getAuthUser } from "@/lib/mobile-auth"

const HAS_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const entityType = formData.get("entityType") as string
    const entityId = formData.get("entityId") as string
    const clientId = formData.get("clientId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (!entityType || !entityId) {
      return NextResponse.json({ error: "Missing entityType or entityId" }, { status: 400 })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileName = `${Date.now()}-${safeName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    let storedPath: string

    if (HAS_BLOB) {
      // Production / preview on Vercel — use Vercel Blob storage
      const blob = await put(
        `${user.companyId}/${entityType}/${fileName}`,
        buffer,
        {
          access: "public",
          contentType: file.type || "application/octet-stream",
          addRandomSuffix: true, // unguessable URL component
        }
      )
      storedPath = blob.url // full https:// URL
    } else {
      // Local dev — write to ./uploads/<entityType>/...
      const uploadsDir = join(process.cwd(), "uploads", entityType)
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      const filePath = join(uploadsDir, fileName)
      await writeFile(filePath, buffer)
      storedPath = `/uploads/${entityType}/${fileName}`
    }

    const fileRecord = await prisma.file.create({
      data: {
        companyId: user.companyId,
        entityType,
        entityId,
        path: storedPath,
        name: file.name,
        size: buffer.length,
        mimeType: file.type || null,
        uploadedBy: user.id,
        clientId: clientId || null,
      },
    })

    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        name: fileRecord.name,
        path: fileRecord.path,
        size: fileRecord.size,
        mimeType: fileRecord.mimeType,
        createdAt: fileRecord.createdAt,
      },
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
