import { NextRequest, NextResponse } from 'next/server';
;
;
import { prisma } from '@/lib/prisma';
import { getAuthUser } from "@/lib/mobile-auth"

interface ExtendedSession {
  user: {
    id: string;
    companyId: string;
  };
}

/**
 * PATCH /api/payments/[id] - עדכון תשלום
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
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

    const body = await request.json();
    const {
      amount,
      currency,
      method,
      status,
      transactionId,
      paymentReference,
      description,
      notes,
      paidAt,
    } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount is required and must be positive' },
        { status: 400 }
      );
    }

    // עדכון התשלום
    const updatedPayment = await prisma.payment.update({
      where: { id: id },
      data: {
        amount: parseFloat(amount),
        currency: currency || payment.currency,
        method: method || payment.method,
        status: status || payment.status,
        transactionId: transactionId !== undefined ? transactionId : payment.transactionId,
        paymentReference: paymentReference !== undefined ? paymentReference : payment.paymentReference,
        description: description !== undefined ? description : payment.description,
        notes: notes !== undefined ? notes : payment.notes,
        paidAt: paidAt
          ? new Date(paidAt)
          : status === 'COMPLETED' && !payment.paidAt
            ? new Date()
            : status !== 'COMPLETED'
              ? null
              : payment.paidAt,
      },
    });

    return NextResponse.json(updatedPayment);
  } catch (error: any) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update payment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/payments/[id] - מחיקת תשלום
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req)
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
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

