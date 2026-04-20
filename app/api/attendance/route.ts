import { NextResponse } from 'next/server';
;
;
import { prisma } from '@/lib/prisma';
import { getAuthUser } from "@/lib/mobile-auth"

// GET - קבלת כל רישומי הנוכחות
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // YYYY-MM format
    const userId = searchParams.get('userId');

    const user = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // בנה את ה-filter
    const where: any = {
      companyId: user.companyId,
    };

    // אם מבוקש משתמש ספציפי
    if (userId) {
      where.userId = userId;
    } else {
      // אחרת, הצג רק של המשתמש המחובר
      where.userId = user.id;
    }

    // אם מבוקש חודש ספציפי
    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendances' },
      { status: 500 }
    );
  }
}

// POST - יצירת רישום נוכחות חדש
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { date, clockIn, clockOut, notes } = body;

    // חישוב סה"כ שעות
    const clockInDate = new Date(clockIn);
    const clockOutDate = new Date(clockOut);
    const totalHours = (clockOutDate.getTime() - clockInDate.getTime()) / (1000 * 60 * 60);

    // בדוק אם כבר קיים רישום לתאריך הזה
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: dateObj
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'כבר קיים רישום נוכחות לתאריך זה' },
        { status: 400 }
      );
    }

    // יצירת רישום נוכחות והיסטוריה בטרנזקציה
    const attendance = await prisma.attendance.create({
      data: {
        companyId: user.companyId,
        userId: user.id,
        date: dateObj,
        clockIn: clockInDate,
        clockOut: clockOutDate,
        totalHours,
        notes
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    // תיעוד יצירה (אופציונלי - אם הטבלה קיימת)
    try {
      await prisma.attendanceHistory.create({
        data: {
          attendanceId: attendance.id,
          editedBy: user.id,
          action: 'created',
          changes: {
            created: {
              clockIn: clockInDate,
              clockOut: clockOutDate,
              totalHours,
              notes,
              date: dateObj
            }
          }
        }
      });
    } catch (historyError) {
      console.log('Could not create history record (table may not exist yet)');
    }

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to create attendance' },
      { status: 500 }
    );
  }
}

