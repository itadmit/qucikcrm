import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT - עדכון רישום נוכחות
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
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
      where: { id: params.id }
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
      where: { id: params.id },
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
          attendanceId: params.id,
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
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ודא שהרישום שייך למשתמש או שהמשתמש הוא מנהל
    const attendance = await prisma.attendance.findUnique({
      where: { id: params.id }
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
          attendanceId: params.id,
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
      where: { id: params.id }
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





