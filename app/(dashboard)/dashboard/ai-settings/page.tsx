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
  TestTube,
  Shield,
  Users,
  Server
} from 'lucide-react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AISettingsPage() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [anthropicApiKey, setAnthropicApiKey] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [serviceEnabled, setServiceEnabled] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');

  // Check if user is admin
  const isAdmin = user?.role === 'owner';

  useEffect(() => {
    if (isAdmin) {
      loadAdminSettings();
    }
  }, [isAdmin]);

  const loadAdminSettings = async () => {
    try {
      const response = await fetch('/api/admin/ai-settings');
      if (response.ok) {
        const settings = await response.json();
        setN8nWebhookUrl(settings.webhookUrl || '');
        setOpenaiApiKey(settings.openaiKey || '');
        setAnthropicApiKey(settings.anthropicKey || '');
        setCustomPrompt(settings.customPrompt || '');
        setServiceEnabled(settings.enabled !== false);
      }
    } catch (error) {
      console.error('Failed to load admin settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!isAdmin) {
      toast.error('Only administrators can modify AI settings');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/ai-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl: n8nWebhookUrl,
          openaiKey: openaiApiKey,
          anthropicKey: anthropicApiKey,
          customPrompt: customPrompt,
          enabled: serviceEnabled,
        }),
      });

      if (response.ok) {
        toast.success('AI service configuration saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
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
          message: 'OwlAI admin connection test',
          userEmail: 'admin@owlai.com'
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

  if (!user) {
    return (
      <section className="flex-1 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="flex-1 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
              <p className="text-muted-foreground">
                Only administrators can access AI service configuration.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">AI Service Administration</h1>
          <p className="text-muted-foreground">
            Configure centralized AI processing for all OwlAI users
          </p>
        </div>

        <div className="space-y-6">
          {/* Service Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <CardTitle>Service Status</CardTitle>
                {serviceEnabled ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Disabled
                  </Badge>
                )}
              </div>
              <CardDescription>
                Control the AI processing service for all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="service-enabled">AI Processing Service</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable AI processing for all users
                  </p>
                </div>
                <Switch
                  id="service-enabled"
                  checked={serviceEnabled}
                  onCheckedChange={setServiceEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* n8n Workflow Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Centralized n8n Workflow</CardTitle>
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
                Your centralized n8n workflow that processes content for all users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="n8n-webhook">Master Webhook URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="n8n-webhook"
                    type="url"
                    value={n8nWebhookUrl}
                    onChange={(e) => setN8nWebhookUrl(e.target.value)}
                    placeholder="https://your-n8n-instance.com/webhook/owlai-master"
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
                  All user content will be sent to this endpoint with their email identifier
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  How the centralized workflow works
                </h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>User adds content through OwlAI interface</li>
                  <li>Content is sent to your webhook with user email identifier</li>
                  <li>Your n8n workflow processes it using your AI API keys</li>
                  <li>Processed content (summary, tags) is sent back to update the note</li>
                  <li>User sees enhanced content with AI insights</li>
                </ol>
                <div className="mt-3 p-2 bg-blue-100 rounded text-xs font-mono">
                  Webhook payload: {`{ "noteId": 123, "userEmail": "user@example.com", "content": "...", "type": "url" }`}
                </div>
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
                Your AI provider API keys (securely stored on your server)
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
                  Your master OpenAI key for processing all user content
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
                  Your master Anthropic key for Claude-powered analysis
                </p>
              </div>

              <div>
                <Label htmlFor="custom-prompt">Master Processing Prompt</Label>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter the system prompt for processing all user content..."
                  className="mt-1 min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This prompt will be used to process content for all users
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800">Business Model</p>
                    <p className="text-green-700 mt-1">
                      You control all AI processing and provide it as a service to your users. 
                      Users pay monthly subscriptions and you handle the AI costs centrally.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={saveSettings} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}