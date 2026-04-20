import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from "@/lib/mobile-auth"

// PUT - עדכון רישום נוכחות
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { clockIn, clockOut, notes } = body;

    // חישוב סה"כ שעות
    const clockInDate = new Date(clockIn);
    const clockOutDate = new Date(clockOut);
    const totalHours = (clockOutDate.getTime() - clockInDate.getTime()) / (1000 * 60 * 60);

    // ודא שהרישום שייך למשתמש או שהמשתמש הוא מנהל
    const attendance = await prisma.attendance.findUnique({
      where: { id: id }
    });

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance not found' }, { status: 404 });
    }

    if (attendance.userId !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // שמירת השינויים להיסטוריה
    const changes = {
      old: {
        clockIn: attendance.clockIn,
        clockOut: attendance.clockOut,
        totalHours: attendance.totalHours,
        notes: attendance.notes
      },
      new: {
        clockIn: clockInDate,
        clockOut: clockOutDate,
        totalHours,
        notes
      }
    };

    // עדכון הנוכחות
    const updated = await prisma.attendance.update({
      where: { id: id },
      data: {
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

    // תיעוד היסטוריה (אופציונלי)
    try {
      await prisma.attendanceHistory.create({
        data: {
          attendanceId: id,
          editedBy: user.id,
          action: 'updated',
          changes
        }
      });
    } catch (historyError) {
      console.log('Could not create history record (table may not exist yet)');
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
}

// DELETE - מחיקת רישום נוכחות
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ודא שהרישום שייך למשתמש או שהמשתמש הוא מנהל
    const attendance = await prisma.attendance.findUnique({
      where: { id: id }
    });

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance not found' }, { status: 404 });
    }

    if (attendance.userId !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // שמירת נתוני המחיקה להיסטוריה (אופציונלי)
    try {
      await prisma.attendanceHistory.create({
        data: {
          attendanceId: id,
          editedBy: user.id,
          action: 'deleted',
          changes: {
            deleted: {
              clockIn: attendance.clockIn,
              clockOut: attendance.clockOut,
              totalHours: attendance.totalHours,
              notes: attendance.notes,
              date: attendance.date
            }
          }
        }
      });
    } catch (historyError) {
      console.log('Could not create history record (table may not exist yet)');
    }

    await prisma.attendance.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendance' },
      { status: 500 }
    );
  }
}

