// app/api/user/me/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = (await cookies()).get('auth_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch('http://127.0.0.1:8000/api/user/isLogin', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();
    const user = await res.json();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}