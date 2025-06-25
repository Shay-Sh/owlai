'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Note, NoteWithTags, User } from '@/lib/db/schema';
import useSWR from 'swr';
import { Suspense } from 'react';
import { PlusCircle, FileText, Clock, Tag, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function StatsCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function RecentNotesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Knowledge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded-full w-16"></div>
                <div className="h-6 bg-muted rounded-full w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentNotes() {
  const { data: notes } = useSWR<NoteWithTags[]>('/api/notes/recent', fetcher);

  if (!notes?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Knowledge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No knowledge saved yet</p>
            <Link href="/add">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add your first note
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Knowledge</CardTitle>
        <Link href="/my-knowledge">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.slice(0, 5).map((note) => (
            <div key={note.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-1">
                    {note.title || 'Untitled'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {note.summary || note.content?.substring(0, 150) + '...'}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                    {note.url && (
                      <a
                        href={note.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Source
                      </a>
                    )}
                  </div>
                  {note.noteTags && note.noteTags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {note.noteTags.slice(0, 3).map((noteTag) => (
                        <span
                          key={noteTag.id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-accent/20 text-accent-foreground"
                        >
                          <Tag className="h-2 w-2" />
                          {noteTag.tag.name}
                        </span>
                      ))}
                      {note.noteTags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{note.noteTags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DashboardStats() {
  const { data: stats } = useSWR('/api/notes/stats', fetcher);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatsCard
        title="Total Notes"
        value={stats?.totalNotes || 0}
        icon={FileText}
      />
      <StatsCard
        title="This Month"
        value={stats?.thisMonth || 0}
        icon={Clock}
      />
      <StatsCard
        title="Tags"
        value={stats?.totalTags || 0}
        icon={Tag}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your knowledge overview.
            </p>
          </div>
          <Link href="/add" className="mt-4 sm:mt-0">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Knowledge
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<RecentNotesSkeleton />}>
        <RecentNotes />
      </Suspense>
    </section>
  );
}
