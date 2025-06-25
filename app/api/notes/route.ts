import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { notes, tags, noteTags } from '@/lib/db/schema';
import { eq, desc, and, ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');

    let query = db
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
      .orderBy(desc(notes.createdAt));

    // Add search filter
    if (search) {
      query = query.where(
        and(
          eq(notes.userId, session.user.id),
          or(
            ilike(notes.title, `%${search}%`),
            ilike(notes.content, `%${search}%`),
            ilike(notes.summary, `%${search}%`)
          )
        )
      );
    }

    // Add tag filter
    if (tag) {
      query = query.where(
        and(
          eq(notes.userId, session.user.id),
          eq(tags.name, tag)
        )
      );
    }

    const results = await query;

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
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, url, content, title } = body;

    if (!type || (type === 'url' && !url) || (type === 'text' && !content)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the note
    const newNote = await db.insert(notes).values({
      userId: session.user.id,
      title: title || null,
      url: type === 'url' ? url : null,
      content: type === 'text' ? content : null,
      processingStatus: 'pending',
    }).returning();

    // Trigger n8n workflow for AI processing
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            noteId: newNote[0].id,
            type,
            url: type === 'url' ? url : undefined,
            content: type === 'text' ? content : undefined,
            userId: session.user.id,
          }),
        });
      } catch (webhookError) {
        console.error('Failed to trigger n8n webhook:', webhookError);
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json(newNote[0], { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}