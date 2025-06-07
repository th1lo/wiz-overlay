import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching tarkov.dev profile...');
    const res = await fetch('https://players.tarkov.dev/profile/7978003.json');
    if (!res.ok) {
      console.error('Failed to fetch profile:', res.status, res.statusText);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
    const data = await res.json();
    console.log('Successfully fetched profile data:', {
      hasPmcStats: !!data.pmcStats,
      hasEft: !!data.pmcStats?.eft,
      hasOverAllCounters: !!data.pmcStats?.eft?.overAllCounters,
      hasItems: !!data.pmcStats?.eft?.overAllCounters?.Items,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
} 