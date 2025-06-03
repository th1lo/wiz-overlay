import { NextResponse } from 'next/server';

// In-memory store for stats
let store: Record<string, number> = {
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
  try {
    // Try to use Vercel KV if available
    const { kv } = await import('@vercel/kv');
    const keys = Object.keys(store);
    const values = await kv.mget<number[]>(...keys);
    const stats: Record<string, number> = {};
    keys.forEach((key, i) => {
      stats[key] = values[i] ?? 0;
    });
    return stats;
  } catch (e) {
    // Fallback to in-memory store
    return store;
  }
}

async function setStat(key: string, value: number) {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(key, value);
    return value;
  } catch (e) {
    store[key] = value;
    return value;
  }
}

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { key, value } = body;
  if (typeof key === 'string' && typeof value === 'number' && key in store) {
    const newValue = await setStat(key, value);
    return NextResponse.json({ success: true, value: newValue });
  }
  return NextResponse.json({ success: false, error: 'Invalid key or value' }, { status: 400 });
} 