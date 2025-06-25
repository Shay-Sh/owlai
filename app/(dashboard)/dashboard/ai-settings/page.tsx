'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bot, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Save,
  TestTube
} from 'lucide-react';
import { toast } from 'sonner';

export default function AISettingsPage() {
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [anthropicApiKey, setAnthropicApiKey] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [autoTagging, setAutoTagging] = useState(true);
  const [autoSummary, setAutoSummary] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');

  useEffect(() => {
    // Load saved settings
    const savedN8nUrl = localStorage.getItem('owlai_n8n_webhook');
    const savedOpenAI = localStorage.getItem('owlai_openai_key');
    const savedAnthropic = localStorage.getItem('owlai_anthropic_key');
    const savedPrompt = localStorage.getItem('owlai_custom_prompt');
    const savedAutoTag = localStorage.getItem('owlai_auto_tagging');
    const savedAutoSummary = localStorage.getItem('owlai_auto_summary');

    if (savedN8nUrl) setN8nWebhookUrl(savedN8nUrl);
    if (savedOpenAI) setOpenaiApiKey(savedOpenAI);
    if (savedAnthropic) setAnthropicApiKey(savedAnthropic);
    if (savedPrompt) setCustomPrompt(savedPrompt);
    if (savedAutoTag) setAutoTagging(savedAutoTag === 'true');
    if (savedAutoSummary) setAutoSummary(savedAutoSummary === 'true');
  }, []);

  const saveSettings = () => {
    localStorage.setItem('owlai_n8n_webhook', n8nWebhookUrl);
    localStorage.setItem('owlai_openai_key', openaiApiKey);
    localStorage.setItem('owlai_anthropic_key', anthropicApiKey);
    localStorage.setItem('owlai_custom_prompt', customPrompt);
    localStorage.setItem('owlai_auto_tagging', autoTagging.toString());
    localStorage.setItem('owlai_auto_summary', autoSummary.toString());
    
    toast.success('Settings saved successfully!');
  };

  const testConnection = async () => {
    if (!n8nWebhookUrl) {
      toast.error('Please enter a webhook URL first');
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          message: 'OwlAI connection test'
        }),
      });

      if (response.ok) {
        setConnectionStatus('connected');
        toast.success('n8n connection successful!');
      } else {
        setConnectionStatus('disconnected');
        toast.error('Connection failed. Check your webhook URL.');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      toast.error('Connection failed. Check your webhook URL.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">AI & Workflow Settings</h1>
          <p className="text-muted-foreground">
            Configure your AI processing and automation workflows
          </p>
        </div>

        <div className="space-y-6">
          {/* n8n Workflow Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>n8n Workflow Integration</CardTitle>
                {connectionStatus === 'connected' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
                {connectionStatus === 'disconnected' && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Disconnected
                  </Badge>
                )}
              </div>
              <CardDescription>
                Connect your n8n workflow to automatically process and enhance your knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="n8n-webhook">Webhook URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="n8n-webhook"
                    type="url"
                    value={n8nWebhookUrl}
                    onChange={(e) => setN8nWebhookUrl(e.target.value)}
                    placeholder="https://your-n8n-instance.com/webhook/owlai"
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={testConnection}
                    disabled={isTesting || !n8nWebhookUrl}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {isTesting ? 'Testing...' : 'Test'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your n8n webhook endpoint for AI processing
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-tagging">Automatic Tagging</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate relevant tags for new content
                  </p>
                </div>
                <Switch
                  id="auto-tagging"
                  checked={autoTagging}
                  onCheckedChange={setAutoTagging}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-summary">Automatic Summarization</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate AI-powered summaries for new content
                  </p>
                </div>
                <Switch
                  id="auto-summary"
                  checked={autoSummary}
                  onCheckedChange={setAutoSummary}
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  How to set up n8n workflow
                </h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Create a new workflow in your n8n instance</li>
                  <li>Add a Webhook trigger node</li>
                  <li>Add OpenAI/Anthropic nodes for summarization and tagging</li>
                  <li>Add a HTTP request node to update the note via OwlAI API</li>
                  <li>Copy the webhook URL and paste it above</li>
                </ol>
                <a 
                  href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  n8n Webhook Documentation
                </a>
              </div>
            </CardContent>
          </Card>

          {/* AI API Keys */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <CardTitle>AI API Configuration</CardTitle>
              </div>
              <CardDescription>
                Configure your AI provider API keys (stored locally in your browser)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Used for GPT-powered summarization and tagging
                </p>
              </div>

              <div>
                <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                <Input
                  id="anthropic-key"
                  type="password"
                  value={anthropicApiKey}
                  onChange={(e) => setAnthropicApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Used for Claude-powered analysis and insights
                </p>
              </div>

              <div>
                <Label htmlFor="custom-prompt">Custom Processing Prompt</Label>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter a custom prompt for AI processing (optional)"
                  className="mt-1 min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Custom instructions for how AI should process your content
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Security Note</p>
                    <p className="text-amber-700 mt-1">
                      API keys are stored locally in your browser and never sent to OwlAI servers. 
                      They are only used by your n8n workflows.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveSettings} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}