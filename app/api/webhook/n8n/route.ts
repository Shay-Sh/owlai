import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { notes, tags, noteTags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET;
    
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { noteId, summary, extractedTitle, tagsArray, processingStatus = 'completed' } = body;

    if (!noteId) {
      return NextResponse.json({ error: 'Missing noteId' }, { status: 400 });
    }

    // Update the note with AI processing results
    const updateData: any = {
      processingStatus,
      updatedAt: new Date(),
    };

    if (summary) {
      updateData.summary = summary;
    }

    if (extractedTitle) {
      updateData.title = extractedTitle;
    }

    await db
      .update(notes)
      .set(updateData)
      .where(eq(notes.id, noteId));

    // Handle tags if provided
    if (tagsArray && Array.isArray(tagsArray)) {
      // First, remove existing tags for this note
      await db.delete(noteTags).where(eq(noteTags.noteId, noteId));

      // Then add new tags
      for (const tagName of tagsArray) {
        if (typeof tagName === 'string' && tagName.trim()) {
          // Insert tag if it doesn't exist
          const existingTag = await db
            .select()
            .from(tags)
            .where(eq(tags.name, tagName.trim()))
            .limit(1);

          let tagId;
          if (existingTag.length > 0) {
            tagId = existingTag[0].id;
          } else {
            const newTag = await db
              .insert(tags)
              .values({ name: tagName.trim() })
              .returning();
            tagId = newTag[0].id;
          }

          // Create note-tag relationship
          await db.insert(noteTags).values({
            noteId,
            tagId,
          });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Note updated successfully',
      noteId,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}