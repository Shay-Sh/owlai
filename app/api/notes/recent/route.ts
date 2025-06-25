import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { notes, tags, noteTags } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = await db
      .select({
        id: notes.id,
        title: notes.title,
        url: notes.url,
        content: notes.content,
        summary: notes.summary,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        processingStatus: notes.processingStatus,
        noteTags: noteTags,
        tag: tags,
      })
      .from(notes)
      .leftJoin(noteTags, eq(notes.id, noteTags.noteId))
      .leftJoin(tags, eq(noteTags.tagId, tags.id))
      .where(eq(notes.userId, session.user.id))
      .orderBy(desc(notes.createdAt))
      .limit(10);

    // Group by note id to structure the response properly
    const notesMap = new Map();
    for (const row of results) {
      if (!notesMap.has(row.id)) {
        notesMap.set(row.id, {
          id: row.id,
          title: row.title,
          url: row.url,
          content: row.content,
          summary: row.summary,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          processingStatus: row.processingStatus,
          noteTags: [],
        });
      }
      
      if (row.noteTags && row.tag) {
        notesMap.get(row.id).noteTags.push({
          id: row.noteTags.id,
          noteId: row.noteTags.noteId,
          tagId: row.noteTags.tagId,
          tag: row.tag,
        });
      }
    }

    const notesArray = Array.from(notesMap.values());
    return NextResponse.json(notesArray);
  } catch (error) {
    console.error('Error fetching recent notes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}