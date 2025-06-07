import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  console.error('KV_REST_API_URL:', process.env.KV_REST_API_URL);
  console.error('KV_REST_API_TOKEN:', process.env.KV_REST_API_TOKEN);
  throw new Error('KV_REST_API_URL or KV_REST_API_TOKEN is not set!');
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const defaultStats = {
  ledx: 0,
  gpu: 0,
  bitcoin: 0,
  redKeycard: 0,
  blueKeycard: 0,
  yellowKeycard: 0,
  pmcKills: 0,
  totalDeaths: 0,
  totalRaids: 0,
  survivedRaids: 0,
  kdRatio: 0
};

// New Redis key for player stats
const PLAYER_STATS_KEY = 'player_stats';

async function getStats() {
  const redisStats = await redis.hgetall('overlay-stats') || {};
  const stats = { ...defaultStats, ...redisStats };
  return stats;
}

async function setStat(key: string, value: number) {
  await redis.hset('overlay-stats', { [key]: value });
  return value;
}

// New function to update player stats
async function updatePlayerStats(stats: unknown) {
  await redis.set(PLAYER_STATS_KEY, stats);
  return stats;
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

// New endpoint to update player stats
export async function PUT(request: Request) {
  const body = await request.json();
  const { stats } = body;
  if (stats) {
    const updatedStats = await updatePlayerStats(stats);
    return NextResponse.json({ success: true, stats: updatedStats });
  }
  return NextResponse.json({ success: false, error: 'Invalid stats' }, { status: 400 });
} 