import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@lib/supabase-server';
import { sendWebPushNotification } from '@lib/web-push';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

export async function POST() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pushSubscription = parseSubscription(user.user_metadata?.pushSubscription);

  if (!pushSubscription || typeof pushSubscription.endpoint !== 'string') {
    return NextResponse.json({ error: 'No hay suscripción de notificaciones guardada' }, { status: 400 });
  }

  try {
    await sendWebPushNotification(pushSubscription, {
      title: 'Goalyx — Prueba de notificación',
      body: '¡Listo! Esta notificación confirma que tu dispositivo recibe notificaciones.',
      data: { type: 'test-notification' }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo enviar la notificación de prueba' }, { status: 500 });
  }
}
