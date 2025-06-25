import { getUser } from '@/lib/db/queries';

export async function GET() {
  // Skip database operations during build time
  if (!process.env.POSTGRES_URL) {
    return Response.json(null);
  }
  
  const user = await getUser();
  return Response.json(user);
}
