import { NextRequest, NextResponse } from 'next/server';
;
;
import { prisma } from '@/lib/prisma';
import { getAuthUser } from "@/lib/mobile-auth"

/**
 * GET - קבלת רשימת כל האינטגרציות
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const integrations = await prisma.integration.findMany({
      where: {
        companyId: user.companyId,
      },
      select: {
        id: true,
        type: true,
        name: true,
        isActive: true,
        lastSyncAt: true,
        createdAt: true,
        updatedAt: true,
        config: true,
        // לא שולחים apiKey ו-apiSecret לצד הלקוח
      },
    });

    return NextResponse.json(integrations);
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

