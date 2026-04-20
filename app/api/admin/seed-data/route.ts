import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only allow admins to seed data
    const user = session?.user as { companyId?: string; role?: string; id?: string; email?: string } | null
    if (!user || !user.companyId || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 })
    }

    const companyId = user.companyId
    const userId = user.id!

    console.log('🌱 Starting seed for company:', companyId)

    // Create demo pipeline
    const pipeline = await prisma.pipeline.create({
      data: {
        name: 'צינור מכירות ראשי',
        isDefault: true,
        companyId,
        stages: {
          create: [
            { name: 'ליד חדש', position: 1, winProbability: 10, color: '#3B82F6' },
            { name: 'יצירת קשר', position: 2, winProbability: 25, color: '#F59E0B' },
            { name: 'מתאים', position: 3, winProbability: 50, color: '#8B5CF6' },
            { name: 'הצעת מחיר', position: 4, winProbability: 75, color: '#F97316' },
            { name: 'משא ומתן', position: 5, winProbability: 90, color: '#10B981' },
          ],
        },
      },
    })

    // Create demo leads
    const leads = await Promise.all([
      prisma.lead.create({
        data: {
          name: 'יוסי כהן',
          email: 'yossi@example.com',
          phone: '050-1234567',
          source: 'Facebook',
          status: 'NEW',
          notes: 'מעוניין באתר חדש לעסק',
          companyId,
          ownerId: userId,
        },
      }),
      prisma.lead.create({
        data: {
          name: 'שרה לוי',
          email: 'sara@example.com',
          phone: '052-9876543',
          source: 'Google',
          status: 'CONTACTED',
          notes: 'דיברנו בטלפון, מעוניינת במערכת CRM',
          companyId,
          ownerId: userId,
        },
      }),
      prisma.lead.create({
        data: {
          name: 'דוד מזרחי',
          email: 'david@tech.co.il',
          phone: '054-5555555',
          source: 'המלצה',
          status: 'QUALIFIED',
          notes: 'חברת הייטק מתעניינת בפיתוח אפליקציה',
          companyId,
          ownerId: userId,
        },
      }),
      prisma.lead.create({
        data: {
          name: 'רחל אברהם',
          email: 'rachel@store.com',
          phone: '053-7777777',
          source: 'אתר',
          status: 'PROPOSAL',
          notes: 'שלחנו הצעת מחיר למערכת ניהול מלאי',
          companyId,
          ownerId: userId,
        },
      }),
      prisma.lead.create({
        data: {
          name: 'משה ישראלי',
          email: 'moshe@biz.co.il',
          phone: '050-8888888',
          source: 'טלפון',
          status: 'NEGOTIATION',
          notes: 'במשא ומתן על פרויקט גדול',
          companyId,
          ownerId: userId,
        },
      }),
    ])

    // Create demo clients
    const clients = await Promise.all([
      prisma.client.create({
        data: {
          name: 'חברת ABC בע"מ',
          email: 'info@abc.co.il',
          phone: '03-5551234',
          address: 'רחוב הרצל 1, תל אביב',
          status: 'ACTIVE',
          notes: 'לקוח VIP - תשומת לב מיוחדת',
          companyId,
          ownerId: userId,
        },
      }),
      prisma.client.create({
        data: {
          name: 'XYZ Solutions',
          email: 'contact@xyz.com',
          phone: '09-9876543',
          address: 'דרך המלך 50, חיפה',
          status: 'ACTIVE',
          companyId,
          ownerId: userId,
        },
      }),
      prisma.client.create({
        data: {
          name: 'הנדסת קידום',
          email: 'info@kidum.co.il',
          phone: '08-6543210',
          address: 'שד\' בן גוריון 100, באר שבע',
          status: 'ACTIVE',
          companyId,
          ownerId: userId,
        },
      }),
      prisma.client.create({
        data: {
          name: 'דיגיטל פרו',
          email: 'hello@digitalpro.co.il',
          phone: '04-7654321',
          address: 'רחוב הנשיא 25, ירושלים',
          status: 'ACTIVE',
          companyId,
          ownerId: userId,
        },
      }),
    ])

    // Create demo projects
    const projects = await Promise.all([
      prisma.project.create({
        data: {
          name: 'פיתוח אתר תדמית',
          description: 'אתר תדמית מודרני עם ממשק ניהול תוכן',
          status: 'IN_PROGRESS',
          budget: 45000,
          progress: 60,
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-03-30'),
          companyId,
          clientId: clients[0].id,
        },
      }),
      prisma.project.create({
        data: {
          name: 'מערכת ניהול מלאי',
          description: 'מערכת מקיפה לניהול מלאי והזמנות',
          status: 'IN_PROGRESS',
          budget: 120000,
          progress: 35,
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-06-30'),
          companyId,
          clientId: clients[1].id,
        },
      }),
      prisma.project.create({
        data: {
          name: 'אפליקציית מובייל',
          description: 'אפליקציית React Native עבור iOS ו-Android',
          status: 'PLANNING',
          budget: 200000,
          progress: 10,
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-09-30'),
          companyId,
          clientId: clients[2].id,
        },
      }),
      prisma.project.create({
        data: {
          name: 'מיתוג ועיצוב',
          description: 'עיצוב לוגו, מיתוג ומדיה חברתית',
          status: 'COMPLETED',
          budget: 25000,
          progress: 100,
          startDate: new Date('2023-11-01'),
          endDate: new Date('2024-01-15'),
          companyId,
          clientId: clients[3].id,
        },
      }),
    ])

    // Create demo tasks
    const tasks = await Promise.all([
      prisma.task.create({
        data: {
          title: 'עיצוב דף הבית',
          description: 'יצירת מוקאפים ועיצוב ויזואלי',
          status: 'DONE',
          priority: 'HIGH',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          companyId,
          projectId: projects[0].id,
          assigneeId: userId,
        },
      }),
      prisma.task.create({
        data: {
          title: 'פיתוח ממשק ניהול',
          description: 'בניית ממשק ניהול תוכן בReact',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          companyId,
          projectId: projects[0].id,
          assigneeId: userId,
        },
      }),
      prisma.task.create({
        data: {
          title: 'אינטגרציה עם API',
          description: 'חיבור למערכת החיצונית',
          status: 'TODO',
          priority: 'NORMAL',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          companyId,
          projectId: projects[1].id,
          assigneeId: userId,
        },
      }),
      prisma.task.create({
        data: {
          title: 'בדיקות QA',
          description: 'בדיקות איכות מקיפות',
          status: 'TODO',
          priority: 'URGENT',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          companyId,
          projectId: projects[0].id,
          assigneeId: userId,
        },
      }),
      prisma.task.create({
        data: {
          title: 'תיעוד מערכת',
          description: 'כתיבת תיעוד מקיף למשתמש הקצה',
          status: 'TODO',
          priority: 'LOW',
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          companyId,
          projectId: projects[1].id,
          assigneeId: userId,
        },
      }),
      prisma.task.create({
        data: {
          title: 'הדרכת לקוח',
          description: 'הדרכה למערכת החדשה',
          status: 'TODO',
          priority: 'NORMAL',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          companyId,
          projectId: projects[0].id,
          assigneeId: userId,
        },
      }),
    ])

    // Create demo budgets
    const budgets = await Promise.all([
      prisma.budget.create({
        data: {
          name: 'תשלום ראשון - אתר תדמית',
          amount: 15000,
          status: 'PAID',
          expectedAt: new Date('2024-02-01'),
          notes: 'תשלום ראשון של 3',
          companyId,
          projectId: projects[0].id,
          clientId: clients[0].id,
        },
      }),
      prisma.budget.create({
        data: {
          name: 'תשלום שני - אתר תדמית',
          amount: 15000,
          status: 'PENDING',
          expectedAt: new Date('2024-03-01'),
          companyId,
          projectId: projects[0].id,
          clientId: clients[0].id,
        },
      }),
      prisma.budget.create({
        data: {
          name: 'תשלום שלישי - אתר תדמית',
          amount: 15000,
          status: 'PENDING',
          expectedAt: new Date('2024-04-01'),
          companyId,
          projectId: projects[0].id,
          clientId: clients[0].id,
        },
      }),
      prisma.budget.create({
        data: {
          name: 'מקדמה - מערכת מלאי',
          amount: 40000,
          status: 'WON',
          expectedAt: new Date('2024-02-15'),
          companyId,
          projectId: projects[1].id,
          clientId: clients[1].id,
        },
      }),
      prisma.budget.create({
        data: {
          name: 'הצעת מחיר - מיתוג',
          amount: 25000,
          status: 'WON',
          expectedAt: new Date('2023-11-15'),
          companyId,
          projectId: projects[3].id,
          clientId: clients[3].id,
        },
      }),
    ])

    // Create demo notifications
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          type: 'task',
          title: 'משימה חדשה הוקצתה לך',
          message: 'פיתוח ממשק ניהול - דחוף',
          companyId,
          userId,
          isRead: false,
        },
      }),
      prisma.notification.create({
        data: {
          type: 'lead',
          title: 'ליד חדש נוצר',
          message: 'יוסי כהן מ-Facebook Ads',
          companyId,
          userId,
          isRead: false,
        },
      }),
      prisma.notification.create({
        data: {
          type: 'reminder',
          title: 'תזכורת: משימה מתקרבת',
          message: 'בדיקות QA - תאריך יעד בעוד 3 ימים',
          companyId,
          userId,
          isRead: false,
        },
      }),
      prisma.notification.create({
        data: {
          type: 'document',
          title: 'תשלום התקבל',
          message: 'תשלום של 15,000 ₪ מלקוח ABC',
          companyId,
          userId,
          isRead: true,
        },
      }),
    ])

    // Create demo email templates
    const emailTemplates = await Promise.all([
      prisma.emailTemplate.create({
        data: {
          name: 'ברוכים הבאים',
          subject: 'ברוכים הבאים ל{{company_name}}',
          body: 'שלום {{customer_name}},\n\nשמחים שהצטרפת אלינו!\n\nבברכה,\nצוות {{company_name}}',
          variables: ['customer_name', 'company_name'],
          companyId,
        },
      }),
      prisma.emailTemplate.create({
        data: {
          name: 'הצעת מחיר',
          subject: 'הצעת מחיר מ-{{company_name}}',
          body: 'שלום {{customer_name}},\n\nמצורפת הצעת המחיר עבור {{project_name}}.\n\nסכום: {{amount}} ₪\n\nנשמח לשמוע ממך,\n{{sender_name}}',
          variables: ['customer_name', 'company_name', 'project_name', 'amount', 'sender_name'],
          companyId,
        },
      }),
      prisma.emailTemplate.create({
        data: {
          name: 'תזכורת לפגישה',
          subject: 'תזכורת: פגישה מחר ב-{{time}}',
          body: 'שלום {{customer_name}},\n\nרק להזכיר שיש לנו פגישה מחר ב-{{time}}.\n\nמיקום: {{location}}\n\nנתראה!',
          variables: ['customer_name', 'time', 'location'],
          companyId,
        },
      }),
    ])

    // Create demo automations
    const automations = await Promise.all([
      prisma.automation.create({
        data: {
          name: 'שליחת אימייל ללידים חדשים',
          description: 'שולח אימייל אוטומטי כאשר ליד חדש נוצר',
          isActive: true,
          trigger: { event: 'lead.created' },
          conditions: { status: 'NEW' },
          actions: { 
            sendEmail: {
              templateId: emailTemplates[0].id,
              to: '{{lead.email}}'
            }
          },
          companyId,
          createdBy: userId,
        },
      }),
      prisma.automation.create({
        data: {
          name: 'התראה על משימות דחופות',
          description: 'שולח התראה כאשר משימה דחופה נוצרת',
          isActive: true,
          trigger: { event: 'task.created' },
          conditions: { priority: 'URGENT' },
          actions: { 
            createNotification: {
              title: 'משימה דחופה חדשה',
              message: '{{task.title}} - דורש טיפול מיידי'
            }
          },
          companyId,
          createdBy: userId,
        },
      }),
      prisma.automation.create({
        data: {
          name: 'עדכון סטטוס ליד אוטומטי',
          description: 'מעדכן סטטוס ליד ל-CONTACTED לאחר 24 שעות',
          isActive: false,
          trigger: { event: 'lead.created' },
          conditions: { status: 'NEW', hoursElapsed: 24 },
          actions: { 
            updateStatus: {
              newStatus: 'CONTACTED'
            }
          },
          companyId,
          createdBy: userId,
        },
      }),
    ])

    // Create demo audit logs
    const auditLogs = await Promise.all([
      prisma.auditLog.create({
        data: {
          action: 'CREATE',
          entityType: 'Lead',
          entityId: leads[0].id,
          diff: { name: leads[0].name, email: leads[0].email },
          companyId,
          userId,
        },
      }),
      prisma.auditLog.create({
        data: {
          action: 'UPDATE',
          entityType: 'Project',
          entityId: projects[0].id,
          diff: { progress: { from: 50, to: 60 } },
          companyId,
          userId,
        },
      }),
      prisma.auditLog.create({
        data: {
          action: 'CREATE',
          entityType: 'Client',
          entityId: clients[0].id,
          diff: { name: clients[0].name },
          companyId,
          userId,
        },
      }),
    ])

    // Create demo task templates
    const taskTemplates = await Promise.all([
      prisma.taskTemplate.create({
        data: {
          name: 'אתר חדש - תהליך מלא',
          description: 'תבנית משימות לפיתוח אתר חדש מאפס',
          tasks: [
            'איסוף דרישות מהלקוח',
            'מחקר מתחרים ושוק',
            'עיצוב Wireframes',
            'עיצוב ויזואלי (UI)',
            'פיתוח דף הבית',
            'פיתוח דפים פנימיים',
            'התאמה למובייל',
            'בדיקות QA',
            'תיקון באגים',
            'העלאה לאוויר',
            'הדרכת לקוח',
          ],
          companyId,
        },
      }),
      prisma.taskTemplate.create({
        data: {
          name: 'קליטת לקוח חדש',
          description: 'תהליך קליטה והטמעה של לקוח חדש',
          tasks: [
            'פגישת היכרות ראשונית',
            'איסוף מסמכים ופרטים',
            'הכנת חוזה',
            'חתימה על חוזה',
            'הקמת חשבון במערכת',
            'הדרכה ראשונית',
            'מעקב שבוע ראשון',
          ],
          companyId,
        },
      }),
      prisma.taskTemplate.create({
        data: {
          name: 'קמפיין שיווקי',
          description: 'תבנית לניהול קמפיין שיווקי',
          tasks: [
            'הגדרת מטרות הקמפיין',
            'מחקר קהל יעד',
            'הכנת קריאייטיב ותוכן',
            'הקמת הקמפיין בפלטפורמות',
            'מעקב יומי ראשון',
            'אופטימיזציה שבועית',
            'דוח ביצועים',
          ],
          companyId,
        },
      }),
    ])

    // Create demo quotes (הצעות מחיר)
    const quotes = await Promise.all([
      prisma.quote.create({
        data: {
          quoteNumber: `Q-${Date.now()}-001`,
          title: 'הצעת מחיר - פיתוח אתר תדמית',
          description: 'הצעת מחיר מפורטת לפיתוח אתר תדמית מודרני',
          status: 'ACCEPTED',
          subtotal: 38135,
          discount: 0,
          tax: 18,
          total: 45000,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          notes: 'תנאי תשלום: 40% מקדמה, 30% באמצע, 30% בסיום',
          terms: 'אחריות: 12 חודשים על באגים. תמיכה: 3 חודשים חינם.',
          templateType: 'detailed',
          depositPercent: 40,
          issuedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          signedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          companyId,
          leadId: leads[3].id,
          createdBy: userId,
          items: {
            create: [
              { description: 'עיצוב UI/UX מותאם אישית', quantity: 1, unitPrice: 8000, discount: 0, total: 8000, position: 1 },
              { description: 'פיתוח דף הבית', quantity: 1, unitPrice: 5000, discount: 0, total: 5000, position: 2 },
              { description: 'פיתוח דפים פנימיים', quantity: 5, unitPrice: 2500, discount: 0, total: 12500, position: 3 },
              { description: 'ממשק ניהול תוכן (CMS)', quantity: 1, unitPrice: 7000, discount: 0, total: 7000, position: 4 },
              { description: 'התאמה למובייל (Responsive)', quantity: 1, unitPrice: 3000, discount: 0, total: 3000, position: 5 },
              { description: 'אופטימיזציה לחיפוש (SEO)', quantity: 1, unitPrice: 2635, discount: 0, total: 2635, position: 6 },
            ],
          },
        },
      }),
      prisma.quote.create({
        data: {
          quoteNumber: `Q-${Date.now()}-002`,
          title: 'הצעת מחיר - מערכת ניהול מלאי',
          description: 'פיתוח מערכת ניהול מלאי מקיפה',
          status: 'SENT',
          subtotal: 101695,
          discount: 0,
          tax: 18,
          total: 120000,
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          notes: 'כולל שנה תמיכה ואחזקה',
          terms: 'תנאי תשלום: 3 תשלומים שווים',
          templateType: 'detailed',
          depositPercent: 33,
          issuedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          companyId,
          leadId: leads[4].id,
          createdBy: userId,
          items: {
            create: [
              { description: 'ניתוח דרישות ואפיון מערכת', quantity: 1, unitPrice: 15000, discount: 0, total: 15000, position: 1 },
              { description: 'עיצוב ממשק משתמש', quantity: 1, unitPrice: 12000, discount: 0, total: 12000, position: 2 },
              { description: 'פיתוח מודול ניהול מלאי', quantity: 1, unitPrice: 25000, discount: 0, total: 25000, position: 3 },
              { description: 'פיתוח מודול הזמנות', quantity: 1, unitPrice: 20000, discount: 0, total: 20000, position: 4 },
              { description: 'פיתוח דוחות וסטטיסטיקות', quantity: 1, unitPrice: 15000, discount: 0, total: 15000, position: 5 },
              { description: 'אינטגרציה עם מערכות קיימות', quantity: 1, unitPrice: 14695, discount: 0, total: 14695, position: 6 },
            ],
          },
        },
      }),
      prisma.quote.create({
        data: {
          quoteNumber: `Q-${Date.now()}-003`,
          title: 'הצעת מחיר - חבילת מיתוג',
          description: 'עיצוב לוגו ומיתוג עסקי מלא',
          status: 'DRAFT',
          subtotal: 21186,
          discount: 0,
          tax: 18,
          total: 25000,
          validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          notes: 'כולל 3 סבבי תיקונים',
          templateType: 'simple',
          depositPercent: 50,
          companyId,
          leadId: leads[2].id,
          createdBy: userId,
          items: {
            create: [
              { description: 'עיצוב לוגו (3 הצעות)', quantity: 1, unitPrice: 5000, discount: 0, total: 5000, position: 1 },
              { description: 'ספר מותג (Brand Book)', quantity: 1, unitPrice: 8000, discount: 0, total: 8000, position: 2 },
              { description: 'עיצוב כרטיסי ביקור', quantity: 1, unitPrice: 1500, discount: 0, total: 1500, position: 3 },
              { description: 'עיצוב נייר מכתבים', quantity: 1, unitPrice: 1500, discount: 0, total: 1500, position: 4 },
              { description: 'עיצוב חתימת מייל', quantity: 1, unitPrice: 800, discount: 0, total: 800, position: 5 },
              { description: 'עיצוב כיסויים לרשתות חברתיות', quantity: 4, unitPrice: 1096.5, discount: 0, total: 4386, position: 6 },
            ],
          },
        },
      }),
    ])

    // Create quote templates (תבניות הצעות מחיר)
    const quoteTemplates = await Promise.all([
      prisma.quote.create({
        data: {
          quoteNumber: `TPL-${Date.now()}-001`,
          title: 'תבנית - אתר תדמית בסיסי',
          description: 'תבנית סטנדרטית לאתר תדמית',
          status: 'DRAFT',
          subtotal: 12712,
          discount: 0,
          tax: 18,
          total: 15000,
          isTemplate: true,
          templateType: 'simple',
          notes: 'תנאי תשלום: 50% מקדמה, 50% בסיום',
          terms: 'אחריות 6 חודשים',
          depositPercent: 50,
          companyId,
          createdBy: userId,
          items: {
            create: [
              { description: 'עיצוב אתר תדמית', quantity: 1, unitPrice: 4000, discount: 0, total: 4000, position: 1 },
              { description: 'פיתוח 5 דפים', quantity: 1, unitPrice: 5000, discount: 0, total: 5000, position: 2 },
              { description: 'התאמה למובייל', quantity: 1, unitPrice: 2000, discount: 0, total: 2000, position: 3 },
              { description: 'הקמה והעלאה', quantity: 1, unitPrice: 1712, discount: 0, total: 1712, position: 4 },
            ],
          },
        },
      }),
      prisma.quote.create({
        data: {
          quoteNumber: `TPL-${Date.now()}-002`,
          title: 'תבנית - חנות אונליין',
          description: 'תבנית לפיתוח חנות מסחר אלקטרוני',
          status: 'DRAFT',
          subtotal: 42373,
          discount: 0,
          tax: 18,
          total: 50000,
          isTemplate: true,
          templateType: 'detailed',
          notes: 'כולל הטמעת סליקה',
          terms: 'אחריות 12 חודשים, תמיכה 6 חודשים',
          depositPercent: 40,
          companyId,
          createdBy: userId,
          items: {
            create: [
              { description: 'עיצוב חנות אונליין', quantity: 1, unitPrice: 10000, discount: 0, total: 10000, position: 1 },
              { description: 'פיתוח חנות WooCommerce/Shopify', quantity: 1, unitPrice: 15000, discount: 0, total: 15000, position: 2 },
              { description: 'הטמעת סליקת אשראי', quantity: 1, unitPrice: 5000, discount: 0, total: 5000, position: 3 },
              { description: 'העלאת 50 מוצרים ראשונים', quantity: 1, unitPrice: 5000, discount: 0, total: 5000, position: 4 },
              { description: 'הגדרת משלוחים ומע"מ', quantity: 1, unitPrice: 3000, discount: 0, total: 3000, position: 5 },
              { description: 'הדרכה לניהול החנות', quantity: 1, unitPrice: 4373, discount: 0, total: 4373, position: 6 },
            ],
          },
        },
      }),
      prisma.quote.create({
        data: {
          quoteNumber: `TPL-${Date.now()}-003`,
          title: 'תבנית - פיתוח אפליקציה',
          description: 'תבנית לפיתוח אפליקציית מובייל',
          status: 'DRAFT',
          subtotal: 84746,
          discount: 0,
          tax: 18,
          total: 100000,
          isTemplate: true,
          templateType: 'detailed',
          notes: 'iOS + Android',
          terms: 'אחריות 12 חודשים, עדכונים חינם לשנה',
          depositPercent: 30,
          companyId,
          createdBy: userId,
          items: {
            create: [
              { description: 'אפיון מלא של האפליקציה', quantity: 1, unitPrice: 15000, discount: 0, total: 15000, position: 1 },
              { description: 'עיצוב UI/UX', quantity: 1, unitPrice: 20000, discount: 0, total: 20000, position: 2 },
              { description: 'פיתוח React Native', quantity: 1, unitPrice: 35000, discount: 0, total: 35000, position: 3 },
              { description: 'פיתוח Backend ו-API', quantity: 1, unitPrice: 20000, discount: 0, total: 20000, position: 4 },
              { description: 'בדיקות ו-QA', quantity: 1, unitPrice: 8000, discount: 0, total: 8000, position: 5 },
              { description: 'העלאה לחנויות (App Store & Google Play)', quantity: 1, unitPrice: 5000, discount: 0, total: 5000, position: 6 },
            ],
          },
        },
      }),
      prisma.quote.create({
        data: {
          quoteNumber: `TPL-${Date.now()}-004`,
          title: 'תבנית - ניהול מדיה חברתית',
          description: 'חבילת ניהול מדיה חברתית חודשית',
          status: 'DRAFT',
          subtotal: 4237,
          discount: 0,
          tax: 18,
          total: 5000,
          isTemplate: true,
          templateType: 'simple',
          notes: 'מחיר חודשי, התחייבות מינימלית 3 חודשים',
          terms: 'חיוב חודשי בתחילת כל חודש',
          depositPercent: 100,
          companyId,
          createdBy: userId,
          items: {
            create: [
              { description: '12 פוסטים חודשיים', quantity: 1, unitPrice: 2400, discount: 0, total: 2400, position: 1 },
              { description: '4 סטוריז שבועיים', quantity: 1, unitPrice: 800, discount: 0, total: 800, position: 2 },
              { description: 'ניהול קהילה ותגובות', quantity: 1, unitPrice: 600, discount: 0, total: 600, position: 3 },
              { description: 'דוח חודשי', quantity: 1, unitPrice: 437, discount: 0, total: 437, position: 4 },
            ],
          },
        },
      }),
    ])

    // Create demo payments (תשלומים)
    const payments = await Promise.all([
      prisma.payment.create({
        data: {
          amount: 18000,
          currency: 'ILS',
          status: 'COMPLETED',
          method: 'CREDIT_CARD',
          description: 'מקדמה 40% - פיתוח אתר תדמית',
          transactionId: `TXN-${Date.now()}-001`,
          paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          companyId,
          clientId: clients[0].id,
          projectId: projects[0].id,
          quoteId: quotes[0].id,
        },
      }),
      prisma.payment.create({
        data: {
          amount: 13500,
          currency: 'ILS',
          status: 'COMPLETED',
          method: 'BANK_TRANSFER',
          description: 'תשלום שני 30% - פיתוח אתר תדמית',
          transactionId: `TXN-${Date.now()}-002`,
          paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          companyId,
          clientId: clients[0].id,
          projectId: projects[0].id,
          quoteId: quotes[0].id,
        },
      }),
      prisma.payment.create({
        data: {
          amount: 13500,
          currency: 'ILS',
          status: 'PENDING',
          method: 'CREDIT_CARD',
          description: 'תשלום אחרון 30% - פיתוח אתר תדמית',
          companyId,
          clientId: clients[0].id,
          projectId: projects[0].id,
          quoteId: quotes[0].id,
        },
      }),
      prisma.payment.create({
        data: {
          amount: 40000,
          currency: 'ILS',
          status: 'COMPLETED',
          method: 'BANK_TRANSFER',
          description: 'מקדמה - מערכת ניהול מלאי',
          transactionId: `TXN-${Date.now()}-003`,
          paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          companyId,
          clientId: clients[1].id,
          projectId: projects[1].id,
        },
      }),
      prisma.payment.create({
        data: {
          amount: 25000,
          currency: 'ILS',
          status: 'COMPLETED',
          method: 'CREDIT_CARD',
          description: 'תשלום מלא - מיתוג ועיצוב',
          transactionId: `TXN-${Date.now()}-004`,
          paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          companyId,
          clientId: clients[3].id,
          projectId: projects[3].id,
        },
      }),
      prisma.payment.create({
        data: {
          amount: 5000,
          currency: 'ILS',
          status: 'PROCESSING',
          method: 'CREDIT_CARD',
          description: 'תשלום חודשי - ניהול מדיה חברתית',
          companyId,
          clientId: clients[2].id,
        },
      }),
    ])

    // Create demo events/meetings
    const now = new Date()
    const events = await Promise.all([
      prisma.event.create({
        data: {
          title: 'פגישת One-on-One עם VP',
          description: 'דיון על התקדמות הפרויקטים והצעות לשיפור',
          startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // בעוד שעתיים
          endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), // שעה אחת
          location: 'Google Meet',
          attendees: ['vp@company.com', user.email || ''],
          companyId,
          createdBy: userId,
        },
      }),
      prisma.event.create({
        data: {
          title: 'פגישת סטטוס פרויקט ABC',
          description: 'עדכון התקדמות ודיון בנושאים פתוחים',
          startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // מחר
          endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 דקות
          location: 'חדר ישיבות 1',
          attendees: [clients[0].email || '', user.email || ''],
          companyId,
          createdBy: userId,
        },
      }),
      prisma.event.create({
        data: {
          title: 'הדרכת לקוח - XYZ',
          description: 'הדרכה למערכת החדשה',
          startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // בעוד 3 ימים
          endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // שעתיים
          location: 'Zoom',
          attendees: [clients[1].email || '', user.email || ''],
          companyId,
          createdBy: userId,
        },
      }),
      prisma.event.create({
        data: {
          title: 'פגישת צוות שבועית',
          description: 'עדכונים שבועיים וסנכרון',
          startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // בעוד שבוע
          endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // שעה
          location: 'משרד',
          attendees: [user.email || '', 'team@company.com'],
          companyId,
          createdBy: userId,
        },
      }),
      prisma.event.create({
        data: {
          title: 'הצגת הצעת מחיר - הנדסת קידום',
          description: 'מצגת והצגת ההצעה ללקוח',
          startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // בעוד 5 ימים
          endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // שעה וחצי
          location: 'משרדי הלקוח',
          attendees: [clients[2].email || '', user.email || ''],
          companyId,
          createdBy: userId,
        },
      }),
    ])

    console.log('✅ Seed completed successfully!')
    console.log(`Created: ${leads.length} leads, ${clients.length} clients, ${projects.length} projects, ${tasks.length} tasks, ${budgets.length} budgets, ${notifications.length} notifications, ${emailTemplates.length} email templates, ${automations.length} automations, ${auditLogs.length} audit logs, ${events.length} events, ${quotes.length} quotes, ${quoteTemplates.length} quote templates, ${payments.length} payments, ${taskTemplates.length} task templates`)

    return NextResponse.json({ 
      success: true,
      message: "נתוני הדמו נטענו בהצלחה!",
      stats: {
        leads: leads.length,
        clients: clients.length,
        projects: projects.length,
        tasks: tasks.length,
        budgets: budgets.length,
        notifications: notifications.length,
        emailTemplates: emailTemplates.length,
        automations: automations.length,
        auditLogs: auditLogs.length,
        events: events.length,
        quotes: quotes.length,
        quoteTemplates: quoteTemplates.length,
        payments: payments.length,
        taskTemplates: taskTemplates.length,
        pipeline: 1,
      }
    })
  } catch (error) {
    console.error("Error seeding data:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

