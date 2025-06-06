import { NextResponse } from 'next/server';

// In-memory storage for stats
let cachedStats = {
  pmcKills: 0,
  totalDeaths: 0,
  raids: 0,
  survived: 0,
  kd: 0,
  winStreak: 0
};

export async function GET() {
  try {
    return NextResponse.json(cachedStats);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const stats = await request.json();
    
    // Validate stats
    const requiredFields = ['pmcKills', 'totalDeaths', 'raids', 'survived', 'kd', 'winStreak'];
    for (const field of requiredFields) {
      if (typeof stats[field] !== 'number') {
        throw new Error(`Invalid stats: ${field} is required and must be a number`);
      }
    }

    // Update cached stats
    cachedStats = stats;
    
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    );
  }
} 