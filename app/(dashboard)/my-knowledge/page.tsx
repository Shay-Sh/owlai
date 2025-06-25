'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NoteWithTags } from '@/lib/db/schema';
import useSWR from 'swr';
import { Suspense, useState } from 'react';
import { Search, FileText, Clock, Tag, ExternalLink, Filter, Plus } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function NotesListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded-full w-16"></div>
                <div className="h-6 bg-muted rounded-full w-20"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NotesList({ searchQuery, selectedTag }: { searchQuery: string; selectedTag: string }) {
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.set('search', searchQuery);
  if (selectedTag) queryParams.set('tag', selectedTag);
  
  const { data: notes } = useSWR<NoteWithTags[]>(
    `/api/notes${queryParams.toString() ? '?' + queryParams.toString() : ''}`, 
    fetcher
  );

  if (!notes?.length) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {searchQuery || selectedTag ? 'No matching notes found' : 'No notes yet'}
        </h3>
        <p className="text-muted-foreground mb-6">
          {searchQuery || selectedTag 
            ? 'Try adjusting your search or filter criteria'
            : 'Start building your knowledge base by adding your first note'
          }
        </p>
        <Link href="/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Knowledge
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold line-clamp-1">
                  {note.title || 'Untitled'}
                </h3>
                <p className="text-muted-foreground mt-2 line-clamp-3">
                  {note.summary || note.content?.substring(0, 300) + '...'}
                </p>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
                {note.url && (
                  <a
                    href={note.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Source
                  </a>
                )}
                <span className="text-xs px-2 py-1 rounded-full bg-muted">
                  {note.processingStatus}
                </span>
              </div>

              {note.noteTags && note.noteTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.noteTags.map((noteTag) => (
                    <span
                      key={noteTag.id}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-accent/20 text-accent-foreground cursor-pointer hover:bg-accent/30"
                      onClick={() => {
                        // This would trigger the tag filter
                      }}
                    >
                      <Tag className="h-3 w-3" />
                      {noteTag.tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TagFilter({ selectedTag, onTagChange }: { selectedTag: string; onTagChange: (tag: string) => void }) {
  const { data: tags } = useSWR<{ name: string }[]>('/api/tags', fetcher);

  if (!tags?.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm">Filter by Tag</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedTag === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTagChange('')}
        >
          All
        </Button>
        {tags.map((tag) => (
          <Button
            key={tag.name}
            variant={selectedTag === tag.name ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTagChange(tag.name)}
          >
            {tag.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function MyKnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Knowledge</h1>
            <p className="text-muted-foreground">
              All your saved knowledge in one place
            </p>
          </div>
          <Link href="/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Knowledge
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your knowledge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Suspense fallback={<div>Loading filters...</div>}>
            <TagFilter selectedTag={selectedTag} onTagChange={setSelectedTag} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<NotesListSkeleton />}>
        <NotesList searchQuery={searchQuery} selectedTag={selectedTag} />
      </Suspense>
    </section>
  );
}