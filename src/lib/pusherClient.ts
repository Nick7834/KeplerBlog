import Pusher from 'pusher-js';

export const pusherClient = typeof window !== 'undefined'
  ? new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })
  : null;