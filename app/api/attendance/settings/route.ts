import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from "@/lib/mobile-auth"

// GET - קבלת הגדרות עובד
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.employeeSettings.findUnique({
      where: { userId: user.id }
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
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { hourlyRate, monthlyHours, overtimeRate } = body;

    const settings = await prisma.employeeSettings.upsert({
      where: { userId: user.id },
      update: {
        hourlyRate: hourlyRate || 0,
        monthlyHours: monthlyHours || 186,
        overtimeRate: overtimeRate || 1.25
      },
      create: {
        userId: user.id,
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

