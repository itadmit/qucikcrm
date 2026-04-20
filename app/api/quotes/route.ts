import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Session } from "next-auth"

interface ExtendedSession extends Session {
  user: {
    id: string
    email: string
    name: string
    role: string
    companyId: string
    companyName: string
  }
}

// GET /api/quotes - קבלת כל הצעות המחיר
export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession | null
    if (!session?.user?.id || !session?.user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get("status")
    const leadId = searchParams.get("leadId")
    const clientId = searchParams.get("clientId")
    const projectId = searchParams.get("projectId")
    const isInvoice = searchParams.get("isInvoice")

    const where: any = {
      companyId: session.user.companyId,
    }

    if (status) {
      where.status = status
    }

    if (leadId) {
      where.leadId = leadId
    }

    if (clientId) {
      where.clientId = clientId
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (isInvoice !== null) {
      where.isInvoice = isInvoice === "true"
    }

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(quotes)
  } catch (error) {
    console.error("Error fetching quotes:", error)
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    )
  }
}

// POST /api/quotes - יצירת הצעת מחיר חדשה
export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession | null
    if (!session?.user?.id || !session?.user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      leadId,
      clientId,
      projectId,
      title,
      description,
      templateType = "simple",
      validUntil,
      notes,
      terms,
      items,
      discount = 0,
      tax = 18,
      depositPercent = 40,
      isInvoice = false,
    } = body

    // חישוב subtotal
    let subtotal = 0
    const processedItems = items.map((item: any, index: number) => {
      const itemTotal = item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100)
      subtotal += itemTotal
      return {
        description: item.description,
        richDescription: item.richDescription || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        total: itemTotal,
        position: index,
      }
    })

    // חישוב סה"כ
    const discountAmount = subtotal * (discount / 100)
    const afterDiscount = subtotal - discountAmount
    const taxAmount = afterDiscount * (tax / 100)
    const total = afterDiscount + taxAmount

    // יצירת מספר הצעת מחיר ייחודי עם PostgreSQL advisory lock למניעת race conditions ב-Docker
    // משתמש ב-advisory lock כדי להבטיח שרק instance אחד יכול ליצור מספר בכל זמן
    // ה-lock מבוסס על companyId כדי לאפשר מספרים שונים לכל חברה
    // יוצר hash פשוט מה-companyId עבור ה-advisory lock
    let companyIdHash = 0
    for (let i = 0; i < session.user.companyId.length; i++) {
      companyIdHash = ((companyIdHash << 5) - companyIdHash) + session.user.companyId.charCodeAt(i)
      companyIdHash = companyIdHash & companyIdHash // Convert to 32bit integer
    }
    companyIdHash = Math.abs(companyIdHash)
    const quoteNumber = await prisma.$transaction(async (tx) => {
      // נועל את ה-advisory lock עבור החברה הזו
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${companyIdHash})`
      
      // חיפוש המספר הגבוה ביותר
      const result = await tx.$queryRaw<Array<{ quoteNumber: string }>>`
        SELECT "quoteNumber" 
        FROM quotes 
        WHERE "companyId" = ${session.user.companyId} 
          AND "isTemplate" = false
          AND "quoteNumber" ~ '^Q-[0-9]{3,}$'
        ORDER BY CAST(SUBSTRING("quoteNumber" FROM 'Q-([0-9]+)') AS INTEGER) DESC
        LIMIT 1
      `
      
      let nextNumber = 1
      if (result.length > 0 && result[0]?.quoteNumber) {
        const match = result[0].quoteNumber.match(/^Q-(\d+)$/)
        if (match) {
          const num = parseInt(match[1], 10)
          if (num > 0 && num < 10000) {
            nextNumber = num + 1
          }
        }
      }
      
      return `Q-${String(nextNumber).padStart(3, "0")}`
    })
    
    console.log(`Creating quote with unique number: ${quoteNumber}`)

    // יצירת הצעת המחיר
    const quote = await prisma.quote.create({
      data: {
        companyId: session.user.companyId,
        leadId: leadId || null,
        clientId: clientId || null,
        projectId: projectId || null,
        quoteNumber,
        title,
        description,
        templateType,
        subtotal,
        discount,
        tax,
        total,
        depositPercent,
        isInvoice,
        validUntil: validUntil ? new Date(validUntil) : null,
        notes,
        terms,
        createdBy: session.user.id,
        items: {
          create: processedItems,
        },
      },
      include: {
        lead: true,
        client: true,
        project: true,
        items: true,
      },
    })
    
    console.log(`Successfully created quote with number: ${quote.quoteNumber}`)

    return NextResponse.json(quote)
  } catch (error) {
    console.error("Error creating quote:", error)
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    )
  }
}

