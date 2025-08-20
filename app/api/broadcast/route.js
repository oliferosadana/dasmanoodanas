import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, id } = body || {};
    if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ message: 'Webhook URL tidak valid' }, { status: 400 });
    }

    let rows;
    if (id) {
      const [data] = await pool.query('SELECT * FROM paket_kuota WHERE id = ?', [id]);
      rows = data;
    } else {
      const [data] = await pool.query('SELECT * FROM paket_kuota ORDER BY provider, nama_paket');
      rows = data;
    }

    const payload = {
      source: 'das-stok-akrab',
      timestamp: new Date().toISOString(),
      count: rows.length,
      data: rows,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const responseText = await response.text().catch(() => '');
    if (!response.ok) {
      return NextResponse.json({ message: 'Webhook gagal merespon', status: response.status, body: responseText }, { status: 502 });
    }
    return NextResponse.json({ message: 'Broadcast berhasil dikirim', status: response.status, body: responseText });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


