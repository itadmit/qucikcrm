import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, generateAccessToken, generateRefreshToken } from '@/lib/mobile-auth';

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ error: 'Missing refresh token' }, { status: 400 });
    }

    const payload = verifyToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || (user as any).refreshToken !== refreshToken) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    const newToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return NextResponse.json({
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error('Mobile refresh error:', error);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}
