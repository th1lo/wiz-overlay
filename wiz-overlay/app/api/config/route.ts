import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'overlay-config.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(CONFIG_FILE))) {
  fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
}

// Initialize config file if it doesn't exist
if (!fs.existsSync(CONFIG_FILE)) {
  const defaultConfig = {
    stats: {
      pmcKills: true,
      totalDeaths: true,
      totalRaids: true,
      survivedRaids: true,
      kdRatio: true
    },
    items: {
      ledx: true,
      gpu: true,
      bitcoin: true,
      redKeycard: true,
      blueKeycard: true,
      labsKeycard: true
    }
  };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
}

export async function GET() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
} 