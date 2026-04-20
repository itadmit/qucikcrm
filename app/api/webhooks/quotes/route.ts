import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { sendQuoteEmail } from "@/lib/email"

// סכמת הבקשה ליצירת הצעת מחיר
const createQuoteSchema = z.object({
  action: z.literal("create_quote"),
  templateName: z.string().optional(), // שם התבנית לשימוש
  templateId: z.string().optional(), // או ID של תבנית
  leadName: z.string().optional(), // שם הליד (יחופש או ייווצר)
  leadId: z.string().optional(), // או ID של ליד קיים
  leadEmail: z.string().email().optional(), // אימייל לליד חדש או לעדכון
  leadPhone: z.string().optional(),
  title: z.string().optional(), // כותרת מותאמת (אופציונלי)
  amount: z.number().optional(), // סכום מותאם - יחליף את הפריט הראשון
  sendEmail: z.boolean().default(true), // האם לשלוח במייל
  sendWhatsApp: z.boolean().default(false), // האם להחזיר לינק וואטסאפ
  notes: z.string().optional(),
})

// סכמת הבקשה לקבלת תבניות
const listTemplatesSchema = z.object({
  action: z.literal("list_templates"),
})

// סכמת הבקשה לקבלת לידים
const listLeadsSchema = z.object({
  action: z.literal("list_leads"),
  search: z.string().optional(),
})

// סכמת הבקשה ליצירת ליד
const createLeadSchema = z.object({
  action: z.literal("create_lead"),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// סכמת הבקשה לקבלת API Key
const getApiKeySchema = z.object({
  action: z.literal("get_api_key"),
  email: z.string().email(),
  password: z.string(),
})

const requestSchema = z.discriminatedUnion("action", [
  createQuoteSchema,
  listTemplatesSchema,
  listLeadsSchema,
  createLeadSchema,
  getApiKeySchema,
])

// פונקציה לייצור מספר הצעה
async function generateQuoteNumber(companyId: string): Promise<string> {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")

  const lastQuote = await prisma.quote.findFirst({
    where: {
      companyId,
      quoteNumber: {
        startsWith: `Q${year}${month}`,
      },
    },
    orderBy: { quoteNumber: "desc" },
  })

  let sequence = 1
  if (lastQuote) {
    const lastSequence = parseInt(lastQuote.quoteNumber.slice(-4))
    sequence = lastSequence + 1
  }

  return `Q${year}${month}${String(sequence).padStart(4, "0")}`
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    // Get API Key from header
    const apiKey = req.headers.get("X-API-KEY")

    // Parse body first to check if it's a get_api_key action
    const body = await req.json()
    
    // אם זו בקשה לקבלת API Key - לא צריך API Key
    if (body.action === "get_api_key") {
      const validated = getApiKeySchema.parse(body)
      
      // חיפוש משתמש לפי אימייל וסיסמה
      const user = await prisma.user.findUnique({
        where: { email: validated.email },
        include: { company: true },
      })

      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        )
      }

      // בדיקת סיסמה (באופן פשוט - יש לשפר בייצור)
      const bcrypt = require("bcryptjs")
      const isValid = await bcrypt.compare(validated.password, user.password)

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        )
      }

      return NextResponse.json({
        apiKey: user.company.apiKey,
        companyName: user.company.name,
        userName: user.name,
      })
    }

    // לכל שאר הפעולות - צריך API Key
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API Key. Add X-API-KEY header." },
        { status: 401 }
      )
    }

    // Find company by API Key
    const company = await prisma.company.findUnique({
      where: { apiKey },
    })

    if (!company) {
      return NextResponse.json(
        { error: "Invalid API Key" },
        { status: 401 }
      )
    }

    const validatedData = requestSchema.parse(body)

    // טיפול בפעולות שונות
    switch (validatedData.action) {
      case "list_templates": {
        const templates = await prisma.quote.findMany({
          where: {
            companyId: company.id,
            isTemplate: true,
          },
          select: {
            id: true,
            title: true,
            description: true,
            total: true,
          },
          orderBy: { title: "asc" },
        })

        return NextResponse.json({ templates })
      }

      case "list_leads": {
        const where: any = { companyId: company.id }
        
        if (validatedData.search) {
          where.OR = [
            { name: { contains: validatedData.search, mode: "insensitive" } },
            { email: { contains: validatedData.search, mode: "insensitive" } },
          ]
        }

        const leads = await prisma.lead.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
          take: 50,
          orderBy: { name: "asc" },
        })

        return NextResponse.json({ leads })
      }

      case "create_lead": {
        // בדיקת כפילויות לפי אימייל
        if (validatedData.email) {
          const existingLead = await prisma.lead.findFirst({
            where: {
              companyId: company.id,
              email: validatedData.email,
            },
          })

          if (existingLead) {
            return NextResponse.json({
              success: false,
              error: "Lead with this email already exists",
              existingLead: {
                id: existingLead.id,
                name: existingLead.name,
                email: existingLead.email,
              },
            }, { status: 409 })
          }
        }

        // יצירת הליד
        const lead = await prisma.lead.create({
          data: {
            companyId: company.id,
            name: validatedData.name,
            email: validatedData.email || null,
            phone: validatedData.phone || null,
            source: validatedData.source || "Siri Shortcut",
            notes: validatedData.notes || null,
            tags: validatedData.tags || [],
            status: "NEW",
          },
        })

        const duration = Date.now() - startTime

        // רישום לוג
        await prisma.webhookLog.create({
          data: {
            companyId: company.id,
            type: "lead_created",
            payload: body,
            statusCode: 201,
            response: { id: lead.id },
            durationMs: duration,
            ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
          },
        })

        return NextResponse.json({
          success: true,
          lead: {
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            source: lead.source,
          },
        }, { status: 201 })
      }

      case "create_quote": {
        // מציאת תבנית
        let template = null
        if (validatedData.templateId) {
          template = await prisma.quote.findFirst({
            where: {
              id: validatedData.templateId,
              companyId: company.id,
              isTemplate: true,
            },
            include: { items: true },
          })
        } else if (validatedData.templateName) {
          template = await prisma.quote.findFirst({
            where: {
              companyId: company.id,
              isTemplate: true,
              title: {
                contains: validatedData.templateName,
                mode: "insensitive",
              },
            },
            include: { items: true },
          })
        }

        if (!template && (validatedData.templateId || validatedData.templateName)) {
          return NextResponse.json(
            { error: "Template not found", templateName: validatedData.templateName },
            { status: 404 }
          )
        }

        // מציאת או יצירת ליד
        let lead = null
        if (validatedData.leadId) {
          lead = await prisma.lead.findFirst({
            where: {
              id: validatedData.leadId,
              companyId: company.id,
            },
          })
        } else if (validatedData.leadName) {
          // חיפוש ליד לפי שם
          lead = await prisma.lead.findFirst({
            where: {
              companyId: company.id,
              name: {
                contains: validatedData.leadName,
                mode: "insensitive",
              },
            },
          })

          // אם לא נמצא - יצירת ליד חדש (מספיק אימייל או טלפון)
          if (!lead && (validatedData.leadEmail || validatedData.leadPhone)) {
            lead = await prisma.lead.create({
              data: {
                companyId: company.id,
                name: validatedData.leadName,
                email: validatedData.leadEmail || null,
                phone: validatedData.leadPhone || null,
                source: "Siri Shortcut",
                status: "NEW",
              },
            })
          }
        }

        if (!lead) {
          return NextResponse.json(
            { 
              error: "Lead not found and could not be created",
              hint: "Provide leadId, or leadName with leadEmail/leadPhone to create a new lead"
            },
            { status: 404 }
          )
        }

        // עדכון אימייל אם ניתן חדש
        if (validatedData.leadEmail && validatedData.leadEmail !== lead.email) {
          lead = await prisma.lead.update({
            where: { id: lead.id },
            data: { email: validatedData.leadEmail },
          })
        }

        // בדיקה שיש אימייל לשליחה (רק אם רוצים לשלוח מייל)
        if (validatedData.sendEmail && !lead.email) {
          // אם אין מייל אבל יש טלפון, נציע וואטסאפ במקום
          if (lead.phone) {
            // נמשיך ונציע וואטסאפ בתשובה
          } else {
            return NextResponse.json(
              { error: "Lead has no email or phone. Cannot send quote." },
              { status: 400 }
            )
          }
        }

        // יצירת הצעת מחיר
        const quoteNumber = await generateQuoteNumber(company.id)
        
        // הכנת פריטים - אם יש amount מותאם, נשנה את הפריט הראשון
        let itemsToCreate = template?.items || []
        if (validatedData.amount && itemsToCreate.length > 0) {
          itemsToCreate = itemsToCreate.map((item, index) => {
            if (index === 0) {
              // הפריט הראשון - מחליף את המחיר
              return {
                ...item,
                unitPrice: validatedData.amount!,
                quantity: 1,
                discount: 0,
              }
            }
            return item
          })
        }
        
        // חישוב סכומים
        const subtotal = itemsToCreate.reduce(
          (sum, item) => sum + (item.quantity || 1) * item.unitPrice * (1 - (item.discount || 0) / 100),
          0
        ) || validatedData.amount || 0
        const discount = template?.discount || 0
        const tax = template?.tax || 18
        const afterDiscount = subtotal * (1 - discount / 100)
        const total = afterDiscount * (1 + tax / 100)

        const quote = await prisma.quote.create({
          data: {
            companyId: company.id,
            leadId: lead.id,
            quoteNumber,
            title: validatedData.title || template?.title || "הצעת מחיר",
            description: template?.description,
            templateType: template?.templateType || "simple",
            status: "DRAFT",
            subtotal,
            discount,
            tax,
            total,
            notes: validatedData.notes || template?.notes,
            terms: template?.terms,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ימים
            isTemplate: false,
            items: itemsToCreate.length > 0 ? {
              create: itemsToCreate.map((item, index) => ({
                description: item.description,
                richDescription: item.richDescription,
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice,
                discount: item.discount || 0,
                total: (item.quantity || 1) * item.unitPrice * (1 - (item.discount || 0) / 100),
                position: index,
              })),
            } : validatedData.amount ? {
              // אם אין תבנית אבל יש סכום - יצירת פריט בסיסי
              create: [{
                description: "שירות",
                quantity: 1,
                unitPrice: validatedData.amount,
                discount: 0,
                total: validatedData.amount,
                position: 0,
              }]
            } : undefined,
          },
          include: { 
            items: true,
            lead: true,
          },
        })

        let emailSent = false
        let emailError = null
        let whatsappUrl = null

        const approveUrl = `${process.env.NEXTAUTH_URL || "https://quick-crm.com"}/quotes/${quote.id}/approve`

        // שליחת מייל אם נדרש ויש אימייל
        if (validatedData.sendEmail && lead.email) {
          try {
            await sendQuoteEmail({
              to: lead.email,
              leadName: lead.name,
              quoteNumber: quote.quoteNumber,
              quoteTitle: quote.title,
              total: quote.total,
              approveUrl,
              validUntil: quote.validUntil,
            })

            // עדכון סטטוס ל-SENT
            await prisma.quote.update({
              where: { id: quote.id },
              data: { 
                status: "SENT",
                issuedAt: new Date(),
              },
            })

            emailSent = true
          } catch (error) {
            console.error("Failed to send email:", error)
            emailError = error instanceof Error ? error.message : "Failed to send email"
          }
        }

        // URLs שימושיים
        const pdfUrl = `${process.env.NEXTAUTH_URL || "https://quick-crm.com"}/api/quotes/${quote.id}/pdf`

        // יצירת לינק וואטסאפ אם יש טלפון (תמיד מוחזר אם יש טלפון)
        if (lead.phone) {
          // ניקוי מספר הטלפון
          let cleanPhone = lead.phone.replace(/\D/g, '')
          // הוספת קידומת ישראל אם צריך
          if (cleanPhone.startsWith('0')) {
            cleanPhone = '972' + cleanPhone.substring(1)
          } else if (!cleanPhone.startsWith('972')) {
            cleanPhone = '972' + cleanPhone
          }
          
          const message = encodeURIComponent(
            `שלום ${lead.name},\n\n` +
            `שמחים לשלוח לך הצעת מחיר:\n` +
            `📄 מספר: ${quote.quoteNumber}\n` +
            `💰 סכום: ₪${quote.total.toLocaleString('he-IL')}\n\n` +
            `📎 להורדת PDF: ${pdfUrl}\n\n` +
            `✅ לצפייה ואישור: ${approveUrl}`
          )
          
          whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`
        }

        const duration = Date.now() - startTime

        // רישום לוג
        await prisma.webhookLog.create({
          data: {
            companyId: company.id,
            type: "quote_created",
            payload: body,
            statusCode: 201,
            response: {
              quoteId: quote.id,
              quoteNumber: quote.quoteNumber,
              emailSent,
            },
            durationMs: duration,
            ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
          },
        })

        return NextResponse.json({
          success: true,
          quote: {
            id: quote.id,
            quoteNumber: quote.quoteNumber,
            title: quote.title,
            total: quote.total,
            status: emailSent ? "SENT" : "DRAFT",
            approveUrl,
            pdfUrl, // לינק ישיר להורדת PDF
          },
          lead: {
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
          },
          emailSent,
          emailError,
          whatsappUrl, // לינק לשליחה בוואטסאפ עם הודעה מוכנה (כולל לינק ל-PDF)
          canSendWhatsApp: !!lead.phone,
          canSendEmail: !!lead.email,
        }, { status: 201 })
      }
    }
  } catch (error) {
    const duration = Date.now() - startTime

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// GET - הפניה לתיעוד
export async function GET() {
  // הפניה לעמוד התיעוד המעוצב
  return NextResponse.redirect(new URL("/api/webhooks/quotes/docs", process.env.NEXTAUTH_URL || "https://quick-crm.com"))
}

// תיעוד JSON (לשימוש פנימי)
export async function OPTIONS() {
  return NextResponse.json({
    name: "QuickCRM Quotes Webhook API",
    version: "1.0",
    description: "API ליצירת הצעות מחיר מ-Siri Shortcuts או כל אפליקציה אחרת",
    endpoints: {
      "POST /api/webhooks/quotes": {
        description: "בצע פעולות על הצעות מחיר",
        headers: {
          "X-API-KEY": "מפתח ה-API של החברה שלך (נדרש לכל הפעולות חוץ מ-get_api_key)",
          "Content-Type": "application/json",
        },
        actions: {
          get_api_key: {
            description: "קבל את מפתח ה-API שלך (לא דורש X-API-KEY)",
            body: {
              action: "get_api_key",
              email: "האימייל שלך במערכת",
              password: "הסיסמה שלך",
            },
            response: {
              apiKey: "המפתח הייחודי שלך",
              companyName: "שם החברה",
              userName: "שמך",
            },
          },
          list_templates: {
            description: "קבל רשימת תבניות הצעות מחיר",
            body: { action: "list_templates" },
            response: {
              templates: [
                { id: "...", title: "שם התבנית", total: 1000 }
              ],
            },
          },
          list_leads: {
            description: "קבל רשימת לידים",
            body: {
              action: "list_leads",
              search: "(אופציונלי) חיפוש לפי שם או אימייל",
            },
            response: {
              leads: [
                { id: "...", name: "שם הליד", email: "...", phone: "..." }
              ],
            },
          },
          create_lead: {
            description: "צור ליד חדש",
            body: {
              action: "create_lead",
              name: "שם הליד (חובה)",
              email: "(אופציונלי) אימייל",
              phone: "(אופציונלי) טלפון",
              source: "(אופציונלי) מקור - ברירת מחדל: Siri Shortcut",
              notes: "(אופציונלי) הערות",
              tags: "(אופציונלי) מערך תגיות",
            },
            response: {
              success: true,
              lead: {
                id: "...",
                name: "שם הליד",
                email: "...",
                phone: "...",
                source: "...",
              },
            },
          },
          create_quote: {
            description: "צור הצעת מחיר ושלח במייל",
            body: {
              action: "create_quote",
              templateName: "(אופציונלי) שם התבנית לשימוש",
              templateId: "(אופציונלי) ID של תבנית",
              leadName: "(אופציונלי) שם הליד - יחופש או ייווצר",
              leadId: "(אופציונלי) ID של ליד קיים",
              leadEmail: "(אופציונלי) אימייל - לליד חדש או לעדכון קיים",
              sendEmail: "(ברירת מחדל: true) האם לשלוח במייל",
              notes: "(אופציונלי) הערות",
            },
            response: {
              success: true,
              quote: {
                id: "...",
                quoteNumber: "Q202501...",
                title: "...",
                total: 1000,
                approveUrl: "https://quick-crm.com/quotes/.../approve",
              },
              lead: { id: "...", name: "...", email: "..." },
              emailSent: true,
            },
          },
        },
      },
    },
    siriShortcutExample: {
      description: "דוגמה ל-Siri Shortcut",
      steps: [
        "1. הוסף פעולת 'Get Contents of URL'",
        "2. URL: https://quick-crm.com/api/webhooks/quotes",
        "3. Method: POST",
        "4. Headers: X-API-KEY = המפתח שלך, Content-Type = application/json",
        "5. Body: JSON עם הפרמטרים הנדרשים",
      ],
    },
  })
}

