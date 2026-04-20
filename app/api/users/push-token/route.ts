import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token, action } = await req.json();

    if (!token || !action) {
      return NextResponse.json({ error: 'Missing token or action' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentTokens: string[] = (dbUser as any).pushTokens || [];

    if (action === 'register') {
      if (!currentTokens.includes(token)) {
        await prisma.user.update({
          where: { id: user.id },
          data: { pushTokens: [...currentTokens, token] },
        });
      }
    } else if (action === 'unregister') {
      await prisma.user.update({
        where: { id: user.id },
        data: { pushTokens: currentTokens.filter((t: string) => t !== token) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push token error:', error);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}
