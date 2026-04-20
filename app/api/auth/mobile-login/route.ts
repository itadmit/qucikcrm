import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateAccessToken, generateRefreshToken } from '@/lib/mobile-auth';

export async function POST(req: Request) {
  try {
    const { email, password, pushToken } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'נא למלא אימייל וסיסמה' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    const token = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    if (pushToken) {
      const currentTokens = (user as any).pushTokens || [];
      if (!currentTokens.includes(pushToken)) {
        await prisma.user.update({
          where: { id: user.id },
          data: { pushTokens: [...currentTokens, pushToken] },
        });
      }
    }

    return NextResponse.json({
      token,
      refreshToken,
      expiresIn: 3600,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.company.name,
        avatar: (user as any).avatar || null,
      },
    });
  } catch (error) {
    console.error('Mobile login error:', error);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}
