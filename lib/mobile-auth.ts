import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '30d';

interface MobileTokenPayload {
  userId: string;
  email: string;
  role: string;
  companyId: string;
}

export function generateAccessToken(payload: MobileTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload: MobileTokenPayload): string {
  return jwt.sign({ ...payload, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyToken(token: string): MobileTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MobileTokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function getAuthUser(req?: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      companyId: session.user.companyId,
      companyName: session.user.companyName,
    };
  }

  const authHeader = req?.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (payload) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: { company: true },
      });
      if (user) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          companyName: user.company.name,
        };
      }
    }
  }

  return null;
}
