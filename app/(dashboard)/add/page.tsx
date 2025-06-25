'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Link as LinkIcon, FileText, Sparkles } from 'lucide-react';

export default function AddPage() {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: activeTab,
          url: activeTab === 'url' ? url : undefined,
          content: activeTab === 'text' ? content : undefined,
          title: title || undefined,
        }),
      });

      if (response.ok) {
        // Reset form
        setUrl('');
        setContent('');
        setTitle('');
        // Show success message or redirect
        alert('Content added successfully! AI processing will begin shortly.');
      } else {
        alert('Failed to add content. Please try again.');
      }
    } catch (error) {
      console.error('Error adding content:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Add Knowledge</h1>
          <p className="text-muted-foreground">
            Save a URL or paste content to add to your knowledge base
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex space-x-1 rounded-lg bg-muted p-1">
              <Button
                variant={activeTab === 'url' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('url')}
                className="flex-1"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Add URL
              </Button>
              <Button
                variant={activeTab === 'text' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('text')}
                className="flex-1"
              >
                <FileText className="mr-2 h-4 w-4" />
                Add Text
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'url' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/article"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter any webpage URL to extract and summarize its content
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="title-url">Title (Optional)</Label>
                    <Input
                      id="title-url"
                      placeholder="Custom title for this content"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title-text">Title (Optional)</Label>
                    <Input
                      id="title-text"
                      placeholder="Give your content a title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Paste your text content here..."
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Paste any text content for AI summarization and tagging
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">AI Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Once submitted, our AI will automatically:
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Extract and summarize the key content</li>
                      <li>• Generate relevant tags and categories</li>
                      <li>• Make it searchable in your knowledge vault</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || (activeTab === 'url' && !url) || (activeTab === 'text' && !content)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Add to Knowledge Base
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Tip: Install our{' '}
            <Button variant="link" className="p-0 h-auto text-primary">
              Chrome extension
            </Button>{' '}
            to save content with one click while browsing
          </p>
        </div>
      </div>
    </section>
  );
}