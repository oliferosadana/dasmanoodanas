import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/db';

async function ensureTableAndRow() {
  await pool.query(`CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY,
    webhook_url TEXT,
    webhook_url_stok TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
  const [rows] = await pool.query('SELECT id FROM settings WHERE id = 1');
  if (!rows.length) {
    await pool.query('INSERT INTO settings (id, webhook_url, webhook_url_stok) VALUES (1, \'\', \'\')');
  }
}

export async function GET() {
  try {
    await ensureTableAndRow();
    const [rows] = await pool.query('SELECT webhook_url, webhook_url_stok FROM settings WHERE id = 1');
    return NextResponse.json(rows[0] || { webhook_url: '', webhook_url_stok: '' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureTableAndRow();
    const body = await request.json();
    const webhookUrl = (body?.webhook_url || '').toString().trim();
    const webhookUrlStok = (body?.webhook_url_stok || '').toString().trim();
    await pool.query('UPDATE settings SET webhook_url = ?, webhook_url_stok = ? WHERE id = 1', [webhookUrl, webhookUrlStok]);
    return NextResponse.json({ message: 'Settings updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


