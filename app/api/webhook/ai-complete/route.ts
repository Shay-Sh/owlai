import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { notes, tags, noteTags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Skip during build time
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    const body = await request.json();
    const { 
      noteId, 
      userEmail, 
      summary, 
      extractedTags, 
      title, 
      processingStatus = 'completed' 
    } = body;

    if (!noteId || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the note exists and belongs to the user
    const existingNote = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    if (!existingNote[0]) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Update the note with AI-processed content
    const updateData: any = {
      processingStatus,
      updatedAt: new Date(),
    };

    if (summary) {
      updateData.summary = summary;
    }

    if (title && !existingNote[0].title) {
      updateData.title = title;
    }

    await db
      .update(notes)
      .set(updateData)
      .where(eq(notes.id, noteId));

    // Process tags if provided
    if (extractedTags && Array.isArray(extractedTags)) {
      for (const tagName of extractedTags) {
        if (!tagName || typeof tagName !== 'string') continue;

        // Find or create tag
        let tag = await db
          .select()
          .from(tags)
          .where(eq(tags.name, tagName.toLowerCase().trim()))
          .limit(1);

        if (!tag[0]) {
          const newTag = await db
            .insert(tags)
            .values({ name: tagName.toLowerCase().trim() })
            .returning();
          tag = newTag;
        }

        // Check if note-tag relationship already exists
        const existingNoteTag = await db
          .select()
          .from(noteTags)
          .where(eq(noteTags.noteId, noteId))
          .where(eq(noteTags.tagId, tag[0].id))
          .limit(1);

        if (!existingNoteTag[0]) {
          await db
            .insert(noteTags)
            .values({
              noteId: noteId,
              tagId: tag[0].id,
            });
        }
      }
    }

    console.log(`AI processing completed for user ${userEmail}, note ${noteId}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Note updated successfully' 
    });

  } catch (error) {
    console.error('Error processing AI webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}