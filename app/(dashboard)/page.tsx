import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Tag, Search, Chrome, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="mb-4">
                <span className="text-6xl">🦉</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Your Second Brain,
                <span className="block text-primary">Powered by AI</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl lg:text-lg xl:text-xl">
                Save what matters. Let OwlAI summarize and organize it for you.
                From articles to ideas, OwlAI turns your digital mess into organized intelligence.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Start Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3"
                >
                  <Chrome className="mr-2 h-5 w-5" />
                  Add Chrome Extension
                </Button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-6 bg-primary/20 rounded w-full flex items-center px-3">
                      <span className="text-primary text-sm">AI Summary Generated</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">AI</span>
                      <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">Tech</span>
                      <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">Future</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three simple steps to turn your digital chaos into organized knowledge
            </p>
          </div>
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Capture Content</h3>
              <p className="text-muted-foreground">
                Save links or paste content using the OwlAI extension or web app.
              </p>
            </div>

            <div className="mt-10 lg:mt-0 text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Let AI Work for You</h3>
              <p className="text-muted-foreground">
                Our agents summarize and tag everything automatically.
              </p>
            </div>

            <div className="mt-10 lg:mt-0 text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Find Anything Fast</h3>
              <p className="text-muted-foreground">
                A minimalist, searchable knowledge vault that grows with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">🧠 Smart Summarization</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered summaries that capture the essence of your content
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                <Tag className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">🏷️ Auto-Tagging</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent categorization with relevant topics and keywords
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">🔎 Full-Text Search</h3>
              <p className="text-sm text-muted-foreground">
                Find any piece of information instantly with powerful search
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                <Chrome className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">🔗 Chrome Extension</h3>
              <p className="text-sm text-muted-foreground">
                One-click saving from any webpage in your browser
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">🔐 Secure Cloud Sync</h3>
              <p className="text-sm text-muted-foreground">
                Your knowledge is safely stored and synced across all devices
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">💡 Simple, Clean Interface</h3>
              <p className="text-sm text-muted-foreground">
                Distraction-free design that focuses on your content
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to remember everything?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start building your AI-enhanced knowledge base today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="text-lg px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3"
            >
              <Chrome className="mr-2 h-5 w-5" />
              Add to Chrome
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
