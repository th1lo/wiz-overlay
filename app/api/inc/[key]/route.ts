import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const defaultStats: Record<string, number> = {
  ledx: 0,
  gpu: 0,
  bitcoin: 0,
  redKeycard: 0,
  blueKeycard: 0,
  labsKeycard: 0,
  pmcKills: 0,
  totalDeaths: 0,
};

async function incStat(key: string) {
  const newValue = await redis.incr(key);
  return newValue;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await context.params;
    if (key in defaultStats) {
      const value = await incStat(key);
      return NextResponse.json({ success: true, value });
    }
    return NextResponse.json({ success: false, error: 'Invalid key' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/inc/[key]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 