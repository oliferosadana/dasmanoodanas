import { NextResponse } from 'next/server';
import { parse } from 'node-html-parser';

let cache = { data: null, at: 0 };
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const SOURCE_URL = 'https://arifr.id/akrab/';

async function fetchArea() {
  const resp = await fetch(SOURCE_URL, { headers: { 'User-Agent': 'das-stok-akrab/1.0' } });
  if (!resp.ok) throw new Error('Failed to fetch source: ' + resp.status);
  const html = await resp.text();
  const root = parse(html);
  const table = root.querySelector('table');
  if (!table) throw new Error('Table not found in source');
  const rows = [];
  table.querySelectorAll('tbody tr').forEach(tr => {
    const tds = tr.querySelectorAll('td');
    if (tds.length >= 3) {
      const prov = tds[0].text.trim();
      const kota = tds[1].text.trim();
      const area = tds[2].text.trim();
      rows.push({ provinsi: prov, kota, area });
    }
  });
  return rows;
}

export async function GET() {
  try {
    const now = Date.now();
    if (cache.data && now - cache.at < CACHE_TTL_MS) {
      return NextResponse.json({ source: SOURCE_URL, count: cache.data.length, data: cache.data });
    }
    const data = await fetchArea();
    cache = { data, at: now };
    return NextResponse.json({ source: SOURCE_URL, count: data.length, data });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to load area data', error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


