import { GoogleGenerativeAI } from "@google/generative-ai"

export interface ExtractedReceipt {
  amount: number | null
  vatAmount: number | null
  vendor: string | null
  receiptDate: string | null
  receiptNumber: string | null
  category: string | null
  confidence: number
}

const CATEGORIES_HINT = "FUEL, OFFICE, MEALS, CLOTHING, EQUIPMENT, TRAVEL, COMMUNICATION, OTHER"

const PROMPT = `נתח את הקבלה/חשבונית שבתמונה והחזר JSON בלבד, ללא טקסט נוסף וללא markdown.

מבנה JSON:
{
  "amount": <מספר - סה"כ לתשלום כולל מע"מ>,
  "vatAmount": <מספר - סכום המע"מ אם מצוין>,
  "vendor": "<שם בית העסק>",
  "receiptDate": "<תאריך בפורמט YYYY-MM-DD>",
  "receiptNumber": "<מספר קבלה/חשבונית>",
  "category": "<אחת מהקטגוריות: ${CATEGORIES_HINT}>",
  "confidence": <מספר בין 0 ל-1 - רמת הוודאות הכוללת>
}

הנחיות:
- אם שדה לא ברור או חסר - החזר null
- amount הוא סה"כ לתשלום (לא subtotal)
- בחר category לפי סוג העסק: דלק/חניה/חשמל לרכב=FUEL, מסעדה/בית קפה=MEALS, בגדים=CLOTHING, מחשבים/חומרה=EQUIPMENT, נסיעות/חניה=TRAVEL, סלולר/אינטרנט=COMMUNICATION, ציוד משרדי/דפוס=OFFICE, אחר=OTHER
- confidence: 0.9+ אם הכל ברור, 0.6-0.9 אם רוב ברור, פחות מ-0.6 אם מטושטש/חלקי`

export async function extractReceipt(
  imageBuffer: Buffer,
  mimeType: string,
  apiKey?: string | null
): Promise<ExtractedReceipt | null> {
  const key = apiKey || process.env.GEMINI_API_KEY
  if (!key) {
    return null
  }

  try {
    const genAI = new GoogleGenerativeAI(key)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    })

    const result = await model.generateContent([
      PROMPT,
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType,
        },
      },
    ])

    const text = result.response.text().trim()
    const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim()
    const parsed = JSON.parse(cleaned)

    return {
      amount: typeof parsed.amount === "number" ? parsed.amount : null,
      vatAmount: typeof parsed.vatAmount === "number" ? parsed.vatAmount : null,
      vendor: parsed.vendor || null,
      receiptDate: parsed.receiptDate || null,
      receiptNumber: parsed.receiptNumber || null,
      category: parsed.category || null,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
    }
  } catch (error) {
    console.error("Gemini extraction failed:", error)
    return null
  }
}
