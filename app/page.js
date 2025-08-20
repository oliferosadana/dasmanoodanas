"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const resp = await fetch('/api/paket');
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const json = await resp.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-brand">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <Image src="/img/logo.png" alt="Logo" width={36} height={36} style={{ marginRight: 10 }} />
            OODANAA STORE
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item ms-2 d-flex align-items-center">
                <a className="btn btn-outline-brand btn-sm" href="/area">
                  <i className="bi bi-geo-alt me-1"></i> Cek Area
                </a>
              </li>
              <li className="nav-item ms-2 d-flex align-items-center">
                <a className="btn btn-outline-brand btn-sm" href="https://wa.me/6281253439968" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-whatsapp me-1"></i> WhatsApp
                </a>
              </li>
              <li className="nav-item ms-2 d-flex align-items-center">
                <a className="btn btn-outline-brand btn-sm" href="https://t.me/oodanaa" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-telegram me-1"></i> Telegram
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login"><i className="bi bi-lock"></i> Login</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="mb-4">
          <h4 className="dashboard-title">Daftar Paket</h4>
        </div>

        {loading && (
          <div id="loadingIndicator" className="text-center py-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-secondary">Memuat data...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger">Gagal memuat data: {error}</div>
        )}

        {!loading && !error && (
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Paket</th>
                      <th>Area</th>
                      <th className="text-end">Stok</th>
                      <th className="text-end">Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((paket, idx) => (
                      <tr key={idx}>
                        <td>{paket.provider} - {paket.nama_paket}</td>
                        <td className="area-cell" style={{ whiteSpace: 'pre-line' }}>{formatArea(paket.area)}</td>
                        <td className="text-end">{paket.stok}</td>
                        <td className="text-end">{formatRupiah(paket.harga)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

function formatRupiah(angka) {
  if (angka == null) return '-';
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatArea(text) {
  if (!text) return '-';
  const t = String(text).trim();
  // Split by occurrences of "AREA X : ..." capturing until next AREA or end
  const segments = t.match(/AREA\s*\d+\s*:\s*.*?(?=(?:\s+)?AREA\s*\d+\s*:|$)/gi);
  if (!segments) return t;
  return segments.join('\n');
}



