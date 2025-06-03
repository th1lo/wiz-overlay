import { NextResponse } from 'next/server';

// In-memory store for stats
let store: Record<string, number> = {
  gpu: 0,
  tetriz: 0,
  bitcoin: 0,
  ledx: 0,
  redKeycard: 0,
  blueKeycard: 0,
  labsKeycard: 0,
  pmcKills: 0,
  totalDeaths: 0,
};

async function incStat(key: string) {
  try {
    const { kv } = await import('@vercel/kv');
    const newValue = await kv.incr(key);
    return newValue;
  } catch (e) {
    store[key] = (store[key] ?? 0) + 1;
    return store[key];
  }
}

export async function POST(request: Request, { params }: { params: { key: string } }) {
  const key = params.key;
  if (key in store) {
    const value = await incStat(key);
    return NextResponse.json({ success: true, value });
  }
  return NextResponse.json({ success: false, error: 'Invalid key' }, { status: 400 });
} 