import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - קבלת הגדרות עובד
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.employeeSettings.findUnique({
      where: { userId: session.user.id }
    });

    // אם אין הגדרות, החזר ברירות מחדל
    if (!settings) {
      return NextResponse.json({
        hourlyRate: 0,
        monthlyHours: 186,
        overtimeRate: 1.25
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching employee settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST/PUT - עדכון הגדרות עובד
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { hourlyRate, monthlyHours, overtimeRate } = body;

    const settings = await prisma.employeeSettings.upsert({
      where: { userId: session.user.id },
      update: {
        hourlyRate: hourlyRate || 0,
        monthlyHours: monthlyHours || 186,
        overtimeRate: overtimeRate || 1.25
      },
      create: {
        userId: session.user.id,
        hourlyRate: hourlyRate || 0,
        monthlyHours: monthlyHours || 186,
        overtimeRate: overtimeRate || 1.25
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating employee settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}





