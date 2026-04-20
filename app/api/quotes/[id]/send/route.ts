import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail, getEmailTemplate } from "@/lib/email"
import { generateQuotePDF } from "@/lib/pdf-generator"
import { Session } from "next-auth"
import { getAuthUser } from "@/lib/mobile-auth"

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

// POST /api/quotes/[id]/send - שליחה מחדש של הצעת מחיר במייל
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    if (!user?.id || !user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // קבלת פרטי ההצעה
    const quote = await prisma.quote.findFirst({
      where: {
        id: id,
        companyId: user.companyId,
      },
      include: {
        lead: true,
        client: true,
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

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    // יצירת PDF של הצעת המחיר
    const quotePDF = await generateQuotePDF(quote)

    // יצירת קישור להצעת המחיר
    const quoteUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/quotes/${quote.id}/approve`

    // שם הלקוח
    const customerName = quote.lead?.name || quote.client?.name || "לקוח יקר"
    
    // קביעת סוג המסמך
    const isInvoice = quote.isInvoice || false
    const docTypeName = isInvoice ? 'חשבון עסקה' : 'הצעת מחיר'
    const actionText = isInvoice ? 'לתשלום החשבון' : 'לאישור ותשלום מקדמה'

    // יצירת תוכן אימייל
    const emailContent = getEmailTemplate({
      title: `${docTypeName} - ${quote.quoteNumber}`,
      content: `
        <div dir="rtl" style="text-align: center;">
          <p>שלום ${customerName},</p>
          <p>אנו שולחים לך את ${docTypeName} הבא:</p>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin-top: 0;">${quote.title}</h3>
            <p><strong>מספר ${isInvoice ? 'חשבון' : 'הצעה'}:</strong> ${quote.quoteNumber}</p>
            ${quote.validUntil ? `<p><strong>תוקף עד:</strong> ${new Date(quote.validUntil).toLocaleDateString('he-IL')}</p>` : ''}
            <p style="font-size: 28px; font-weight: bold; color: ${isInvoice ? '#f59e0b' : '#059669'}; margin: 15px 0;">
              סה"כ: ₪${quote.total.toLocaleString('he-IL', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <p style="margin: 30px 0;">המסמך המלא מצורף כקובץ PDF.</p>
          <p style="margin: 30px 0;">${actionText}, לחץ על הכפתור למטה:</p>
          <a href="${quoteUrl}" style="display: inline-block; padding: 15px 40px; background: ${isInvoice ? 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)' : 'linear-gradient(135deg, #6f65e2 0%, #b965e2 100%)'}; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600; font-size: 16px;">
            לחץ כאן ${actionText}
          </a>
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            או העתק את הקישור הבא לדפדפן שלך:<br>
            <span style="word-break: break-all;">${quoteUrl}</span>
          </p>
        </div>
      `,
      footer: "מסמך זה נשלח מ-QuickCRM",
    })

    // שם הקובץ המצורף
    const pdfFileName = `${isInvoice ? 'חשבון_עסקה' : 'הצעת_מחיר'}_${quote.quoteNumber.replace(/\s+/g, '_')}.pdf`

    // שליחת האימייל עם קובץ PDF מצורף
    await sendEmail({
      to: email,
      subject: `${docTypeName} - ${quote.quoteNumber}`,
      html: emailContent,
      attachments: [
        {
          filename: pdfFileName,
          content: quotePDF,
          contentType: 'application/pdf',
        },
      ],
    })

    // עדכון סטטוס ל-SENT אם עדיין בטיוטה
    if (quote.status === "DRAFT") {
      await prisma.quote.update({
        where: { id: id },
        data: {
          status: "SENT",
          issuedAt: new Date(),
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: `${docTypeName} נשלח/ה בהצלחה למייל ${email}`,
    })
  } catch (error: any) {
    console.error("Error sending quote:", error)
    return NextResponse.json(
      {
        error: "Failed to send quote",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
