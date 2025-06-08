import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// You should store this in an environment variable
const OVERLAY_PASSWORD = process.env.OVERLAY_PASSWORD || 'your-secure-password';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password !== OVERLAY_PASSWORD) {
      return new NextResponse('Invalid password', { status: 401 });
    }

    // Set a cookie that expires in 7 days
    cookies().set('overlay-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return new NextResponse('Authenticated', { status: 200 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 