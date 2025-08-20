import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM paket_kuota ORDER BY provider, nama_paket');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { provider, nama_paket, area, stok, harga } = await request.json();
  if (!provider || !nama_paket || stok === undefined || harga === undefined) {
    return NextResponse.json({ message: 'Provider, nama paket, stok, dan harga wajib diisi' }, { status: 400 });
  }
  const areaValue = (area ?? '').toString().trim().slice(0, 100);
  try {
    const [result] = await pool.query(
      'INSERT INTO paket_kuota (provider, nama_paket, area, stok, harga) VALUES (?, ?, ?, ?, ?)',
      [provider, nama_paket, areaValue, stok, harga]
    );
    return NextResponse.json({ message: 'Paket created successfully', id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


