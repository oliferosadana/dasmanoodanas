"use client";
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

export default function AreaPage() {
  const [data, setData] = useState([]);
  const [prov, setProv] = useState('');
  const [kota, setKota] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async function load() {
      try {
        const resp = await fetch('/api/area');
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const json = await resp.json();
        setData(json.data || []);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const p = prov.toLowerCase();
    const k = kota.toLowerCase();
    return data.filter(r => r.provinsi.toLowerCase().includes(p) && r.kota.toLowerCase().includes(k));
  }, [data, prov, kota]);

  return (
    <div>
      <nav className="navbar navbar-dark bg-brand">
        <div className="container d-flex align-items-center justify-content-between">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <Image src="/img/logo.png" alt="Logo" width={32} height={32} style={{ marginRight: 10 }} /> OODANAA STORE
          </a>
          <div className="d-flex gap-2">
            <a href="/management" className="btn btn-outline-brand btn-sm"><i className="bi bi-gear"></i> Management</a>
          </div>
        </div>
      </nav>
      <div className="container container-narrow mt-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <h1 className="h4 m-0">CEK AREA PAKET XL AKRAB</h1>
        </div>

        <div className="card p-3 mb-3">
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <input value={prov} onChange={e => setProv(e.target.value)} type="text" className="form-control" placeholder="Cari Provinsi..." />
            </div>
            <div className="col-12 col-md-6">
              <input value={kota} onChange={e => setKota(e.target.value)} type="text" className="form-control" placeholder="Cari Kota/Kabupaten..." />
            </div>
          </div>
        </div>

        <div className="card p-3">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>Provinsi</th>
                  <th>Kota/Kabupaten</th>
                  <th style={{ width: '10%' }}>Area</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-muted py-4">Tidak ada data</td></tr>
                ) : (
                  filtered.map((r, idx) => (
                    <tr key={idx}>
                      <td>{r.provinsi}</td>
                      <td className="area-cell">{r.kota}</td>
                      <td><span className="badge" style={{ background:'#212529', color:'#fff' }}>{r.area}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


