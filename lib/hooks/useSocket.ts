import { useEffect, useRef } from 'react';
import { pusherClient } from '@/lib/pusherClient';

interface OverlayUpdateData {
  type: 'fir-items' | 'player-stats';
  data: Record<string, number>;
}

const CHANNEL_NAME = 'wiz-overlay';
const EVENT_NAME = 'overlay-update';

export const useSocket = () => {
  const channelRef = useRef<ReturnType<typeof pusherClient.subscribe> | null>(null);

  useEffect(() => {
    // Subscribe to the channel
    channelRef.current = pusherClient.subscribe(CHANNEL_NAME);

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        pusherClient.unsubscribe(CHANNEL_NAME);
      }
    };
  }, []);

  const emitUpdate = async (type: 'fir-items' | 'player-stats', data: Record<string, number>) => {
    try {
      await fetch('/api/socket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data }),
      });
    } catch (error) {
      console.error('Error emitting update:', error);
    }
  };

  const onUpdate = (callback: (data: OverlayUpdateData) => void) => {
    if (channelRef.current) {
      channelRef.current.bind(EVENT_NAME, callback);
    }
  };

  return {
    emitUpdate,
    onUpdate,
  };
}; 