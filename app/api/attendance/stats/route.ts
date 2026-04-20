import { NextResponse } from 'next/server';
;
;
import { prisma } from '@/lib/prisma';
import { getAuthUser } from "@/lib/mobile-auth"

// GET - קבלת סטטיסטיקות חודשיות
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // YYYY-MM format
    const allEmployees = searchParams.get('allEmployees') === 'true'; // האם להחזיר כל העובדים

    let startDate, endDate;
    if (month) {
      const [year, monthNum] = month.split('-');
      startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
    } else {
      // חודש נוכחי
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    // בדיקה אם המשתמש הוא מנהל
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN';

    // אם המשתמש הוא מנהל ורוצה לראות את כל העובדים
    if (isAdmin && allEmployees) {
      // שליפת כל העובדים בחברה
      const employees = await prisma.user.findMany({
        where: {
          companyId: currentUser.companyId
        },
        include: {
          employeeSettings: true
        }
      });

      // חישוב סטטיסטיקות לכל עובד
      const employeeStats = await Promise.all(
        employees.map(async (employee) => {
          // שליפת נוכחות של העובד
          const attendances = await prisma.attendance.findMany({
            where: {
              userId: employee.id,
              date: {
                gte: startDate,
                lte: endDate
              }
            }
          });

          const totalHours = attendances.reduce((sum, att) => sum + att.totalHours, 0);
          const workDays = attendances.length;

          const hourlyRate = employee.employeeSettings?.hourlyRate || 0;
          const monthlyHours = employee.employeeSettings?.monthlyHours || 186;
          const overtimeRate = employee.employeeSettings?.overtimeRate || 1.25;

          const regularHours = Math.min(totalHours, monthlyHours);
          const overtimeHours = Math.max(0, totalHours - monthlyHours);

          const regularPay = regularHours * hourlyRate;
          const overtimePay = overtimeHours * hourlyRate * overtimeRate;
          const totalSalary = regularPay + overtimePay;

          return {
            userId: employee.id,
            userName: employee.name,
            userEmail: employee.email,
            totalHours,
            workDays,
            regularHours,
            overtimeHours,
            hourlyRate,
            monthlyHours,
            overtimeRate,
            regularPay,
            overtimePay,
            totalSalary
          };
        })
      );

      // חישוב סיכומים כלליים
      const totals = employeeStats.reduce(
        (acc, emp) => ({
          totalHours: acc.totalHours + emp.totalHours,
          totalSalary: acc.totalSalary + emp.totalSalary,
          totalEmployees: acc.totalEmployees + 1
        }),
        { totalHours: 0, totalSalary: 0, totalEmployees: 0 }
      );

      return NextResponse.json({
        month: month || `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`,
        isAdmin: true,
        employees: employeeStats,
        totals
      });
    }

    // משתמש רגיל - מחזיר רק את הנתונים שלו
    const attendances = await prisma.attendance.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // חישוב סטטיסטיקות
    const totalHours = attendances.reduce((sum, att) => sum + att.totalHours, 0);
    const workDays = attendances.length;

    // שליפת הגדרות עובד
    const settings = await prisma.employeeSettings.findUnique({
      where: { userId: user.id }
    });

    const hourlyRate = settings?.hourlyRate || 0;
    const monthlyHours = settings?.monthlyHours || 186;
    const overtimeRate = settings?.overtimeRate || 1.25;

    // חישוב שעות נוספות
    const regularHours = Math.min(totalHours, monthlyHours);
    const overtimeHours = Math.max(0, totalHours - monthlyHours);

    // חישוב שכר
    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * overtimeRate;
    const totalSalary = regularPay + overtimePay;

    return NextResponse.json({
      month: month || `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`,
      isAdmin: false,
      totalHours,
      workDays,
      regularHours,
      overtimeHours,
      hourlyRate,
      monthlyHours,
      overtimeRate,
      regularPay,
      overtimePay,
      totalSalary,
      attendances: attendances.map(att => ({
        date: att.date,
        clockIn: att.clockIn,
        clockOut: att.clockOut,
        totalHours: att.totalHours
      }))
    });
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

