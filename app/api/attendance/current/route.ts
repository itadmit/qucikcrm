import { NextResponse } from 'next/server';
;
;
import { prisma } from '@/lib/prisma';
import { getAuthUser } from "@/lib/mobile-auth"

// GET - קבלת מצב נוכחות נוכחי של היום
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // קבלת תחילת היום ב-00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // קבלת סוף היום ב-23:59:59
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // חיפוש רישום נוכחות של היום
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lte: endOfDay
        }
      }
    });

    if (!attendance) {
      return NextResponse.json({
        isClockedIn: false,
        clockIn: null,
        clockOut: null
      });
    }

    return NextResponse.json({
      isClockedIn: true,
      clockIn: attendance.clockIn,
      clockOut: attendance.clockOut,
      totalHours: attendance.totalHours
    });

  } catch (error) {
    console.error('Error fetching current attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current attendance' },
      { status: 500 }
    );
  }
}

