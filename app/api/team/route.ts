import { getUser } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Skip database operations during build time
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({
        id: 1,
        name: 'Build User',
        email: 'build@example.com',
        planName: 'Free',
        subscriptionStatus: 'active'
      });
    }

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return basic user info for backward compatibility
    // This endpoint will be replaced when we implement LemonSqueezy
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      planName: 'Free',
      subscriptionStatus: 'active'
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}