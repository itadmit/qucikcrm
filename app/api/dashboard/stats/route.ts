import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const companyId = user.companyId

    // Period ranges (Today / Week / Month) — based on receiptDate, falling back to createdAt
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    // Week starts on Sunday (Israel convention)
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    const periodWhere = (from: Date, to: Date) => ({
      companyId,
      OR: [
        { receiptDate: { gte: from, lte: to } },
        { AND: [{ receiptDate: null }, { createdAt: { gte: from, lte: to } }] },
      ],
    })

    // Get stats
    const [
      totalLeads,
      newLeads7Days,
      totalClients,
      activeClients,
      totalProjects,
      openProjects,
      totalBudgets,
      pendingBudgets,
      myTasks,
      upcomingEvents,
      recentNotifications,
      expensesToday,
      expensesWeek,
      expensesMonth,
    ] = await Promise.all([
      prisma.lead.count({ where: { companyId } }),
      prisma.lead.count({
        where: {
          companyId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.client.count({ where: { companyId } }),
      prisma.client.count({ where: { companyId, status: "ACTIVE" } }),
      prisma.project.count({ where: { companyId } }),
      prisma.project.count({
        where: {
          companyId,
          status: { in: ["PLANNING", "IN_PROGRESS"] },
        },
      }),
      prisma.budget.aggregate({
        where: { companyId },
        _sum: { amount: true },
      }),
      prisma.budget.aggregate({
        where: { companyId, status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.task.findMany({
        where: {
          companyId,
          assigneeId: user.id!,
          status: { in: ["TODO", "IN_PROGRESS"] },
        },
        take: 10,
        orderBy: { dueDate: 'asc' },
        include: {
          project: { select: { name: true } },
          assignee: { select: { name: true, email: true } },
        },
      }),
      prisma.event.findMany({
        where: {
          companyId,
          startTime: { gte: new Date() },
        },
        take: 3,
        orderBy: { startTime: 'asc' },
      }),
      prisma.notification.findMany({
        where: {
          companyId,
          userId: user.id!,
        },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.expense.aggregate({
        where: periodWhere(startOfToday, endOfToday),
        _sum: { amount: true, vatAmount: true },
        _count: true,
      }),
      prisma.expense.aggregate({
        where: periodWhere(startOfWeek, endOfToday),
        _sum: { amount: true, vatAmount: true },
        _count: true,
      }),
      prisma.expense.aggregate({
        where: periodWhere(startOfMonth, endOfMonth),
        _sum: { amount: true, vatAmount: true },
        _count: true,
      }),
    ])

    return NextResponse.json({
      leads: {
        total: totalLeads,
        new7Days: newLeads7Days,
      },
      clients: {
        total: totalClients,
        active: activeClients,
      },
      projects: {
        total: totalProjects,
        open: openProjects,
      },
      budgets: {
        total: totalBudgets._sum.amount || 0,
        pending: pendingBudgets._sum.amount || 0,
      },
      expenses: {
        today: {
          total: expensesToday._sum.amount || 0,
          vat: expensesToday._sum.vatAmount || 0,
          count: expensesToday._count,
        },
        week: {
          total: expensesWeek._sum.amount || 0,
          vat: expensesWeek._sum.vatAmount || 0,
          count: expensesWeek._count,
        },
        month: {
          total: expensesMonth._sum.amount || 0,
          vat: expensesMonth._sum.vatAmount || 0,
          count: expensesMonth._count,
        },
      },
      myTasks,
      upcomingEvents,
      recentNotifications,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

