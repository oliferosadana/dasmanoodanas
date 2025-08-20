import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/db';

export async function GET(_req, { params }) {
  try {
    const [rows] = await pool.query('SELECT * FROM paket_kuota WHERE id = ?', [params.id]);
    if (!rows.length) return NextResponse.json({ message: 'Paket not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { provider, nama_paket, area, stok, harga } = await request.json();
  if (!provider || !nama_paket || stok === undefined || harga === undefined) {
    return NextResponse.json({ message: 'Provider, nama paket, stok, dan harga wajib diisi' }, { status: 400 });
  }
  const areaValue = (area ?? '').toString().trim().slice(0, 100);
  try {
    const [result] = await pool.query(
      'UPDATE paket_kuota SET provider = ?, nama_paket = ?, area = ?, stok = ?, harga = ? WHERE id = ?',
      [provider, nama_paket, areaValue, stok, harga, params.id]
    );
    if (result.affectedRows === 0) return NextResponse.json({ message: 'Paket not found' }, { status: 404 });
    return NextResponse.json({ message: 'Paket updated successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const [result] = await pool.query('DELETE FROM paket_kuota WHERE id = ?', [params.id]);
    if (result.affectedRows === 0) return NextResponse.json({ message: 'Paket not found' }, { status: 404 });
    return NextResponse.json({ message: 'Paket deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


