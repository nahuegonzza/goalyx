import { NextResponse } from 'next/server';
import { createServiceRoleSupabaseClient } from '@lib/supabase-server';
import { sendWebPushNotification } from '@lib/web-push';
import { prisma } from '@lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires';

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getArgentinaDateKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: ARGENTINA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return formatter.format(date);
}

function calculateStreaks(dateKeys: string[], referenceDate: string) {
  const uniqueDates = Array.from(new Set(dateKeys)).sort();
  let longestStreak = 0;
  let currentStreak = 0;
  let consecutive = 0;
  let prevDate: Date | null = null;

  uniqueDates.forEach((dateString) => {
    const currentDate = new Date(`${dateString}T00:00:00Z`);
    if (!prevDate) {
      consecutive = 1;
    } else {
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      consecutive = diffDays === 1 ? consecutive + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, consecutive);
    prevDate = currentDate;
  });

  const dateSet = new Set(uniqueDates);
  let streakDate = new Date(`${referenceDate}T00:00:00Z`);

  if (!dateSet.has(referenceDate)) {
    streakDate.setUTCDate(streakDate.getUTCDate() - 1);
  }

  while (dateSet.has(formatDate(streakDate))) {
    currentStreak += 1;
    streakDate.setUTCDate(streakDate.getUTCDate() - 1);
  }

  return { currentStreak, longestStreak };
}

async function getStreakInfo(userId: string, referenceDate: string) {
  const rows = await prisma.$queryRaw<Array<{ date: Date }>>`
    SELECT date
    FROM "StreakDay"
    WHERE "userId" = ${userId}
    ORDER BY date ASC
  `;

  const dateKeys = rows.map((row) => formatDate(new Date(row.date)));
  const { currentStreak, longestStreak } = calculateStreaks(dateKeys, referenceDate);
  const todayFulfilled = dateKeys.includes(referenceDate);

  return { currentStreak, longestStreak, todayFulfilled };
}

function parseSubscription(subscription: unknown) {
  if (!subscription) return null;
  if (typeof subscription === 'string') {
    try {
      return JSON.parse(subscription);
    } catch {
      return null;
    }
  }
  return subscription;
}

export async function POST(request: Request) {
  const notificationSecret = process.env.NOTIFICATIONS_SECRET;
  const url = new URL(request.url);
  const providedSecret = request.headers.get('x-notifications-secret') ?? url.searchParams.get('secret');

  if (!notificationSecret) {
    return NextResponse.json(
      { error: 'Server misconfiguration: NOTIFICATIONS_SECRET is not configured.' },
      { status: 500 }
    );
  }

  if (!providedSecret || providedSecret !== notificationSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: invalid or missing notifications secret.' },
      { status: 401 }
    );
  }

  const supabaseService = createServiceRoleSupabaseClient();
  const { data, error } = await supabaseService.auth.admin.listUsers({ page: 1, perPage: 500 });

  if (error) {
    return NextResponse.json({ error: error.message || 'Error listando usuarios' }, { status: 500 });
  }

  const users = data && typeof data === 'object' && 'users' in data ? data.users : Array.isArray(data) ? data : [];
  const now = new Date();
  const todayKey = getArgentinaDateKey(now);
  let sent = 0;
  let failed = 0;

  for (const user of users) {
    const rawSubscription = user?.user_metadata?.pushSubscription;
    const subscription = parseSubscription(rawSubscription);

    if (!subscription || typeof subscription.endpoint !== 'string') {
      continue;
    }

    const streakInfo = await getStreakInfo(user.id, todayKey);
    if (streakInfo.todayFulfilled) {
      continue;
    }

    try {
      await sendWebPushNotification(subscription, {
        title: 'Tu racha de hoy está incompleta',
        body: 'Aún no marcaste la racha de hoy. Abre Goalyx y continúa con tu hábito.',
        data: { type: 'daily-streak-reminder' }
      });
      sent += 1;
    } catch (error: any) {
      failed += 1;
      const statusCode = error?.statusCode ?? error?.status;
      if (statusCode === 404 || statusCode === 410) {
        await supabaseService.auth.admin.updateUserById(user.id, {
          user_metadata: { pushSubscription: null }
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ sent, failed });
}
