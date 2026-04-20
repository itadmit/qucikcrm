import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create demo company
  const demoCompany = await prisma.company.upsert({
    where: { apiKey: 'demo-company-key' },
    update: {},
    create: {
      name: 'חברת הדגמה',
      plan: 'premium',
      apiKey: 'demo-company-key',
      hmacSecret: 'demo-secret',
    },
  })

  console.log('✅ Company created:', demoCompany.name)

  // Create demo users
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  const demoAdmin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'מנהל הדגמה',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: demoCompany.id,
    },
  })

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@demo.com' },
    update: {},
    create: {
      email: 'user@demo.com',
      name: 'משתמש דמו',
      password: hashedPassword,
      role: 'USER',
      companyId: demoCompany.id,
    },
  })

  console.log('✅ Users created')

  // Create demo pipeline
  const pipeline = await prisma.pipeline.create({
    data: {
      name: 'צינור מכירות ראשי',
      isDefault: true,
      companyId: demoCompany.id,
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

  console.log('✅ Pipeline created')

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
        companyId: demoCompany.id,
        ownerId: demoAdmin.id,
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
        companyId: demoCompany.id,
        ownerId: demoUser.id,
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
        companyId: demoCompany.id,
        ownerId: demoAdmin.id,
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
        companyId: demoCompany.id,
        ownerId: demoAdmin.id,
      },
    }),
  ])

  console.log(`✅ Created ${leads.length} leads`)

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
        companyId: demoCompany.id,
        ownerId: demoAdmin.id,
      },
    }),
    prisma.client.create({
      data: {
        name: 'XYZ Solutions',
        email: 'contact@xyz.com',
        phone: '09-9876543',
        address: 'דרך המלך 50, חיפה',
        status: 'ACTIVE',
        companyId: demoCompany.id,
        ownerId: demoUser.id,
      },
    }),
    prisma.client.create({
      data: {
        name: 'הנדסת קידום',
        email: 'info@kidum.co.il',
        phone: '08-6543210',
        address: 'שד\' בן גוריון 100, באר שבע',
        status: 'ACTIVE',
        companyId: demoCompany.id,
        ownerId: demoAdmin.id,
      },
    }),
  ])

  console.log(`✅ Created ${clients.length} clients`)

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
        companyId: demoCompany.id,
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
        companyId: demoCompany.id,
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
        companyId: demoCompany.id,
        clientId: clients[2].id,
      },
    }),
  ])

  console.log(`✅ Created ${projects.length} projects`)

  // Create demo tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'עיצוב דף הבית',
        description: 'יצירת מוקאפים ועיצוב ויזואלי',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        companyId: demoCompany.id,
        projectId: projects[0].id,
        assigneeId: demoAdmin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'פיתוח ממשק ניהול',
        description: 'בניית ממשק ניהול תוכן בReact',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        companyId: demoCompany.id,
        projectId: projects[0].id,
        assigneeId: demoUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'אינטגרציה עם API',
        description: 'חיבור למערכת החיצונית',
        status: 'TODO',
        priority: 'NORMAL',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        companyId: demoCompany.id,
        projectId: projects[1].id,
        assigneeId: demoAdmin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'בדיקות QA',
        description: 'בדיקות איכות מקיפות',
        status: 'TODO',
        priority: 'URGENT',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        companyId: demoCompany.id,
        projectId: projects[0].id,
        assigneeId: demoUser.id,
      },
    }),
  ])

  console.log(`✅ Created ${tasks.length} tasks`)

  // Create demo budgets
  const budgets = await Promise.all([
    prisma.budget.create({
      data: {
        name: 'תשלום ראשון - אתר',
        amount: 15000,
        status: 'PAID',
        expectedAt: new Date('2024-02-01'),
        notes: 'תשלום ראשון של 3',
        companyId: demoCompany.id,
        projectId: projects[0].id,
        clientId: clients[0].id,
      },
    }),
    prisma.budget.create({
      data: {
        name: 'תשלום שני - אתר',
        amount: 15000,
        status: 'PENDING',
        expectedAt: new Date('2024-03-01'),
        companyId: demoCompany.id,
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
        companyId: demoCompany.id,
        projectId: projects[1].id,
        clientId: clients[1].id,
      },
    }),
  ])

  console.log(`✅ Created ${budgets.length} budgets`)

  // Create demo notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        type: 'task',
        title: 'משימה חדשה הוקצתה לך',
        message: 'פיתוח ממשק ניהול - דחוף',
        companyId: demoCompany.id,
        userId: demoUser.id,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'lead',
        title: 'ליד חדש נוצר',
        message: 'יוסי כהן מ-Facebook Ads',
        companyId: demoCompany.id,
        userId: demoAdmin.id,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'reminder',
        title: 'תזכורת: פגישה היום',
        message: 'פגישה עם לקוח ABC בשעה 14:00',
        companyId: demoCompany.id,
        userId: demoAdmin.id,
        isRead: true,
      },
    }),
  ])

  console.log(`✅ Created ${notifications.length} notifications`)

  console.log('🎉 Seed completed successfully!')
  console.log('\n📧 Demo credentials:')
  console.log('Email: admin@demo.com')
  console.log('Password: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

