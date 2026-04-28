export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { getServerSupabaseUser } from '@lib/supabase-server';

export async function GET() {
  try {
    const user = await getServerSupabaseUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Count completed goals (GoalEntries with valueBoolean = true)
    const goalsCompleted = await prisma.goalEntry.count({
      where: {
        userId: dbUser.id,
        valueBoolean: true
      }
    });

    // Get total score from Score table
    const scoreResult = await prisma.score.aggregate({
      where: { userId: dbUser.id },
      _sum: { points: true }
    });

    const totalScore = Math.round(scoreResult._sum.points || 0);

    return NextResponse.json({
      goalsCompleted,
      totalScore
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}