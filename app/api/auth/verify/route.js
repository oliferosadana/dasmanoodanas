import { NextResponse } from 'next/server';
import { getAuthFromHeader, verifyJwt } from '@/src/lib/auth';

export async function GET(request) {
  const token = getAuthFromHeader(request);
  if (!token) return NextResponse.json({ valid: false }, { status: 401 });
  try {
    const decoded = verifyJwt(token);
    return NextResponse.json({ valid: true, user: decoded });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}

export const dynamic = 'force-dynamic';


