import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium"
import type { Browser } from "puppeteer-core"
import { readFile } from "fs/promises"
import { join } from "path"

export interface ReceiptForPdf {
  id: string
  amount: number
  vatAmount: number | null
  currency: string
  category: string
  vendor: string | null
  description: string | null
  receiptDate: Date | null
  receiptNumber: string | null
  imagePath: string | null
  createdAt: Date
}

const CATEGORY_LABELS: Record<string, string> = {
  FUEL: "דלק",
  OFFICE: "משרד",
  MEALS: "אוכל ואירוח",
  CLOTHING: "ביגוד",
  EQUIPMENT: "ציוד",
  TRAVEL: "נסיעות",
  COMMUNICATION: "תקשורת",
  OTHER: "אחר",
}

async function createBrowser(): Promise<Browser> {
  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH || (await chromium.executablePath())
  return puppeteer.launch({
    headless: chromium.headless,
    executablePath,
    args: chromium.args.concat([
      "--disable-default-apps",
      "--disable-software-rasterizer",
      "--disable-web-security",
      "--allow-running-insecure-content",
      "--font-render-hinting=none",
    ]),
    timeout: 60000,
    protocolTimeout: 60000,
  })
}

function formatCurrency(amount: number, currency = "ILS"): string {
  const symbol = currency === "ILS" ? "₪" : currency
  return `${symbol}${amount.toLocaleString("he-IL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(date: Date | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("he-IL")
}

async function imageToDataUrl(imagePath: string): Promise<string | null> {
  try {
    // imagePath is like "/uploads/expense/<file>" — strip leading slash, resolve from cwd
    const clean = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
    const fullPath = join(process.cwd(), clean)
    const buffer = await readFile(fullPath)
    const ext = clean.split(".").pop()?.toLowerCase() || "jpeg"
    const mime =
      ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg"
    return `data:${mime};base64,${buffer.toString("base64")}`
  } catch {
    return null
  }
}

async function buildReceiptsHtml(
  receipts: ReceiptForPdf[],
  companyName: string,
  fromDate: Date,
  toDate: Date
): Promise<string> {
  const receiptsWithImages = await Promise.all(
    receipts.map(async (r) => ({
      ...r,
      imageDataUrl: r.imagePath ? await imageToDataUrl(r.imagePath) : null,
    }))
  )

  const totalAmount = receipts.reduce((s, r) => s + r.amount, 0)
  const totalVat = receipts.reduce((s, r) => s + (r.vatAmount || 0), 0)

  const byCategory = receipts.reduce<Record<string, { count: number; total: number }>>(
    (acc, r) => {
      const k = r.category || "OTHER"
      if (!acc[k]) acc[k] = { count: 0, total: 0 }
      acc[k].count++
      acc[k].total += r.amount
      return acc
    },
    {}
  )

  // 4 receipts per page (2x2 grid)
  const receiptCards = receiptsWithImages
    .map(
      (r) => `
    <div class="receipt-card">
      <div class="receipt-image-wrap">
        ${
          r.imageDataUrl
            ? `<img src="${r.imageDataUrl}" alt="receipt" class="receipt-image" />`
            : `<div class="receipt-image-placeholder">אין תמונה</div>`
        }
      </div>
      <div class="receipt-info">
        <div class="receipt-amount">${formatCurrency(r.amount, r.currency)}</div>
        <div class="receipt-meta">
          <span class="category-tag">${CATEGORY_LABELS[r.category] || r.category}</span>
          ${r.vendor ? `<span class="vendor">${r.vendor}</span>` : ""}
        </div>
        <div class="receipt-dates">
          <span>${formatDate(r.receiptDate || r.createdAt)}</span>
          ${r.receiptNumber ? `<span>· #${r.receiptNumber}</span>` : ""}
        </div>
        ${r.vatAmount ? `<div class="vat">מע"מ: ${formatCurrency(r.vatAmount, r.currency)}</div>` : ""}
        ${r.description ? `<div class="description">${r.description}</div>` : ""}
      </div>
    </div>
  `
    )
    .join("")

  const categoryRows = Object.entries(byCategory)
    .map(
      ([cat, data]) => `
    <tr>
      <td>${CATEGORY_LABELS[cat] || cat}</td>
      <td class="num">${data.count}</td>
      <td class="num currency">${formatCurrency(data.total)}</td>
    </tr>`
    )
    .join("")

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<title>הוצאות - ${companyName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;500;600;700&display=swap');
  @page { size: A4; margin: 10mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Noto Sans Hebrew', sans-serif;
    color: #18181b;
    background: #fff;
    font-size: 11px;
    line-height: 1.5;
  }
  .header-page {
    text-align: center;
    padding: 60px 40px 40px;
    page-break-after: always;
  }
  .header-page h1 { font-size: 28px; margin-bottom: 8px; color: #18181b; }
  .header-page .subtitle { font-size: 14px; color: #71717a; margin-bottom: 30px; }
  .header-page .period {
    display: inline-block;
    padding: 10px 20px;
    background: #f4f4f5;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 40px;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 40px;
  }
  .stat-card {
    padding: 20px;
    background: #f9fafb;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }
  .stat-label { font-size: 11px; color: #71717a; margin-bottom: 6px; }
  .stat-value { font-size: 22px; font-weight: 700; color: #18181b; }
  .summary-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  .summary-table th, .summary-table td {
    padding: 10px 12px;
    text-align: right;
    border-bottom: 1px solid #e5e7eb;
  }
  .summary-table th {
    background: #f4f4f5;
    font-weight: 600;
    font-size: 12px;
  }
  .summary-table td.num { text-align: left; font-variant-numeric: tabular-nums; }
  .summary-table td.currency { font-weight: 600; }
  .summary-table tfoot td { font-weight: 700; font-size: 13px; border-top: 2px solid #18181b; }
  .receipts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 130mm;
    gap: 6mm;
    padding: 2mm;
  }
  .receipt-card {
    display: flex;
    flex-direction: column;
    border: 1px solid #d4d4d8;
    border-radius: 6px;
    overflow: hidden;
    page-break-inside: avoid;
    background: #fff;
  }
  .receipt-image-wrap {
    flex: 1;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-height: 0;
  }
  .receipt-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .receipt-image-placeholder {
    color: #a1a1aa;
    font-size: 10px;
  }
  .receipt-info {
    padding: 6px 8px;
    border-top: 1px solid #e5e7eb;
    background: #fff;
    flex-shrink: 0;
  }
  .receipt-amount {
    font-size: 14px;
    font-weight: 700;
    color: #18181b;
    margin-bottom: 3px;
  }
  .receipt-meta {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 2px;
  }
  .category-tag {
    background: #ede9fe;
    color: #6d28d9;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 600;
  }
  .vendor { font-size: 10px; color: #52525b; font-weight: 500; }
  .receipt-dates { font-size: 9px; color: #71717a; }
  .vat { font-size: 9px; color: #71717a; margin-top: 2px; }
  .description {
    font-size: 9px;
    color: #52525b;
    margin-top: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .footer-page-break {
    page-break-before: always;
  }
  .footer-section {
    padding: 20px;
    text-align: center;
    font-size: 10px;
    color: #71717a;
    margin-top: 30px;
  }
</style>
</head>
<body>
  <div class="header-page">
    <h1>דו"ח הוצאות וקבלות</h1>
    <div class="subtitle">${companyName}</div>
    <div class="period">תקופה: ${formatDate(fromDate)} — ${formatDate(toDate)}</div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">סה"כ קבלות</div>
        <div class="stat-value">${receipts.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">סה"כ סכום</div>
        <div class="stat-value">${formatCurrency(totalAmount)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">סה"כ מע"מ</div>
        <div class="stat-value">${formatCurrency(totalVat)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">לפני מע"מ</div>
        <div class="stat-value">${formatCurrency(totalAmount - totalVat)}</div>
      </div>
    </div>

    <table class="summary-table">
      <thead>
        <tr>
          <th>קטגוריה</th>
          <th class="num">כמות</th>
          <th class="num">סה"כ</th>
        </tr>
      </thead>
      <tbody>${categoryRows}</tbody>
      <tfoot>
        <tr>
          <td>סה"כ</td>
          <td class="num">${receipts.length}</td>
          <td class="num currency">${formatCurrency(totalAmount)}</td>
        </tr>
      </tfoot>
    </table>

    <div class="footer-section">
      הופק אוטומטית · ${new Date().toLocaleString("he-IL")}
    </div>
  </div>

  <div class="receipts-grid">
    ${receiptCards}
  </div>
</body>
</html>`
}

export async function generateExpensesPdf(
  receipts: ReceiptForPdf[],
  companyName: string,
  fromDate: Date,
  toDate: Date
): Promise<Buffer> {
  const html = await buildReceiptsHtml(receipts, companyName, fromDate, toDate)

  let browser: Browser | null = null
  try {
    browser = await createBrowser()
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 30000 })
    await new Promise((resolve) => setTimeout(resolve, 500))
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    })
    return Buffer.from(pdfBuffer)
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch {}
    }
  }
}
