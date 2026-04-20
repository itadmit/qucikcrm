import { NextRequest, NextResponse } from "next/server"
import { sendEmail, verifyEmailConnection, getEmailTemplate } from "@/lib/email"
import { getAuthUser } from "@/lib/mobile-auth"

/**
 * Test email sending and verify SMTP connection
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { to, subject, message } = body

    // Verify connection first
    const isConnected = await verifyEmailConnection()
    
    if (!isConnected) {
      return NextResponse.json({ 
        error: "Failed to connect to email server",
        details: "Please check your SMTP configuration"
      }, { status: 500 })
    }

    // Send test email
    await sendEmail({
      to: to || user.email || 'quickcrmil@gmail.com',
      subject: subject || 'בדיקת מערכת האימיילים - QuickCRM',
      html: getEmailTemplate({
        title: 'בדיקת מערכת האימיילים',
        content: `
          <h2>שלום ${user.name}! 👋</h2>
          <p>${message || 'זה אימייל בדיקה ממערכת QuickCRM.'}</p>
          <p>אם קיבלת אימייל זה, המערכת עובדת כראוי! ✅</p>
        `,
        footer: `אימייל זה נשלח מ-QuickCRM ב-${new Date().toLocaleString('he-IL')}`,
      }),
    })

    return NextResponse.json({ 
      success: true,
      message: "Test email sent successfully",
      sentTo: to || user.email,
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json({ 
      error: "Failed to send test email",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}

/**
 * Verify email connection
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isConnected = await verifyEmailConnection()
    
    return NextResponse.json({ 
      connected: isConnected,
      smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        user: process.env.GMAIL_USER,
      }
    })
  } catch (error) {
    console.error("Error verifying email connection:", error)
    return NextResponse.json({ 
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}

