import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@lib/supabase-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const subscription = body?.subscription;

  if (!subscription || typeof subscription !== 'object') {
    return NextResponse.json({ error: 'Suscripción inválida' }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({ data: { pushSubscription: subscription } });

  if (error) {
    return NextResponse.json({ error: error.message || 'No se pudo guardar la suscripción' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
