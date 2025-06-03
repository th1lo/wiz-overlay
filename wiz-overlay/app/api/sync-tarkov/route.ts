import { NextResponse } from 'next/server';

const TARKOV_URL = 'https://tarkov.dev/players/regular/7978003';

async function fetchTarkovStats() {
  const res = await fetch(TARKOV_URL);
  const html = await res.text();
  // Simple regex extraction for kills and deaths (adjust as needed)
  const pmcKillsMatch = html.match(/PMC Kills<[^>]*>[^\d]*(\d+)/i);
  const totalDeathsMatch = html.match(/Total Deaths<[^>]*>[^\d]*(\d+)/i);
  const pmcKills = pmcKillsMatch ? parseInt(pmcKillsMatch[1], 10) : null;
  const totalDeaths = totalDeathsMatch ? parseInt(totalDeathsMatch[1], 10) : null;
  return { pmcKills, totalDeaths };
}

async function setStat(key: string, value: number) {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(key, value);
    return value;
  } catch (e) {
    return value;
  }
}

export async function POST() {
  const { pmcKills, totalDeaths } = await fetchTarkovStats();
  if (typeof pmcKills === 'number') await setStat('pmcKills', pmcKills);
  if (typeof totalDeaths === 'number') await setStat('totalDeaths', totalDeaths);
  return NextResponse.json({ pmcKills, totalDeaths });
} 