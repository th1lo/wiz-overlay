import PusherClient from 'pusher-js';

if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('Pusher environment variables are not set!');
}

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    enabledTransports: ['ws', 'wss'],
  }
); 