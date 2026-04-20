import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from "@/lib/mobile-auth"

/**
 * DELETE /api/payments/[id] - מחיקת תשלום
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request)
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { companyId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // בדיקה שהתשלום קיים ושייך לחברה
    const payment = await prisma.payment.findFirst({
      where: {
        id: id,
        companyId: user.companyId,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // מחיקת התשלום
    await prisma.payment.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete payment' },
      { status: 500 }
    );
  }
}

