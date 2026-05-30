import { NextResponse } from 'next/server';
import { getVapidPublicKey } from '@lib/web-push';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    return NextResponse.json({ publicKey: getVapidPublicKey() });
  } catch (error) {
    return NextResponse.json(
      { error: 'No se encontró la clave pública de VAPID. Configura NEXT_PUBLIC_VAPID_PUBLIC_KEY.' },
      { status: 500 }
    );
  }
}
