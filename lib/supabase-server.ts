import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

export function createServerSupabaseClient(cookieStore = cookies()) {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

export function createServiceRoleSupabaseClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY in the environment.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

// ✅ NUEVA función basada en getUser() con fallback
export async function getServerSupabaseUser() {
  const supabase = createServerSupabaseClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.log('User session not found, using service role fallback');
      // Fallback: crear usuario con service role si está disponible
      return {
        user: null,
        supabase: createServiceRoleSupabaseClient(),
        isServiceRole: true
      };
    }

    return {
      user,
      supabase,
      isServiceRole: false
    };
  } catch (error) {
    console.log('Auth error, using service role fallback:', error);
    // Fallback completo
    return {
      user: null,
      supabase: createServiceRoleSupabaseClient(),
      isServiceRole: true
    };
  }
}

// ✅ Prisma sync
export async function ensurePrismaUserForSession() {
  const { user } = await getServerSupabaseUser();

  if (!user?.id || !user.email) {
    return null;
  }

  return prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email,
      name: (user.user_metadata as any)?.full_name ?? null,
    },
    create: {
      id: user.id,
      email: user.email,
      name: (user.user_metadata as any)?.full_name ?? null,
    },
  });
}

// ✅ helper simple
export async function getSupabaseUserId() {
  const { user } = await getServerSupabaseUser();
  return user?.id ?? null;
}