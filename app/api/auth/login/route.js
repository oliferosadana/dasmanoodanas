import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { pool } from '@/src/lib/db';
import { signJwt } from '@/src/lib/auth';

export async function POST(request) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
  }
  const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (!users.length) return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
  const user = users[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
  const token = signJwt({ id: user.id, username: user.username, name: user.name });
  return NextResponse.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, name: user.name } });
}

export const dynamic = 'force-dynamic';


