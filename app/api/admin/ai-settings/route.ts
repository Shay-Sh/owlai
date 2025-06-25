import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/db/schema';

// In a production app, you'd store these in a dedicated admin_settings table
// For now, we'll use environment variables and a simple file-based storage
const SETTINGS_FILE = '/tmp/owlai-admin-settings.json';
const fs = require('fs').promises;

interface AISettings {
  webhookUrl?: string;
  openaiKey?: string;
  anthropicKey?: string;
  customPrompt?: string;
  enabled?: boolean;
}

async function loadSettings(): Promise<AISettings> {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return defaults if file doesn't exist
    return {
      webhookUrl: process.env.N8N_WEBHOOK_URL || '',
      openaiKey: '',
      anthropicKey: '',
      customPrompt: '',
      enabled: true,
    };
  }
}

async function saveSettings(settings: AISettings): Promise<void> {
  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw new Error('Failed to save settings');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Skip during build time
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({
        webhookUrl: '',
        openaiKey: '',
        anthropicKey: '',
        customPrompt: '',
        enabled: false,
      });
    }

    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (owner role)
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user[0] || user[0].role !== 'owner') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const settings = await loadSettings();
    
    // Return settings without exposing full API keys (show only first/last chars)
    const safeSetting = {
      ...settings,
      openaiKey: settings.openaiKey ? 
        `${settings.openaiKey.substring(0, 8)}...${settings.openaiKey.slice(-4)}` : '',
      anthropicKey: settings.anthropicKey ? 
        `${settings.anthropicKey.substring(0, 8)}...${settings.anthropicKey.slice(-4)}` : '',
    };

    return NextResponse.json(safeSetting);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Skip during build time
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (owner role)
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user[0] || user[0].role !== 'owner') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { webhookUrl, openaiKey, anthropicKey, customPrompt, enabled } = body;

    const currentSettings = await loadSettings();
    
    const newSettings: AISettings = {
      webhookUrl: webhookUrl || currentSettings.webhookUrl,
      // Only update keys if they're provided and not masked
      openaiKey: (openaiKey && !openaiKey.includes('...')) ? openaiKey : currentSettings.openaiKey,
      anthropicKey: (anthropicKey && !anthropicKey.includes('...')) ? anthropicKey : currentSettings.anthropicKey,
      customPrompt: customPrompt !== undefined ? customPrompt : currentSettings.customPrompt,
      enabled: enabled !== undefined ? enabled : currentSettings.enabled,
    };

    await saveSettings(newSettings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving admin settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}