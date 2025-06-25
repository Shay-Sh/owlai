import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { notes, tags, noteTags } from '@/lib/db/schema';
import { eq, count, gte, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get total notes count
    const totalNotesResult = await db
      .select({ count: count() })
      .from(notes)
      .where(eq(notes.userId, session.user.id));

    // Get this month's notes count
    const thisMonthResult = await db
      .select({ count: count() })
      .from(notes)
      .where(
        and(
          eq(notes.userId, session.user.id),
          gte(notes.createdAt, startOfMonth)
        )
      );

    // Get unique tags count for user's notes
    const tagsResult = await db
      .selectDistinct({ tagId: noteTags.tagId })
      .from(noteTags)
      .innerJoin(notes, eq(noteTags.noteId, notes.id))
      .where(eq(notes.userId, session.user.id));

    return NextResponse.json({
      totalNotes: totalNotesResult[0]?.count || 0,
      thisMonth: thisMonthResult[0]?.count || 0,
      totalTags: tagsResult.length || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}