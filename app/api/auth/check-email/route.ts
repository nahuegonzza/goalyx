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
    // Note: Supabase doesn't have getUserByEmail in admin API
    // Using admin.listUsers as workaround is not ideal, so we'll use a direct DB query approach
    const { data, error } = await supabase.auth.admin.listUsers();
    const user = data?.users?.find(u => u.email === email);

    if (error || !data?.users) {
      return NextResponse.json({ exists: false, emailConfirmed: false, serviceRoleAvailable: true });
    }

    if (!user) {
      return NextResponse.json({ exists: false, emailConfirmed: false, serviceRoleAvailable: true });
    }

    return NextResponse.json({
      exists: true,
      emailConfirmed: Boolean(user.email_confirmed_at),
      serviceRoleAvailable: true,
      user: {
        id: user.id,
        email: user.email,
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
