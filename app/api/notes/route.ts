import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { notes, tags, noteTags, users } from '@/lib/db/schema';
import { eq, desc, and, ilike, or } from 'drizzle-orm';

// Load centralized AI settings
async function loadAISettings() {
  try {
    const fs = require('fs').promises;
    const SETTINGS_FILE = '/tmp/owlai-admin-settings.json';
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Fallback to environment variables
    return {
      webhookUrl: process.env.N8N_WEBHOOK_URL || '',
      enabled: true,
    };
  }
}

// Trigger centralized AI processing
async function triggerAIProcessing(note: any, user: any, type: string, url?: string, content?: string) {
  try {
    const settings = await loadAISettings();
    
    if (!settings.enabled || !settings.webhookUrl) {
      console.log('AI processing disabled or webhook URL not configured');
      return;
    }

    // Get user email for identification
    const userEmail = user.email;

    const payload = {
      noteId: note.id,
      userEmail: userEmail,
      type,
      url: type === 'url' ? url : undefined,
      content: type === 'text' ? content : undefined,
      title: note.title,
      timestamp: new Date().toISOString(),
    };

    await fetch(settings.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`AI processing triggered for user ${userEmail}, note ${note.id}`);
  } catch (webhookError) {
    console.error('Failed to trigger centralized AI processing:', webhookError);
    // Don't fail the request if webhook fails
  }
}

export async function GET(request: NextRequest) {
  try {
    // Skip database operations during build time
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json([]);
    }

    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');

    // Build where conditions
    const whereConditions = [eq(notes.userId, session.user.id)];

    // Add search filter
    if (search) {
      whereConditions.push(
        or(
          ilike(notes.title, `%${search}%`),
          ilike(notes.content, `%${search}%`),
          ilike(notes.summary, `%${search}%`)
        )!
      );
    }

    // Add tag filter
    if (tag) {
      whereConditions.push(eq(tags.name, tag));
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
      .where(and(...whereConditions))
      .orderBy(desc(notes.createdAt));

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
    // Skip database operations during build time
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

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

    // Trigger centralized n8n workflow for AI processing
    await triggerAIProcessing(newNote[0], session.user, type, url, content);

    return NextResponse.json(newNote[0], { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}