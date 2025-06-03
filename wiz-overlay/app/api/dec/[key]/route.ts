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

async function decStat(key: string) {
  const newValue = await redis.decr(key);
  return newValue;
}

export async function POST(request: Request, { params }: { params: { key: string } }) {
  const key = params.key;
  if (key in defaultStats) {
    const value = await decStat(key);
    return NextResponse.json({ success: true, value });
  }
  return NextResponse.json({ success: false, error: 'Invalid key' }, { status: 400 });
} 