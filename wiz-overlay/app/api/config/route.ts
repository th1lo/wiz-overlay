import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

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
    yellowKeycard: true
  }
};

export async function GET() {
  try {
    const config = await redis.get('overlay-config') || defaultConfig;
    if (config.showCards === undefined) config.showCards = true;
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json();
    await redis.set('overlay-config', config);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
} 