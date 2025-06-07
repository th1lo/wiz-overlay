import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

const CHANNEL_NAME = 'wiz-overlay';
const EVENT_NAME = 'overlay-update';

const ioHandler = async (req: NextRequest) => {
  if (req.method === 'POST') {
    try {
      const data = await req.json();
      
      // Broadcast to all connected clients via Pusher
      await pusherServer.trigger(CHANNEL_NAME, EVENT_NAME, data);
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error broadcasting update:', error);
      return NextResponse.json({ error: 'Failed to broadcast update' }, { status: 500 });
    }
  }

  // For GET requests, just return success
  return NextResponse.json({ success: true });
};

export { ioHandler as GET, ioHandler as POST }; 