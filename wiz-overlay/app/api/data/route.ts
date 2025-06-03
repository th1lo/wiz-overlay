import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

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

async function getStats() {
  const keys = Object.keys(defaultStats);
  const values = await redis.mget<number[]>(...keys);
  const stats: Record<string, number> = {};
  keys.forEach((key, i) => {
    stats[key] = values[i] ?? 0;
  });
  return stats;
}

async function setStat(key: string, value: number) {
  await redis.set(key, value);
  return value;
}

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { key, value } = body;
  if (typeof key === 'string' && typeof value === 'number' && key in defaultStats) {
    const newValue = await setStat(key, value);
    return NextResponse.json({ success: true, value: newValue });
  }
  return NextResponse.json({ success: false, error: 'Invalid key or value' }, { status: 400 });
} 