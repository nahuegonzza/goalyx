export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { getServerSupabaseUser } from '@lib/supabase-server';
import { prisma } from '@lib/prisma';
import type { Rule } from '@types';

export async function GET() {
  const { user, isServiceRole } = await getServerSupabaseUser();

  const userId = isServiceRole ? process.env.DEFAULT_USER_ID : user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized or DEFAULT_USER_ID not set' }, { status: 401 });
  }

  const rules = await prisma.rule.findMany({
    where: { userId },
    orderBy: { priority: 'desc' }
  });

  const parsedRules = rules.map((rule) => ({
    ...rule,
    config: rule.config ? JSON.parse(rule.config) : {}
  }));

  return NextResponse.json(parsedRules);
}

export async function POST(request: Request) {
  const { user, isServiceRole } = await getServerSupabaseUser();

  const userId = isServiceRole ? process.env.DEFAULT_USER_ID : user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized or DEFAULT_USER_ID not set' }, { status: 401 });
  }

  const payload = (await request.json()) as Rule;
  const rule = await prisma.rule.create({
    data: {
      userId,
      target: payload.target,
      condition: payload.condition,
      action: payload.action,
      priority: payload.priority ?? 0,
      active: payload.active ?? true,
      config: JSON.stringify(payload.config ?? {})
    }
  });
  return NextResponse.json(rule, { status: 201 });
}
