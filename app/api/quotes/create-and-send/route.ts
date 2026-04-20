import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail, getEmailTemplate } from "@/lib/email"
import { generateQuotePDF } from "@/lib/pdf-generator"
import { getAuthUser } from "@/lib/mobile-auth"

// POST /api/quotes/create-and-send - יצירת הצעת מחיר ושילוח במייל
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { companyId: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const {
      leadId,
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
    } = body

    // בדיקה שיש leadId
    if (!leadId) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 })
    }

    // קבלת פרטי הלקוח
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        companyId: dbUser.companyId,
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    if (!lead.email) {
      return NextResponse.json(
        { error: "Lead has no email address" },
        { status: 400 }
      )
    }

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

    // יצירת מספר הצעת מחיר ייחודי
    // מחפש את המספר הגבוה ביותר מכל החברות (כי quoteNumber הוא unique גלובלי)
    const allQuotes = await prisma.quote.findMany({
      where: {
        isTemplate: false,
        quoteNumber: {
          startsWith: 'Q-'
        }
      },
      select: {
        quoteNumber: true
      },
      orderBy: {
        quoteNumber: 'desc'
      }
    })
    
    // מוצא את המספר הגבוה ביותר
    let maxNumber = 0
    for (const q of allQuotes) {
      const match = q.quoteNumber.match(/^Q-(\d+)$/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (num > maxNumber) {
          maxNumber = num
        }
      }
    }
    
    // יצירת מספר חדש עם retry loop
    let quote = null
    let attempts = 0
    const maxAttempts = 10
    
    while (!quote && attempts < maxAttempts) {
      attempts++
      const nextNumber = maxNumber + attempts
      const quoteNumber = `Q-${String(nextNumber).padStart(3, "0")}`
      console.log(`Attempt ${attempts}: Creating quote with number: ${quoteNumber}`)
      
      try {
        quote = await prisma.quote.create({
          data: {
            companyId: dbUser.companyId,
            leadId: leadId,
            quoteNumber,
            title,
            description: description || null,
            templateType,
            status: "SENT",
            subtotal,
            discount,
            tax,
            total,
            depositPercent,
            validUntil: validUntil ? new Date(validUntil) : null,
            notes: notes || null,
            terms: terms || null,
            issuedAt: new Date(),
            createdBy: user.id,
            items: {
              create: processedItems,
            },
          },
          include: {
            lead: true,
            items: {
              orderBy: {
                position: "asc",
              },
            },
            company: {
              select: {
                name: true,
                settings: true,
              },
            },
          },
        })
        console.log(`Successfully created quote: ${quoteNumber}`)
      } catch (createError: any) {
        if (createError?.code === 'P2002') {
          console.log(`Quote number ${quoteNumber} already exists, trying next...`)
          continue
        }
        throw createError
      }
    }
    
    if (!quote) {
      throw new Error('Could not generate unique quote number after multiple attempts')
    }
    
    console.log(`Final quote created with number: ${quote.quoteNumber}`)

    // יצירת PDF של הצעת המחיר
    const quotePDF = await generateQuotePDF(quote)

    // יצירת קישור להצעת המחיר
    const quoteUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/quotes/${quote.id}/approve`

    // יצירת תוכן אימייל פשוט
    const emailContent = getEmailTemplate({
      title: "הצעת מחיר חדשה",
      content: `
        <div dir="rtl" style="text-align: center;">
          <p>שלום ${lead.name},</p>
          <p>אנו שמחים לשלוח לך את הצעת המחיר הבאה:</p>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin-top: 0;">${quote.title}</h3>
            <p><strong>מספר הצעה:</strong> ${quote.quoteNumber}</p>
            ${quote.validUntil ? `<p><strong>תוקף עד:</strong> ${new Date(quote.validUntil).toLocaleDateString('he-IL')}</p>` : ''}
            <p style="font-size: 28px; font-weight: bold; color: #059669; margin: 15px 0;">
              סה"כ: ₪${total.toLocaleString('he-IL', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <p style="margin: 30px 0;">ההצעה המלאה מצורפת כקובץ PDF.</p>
          <p style="margin: 30px 0;">לאישור ההצעה ותשלום מקדמה, לחץ על הכפתור למטה:</p>
          <a href="${quoteUrl}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #6f65e2 0%, #b965e2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600; font-size: 16px;">
            לחץ כאן לאישור ותשלום מקדמה
          </a>
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            או העתק את הקישור הבא לדפדפן שלך:<br>
            <span style="word-break: break-all;">${quoteUrl}</span>
          </p>
        </div>
      `,
      footer: "הצעה זו נשלחה אוטומטית מ-QuickCRM",
    })

    // שם הקובץ המצורף
    const pdfFileName = `הצעת_מחיר_${quote.quoteNumber.replace(/\s+/g, '_')}.pdf`

    // שליחת האימייל עם קובץ PDF מצורף
    await sendEmail({
      to: lead.email,
      subject: `הצעת מחיר חדשה - ${quote.quoteNumber}`,
      html: emailContent,
      attachments: [
        {
          filename: pdfFileName,
          content: quotePDF,
          contentType: 'application/pdf',
        },
      ],
    })

    return NextResponse.json({
      success: true,
      quote,
      message: "הצעת המחיר נוצרה ונשלחה במייל בהצלחה",
    })
  } catch (error: any) {
    const errorMessage = error?.message || String(error) || ''
    const errorCode = error?.code || ''
    const errorMeta = error?.meta || {}
    
    console.error("Error creating and sending quote:", {
      error,
      code: errorCode,
      message: errorMessage,
      meta: errorMeta,
      stack: error?.stack,
      name: error?.name,
      constructor: error?.constructor?.name
    })
    
    // בדיקה מקיפה יותר של שגיאת unique constraint
    const isUniqueConstraintError = 
      errorCode === 'P2002' || 
      errorMessage.includes('Unique constraint failed') ||
      errorMessage.includes('quoteNumber') ||
      errorMessage.includes('unique constraint') ||
      (Array.isArray(errorMeta?.target) && errorMeta.target.includes('quoteNumber')) ||
      (errorMeta?.target && String(errorMeta.target).includes('quoteNumber'))
    
    if (isUniqueConstraintError) {
      console.error("Unique constraint error reached outer catch - retry logic failed!")
      return NextResponse.json(
        {
          error: "Failed to create and send quote",
          details: "Could not generate unique quote number after multiple attempts. Please try again.",
          retry: true,
          errorCode: errorCode,
          errorMessage: errorMessage
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      {
        error: "Failed to create and send quote",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

