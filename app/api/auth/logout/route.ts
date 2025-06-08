import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the auth cookie
  cookies().delete('overlay-auth');

  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL));
} 