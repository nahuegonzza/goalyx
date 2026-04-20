import { NextResponse } from 'next/server';
import { createServiceRoleSupabaseClient } from '@lib/supabase-server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email')?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const { data, error } = await supabase.auth.admin.getUserByEmail(email);

    if (error) {
      if (error.message?.toLowerCase().includes('not found')) {
        return NextResponse.json({ exists: false, emailConfirmed: false, serviceRoleAvailable: true });
      }
      return NextResponse.json({ error: error.message, serviceRoleAvailable: true }, { status: 500 });
    }

    if (!data?.user) {
      return NextResponse.json({ exists: false, emailConfirmed: false, serviceRoleAvailable: true });
    }

    return NextResponse.json({
      exists: true,
      emailConfirmed: Boolean(data.user.email_confirmed_at),
      serviceRoleAvailable: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Error desconocido',
        serviceRoleAvailable: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY),
      },
      { status: 500 }
    );
  }
}
