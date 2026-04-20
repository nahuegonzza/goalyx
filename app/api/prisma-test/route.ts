import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function GET() {
  try {
    // Test basic connection
    console.log('Testing Prisma connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Raw query test passed:', result);

    // Try to count users
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);

    return NextResponse.json({
      status: 'ok',
      message: 'Prisma connection successful',
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Prisma connection error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      status: 'error',
      message: 'Prisma connection failed',
      error: errorMessage,
      databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
