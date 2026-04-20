import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { getServerSupabaseUser } from '@lib/supabase-server';

export async function GET() {
  try {
    const { user, isServiceRole } = await getServerSupabaseUser();
    
    const userId = isServiceRole ? process.env.DEFAULT_USER_ID : user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized or DEFAULT_USER_ID not set' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { user, isServiceRole } = await getServerSupabaseUser();
    
    const userId = isServiceRole ? process.env.DEFAULT_USER_ID : user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized or DEFAULT_USER_ID not set' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}