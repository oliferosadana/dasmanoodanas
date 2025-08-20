"use client";
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` };
}

export default function ManagementPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: '', provider: '', nama_paket: '', area: '', stok: 0, harga: 0 });
  const [deleteId, setDeleteId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookUrlStok, setWebhookUrlStok] = useState('');

  useEffect(() => {
    (async function check() {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return (window.location.href = '/login');
        const resp = await fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } });
        if (!resp.ok) return (window.location.href = '/login');
        load();
        loadSavedWebhooks();
      } catch {
        window.location.href = '/login';
      }
    })();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const resp = await fetch('/api/paket', { headers: getAuthHeaders() });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const json = await resp.json();
      setRows(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function showAlert(message, type) {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  }

  async function fetchDetail(id) {
    const resp = await fetch(`/api/paket/${id}`, { headers: getAuthHeaders() });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();
    setForm({ id: data.id, provider: data.provider, nama_paket: data.nama_paket, area: data.area || '', stok: data.stok, harga: data.harga || 0 });
  }

  async function save() {
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `/api/paket/${form.id}` : '/api/paket';
    const resp = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify({ provider: form.provider, nama_paket: form.nama_paket, area: form.area, stok: Number(form.stok), harga: Number(form.harga) }) });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    showAlert(`Paket berhasil ${form.id ? 'diperbarui' : 'ditambahkan'}`, 'success');
    setForm({ id: '', provider: '', nama_paket: '', area: '', stok: 0, harga: 0 });
    await load();
  }

  async function remove(id) {
    const resp = await fetch(`/api/paket/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    showAlert('Paket berhasil dihapus', 'success');
    await load();
  }

  async function saveInlineStock(row, stok) {
    const payload = { provider: row.provider, nama_paket: row.nama_paket, area: row.area || '', harga: row.harga || 0, stok };
    const resp = await fetch(`/api/paket/${row.id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(payload) });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    await load();
  }

  async function broadcast(url) {
    const resp = await fetch('/api/broadcast', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ url }) });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    showAlert('Broadcast berhasil dikirim', 'success');
  }

  async function loadSavedWebhooks() {
    try {
      const resp = await fetch('/api/settings/webhooks', { headers: getAuthHeaders() });
      if (resp.ok) {
        const data = await resp.json();
        setWebhookUrl(data.webhook_url || '');
        setWebhookUrlStok(data.webhook_url_stok || '');
      }
    } catch {}
  }

  async function saveWebhooks() {
    const resp = await fetch('/api/settings/webhooks', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ webhook_url: webhookUrl, webhook_url_stok: webhookUrlStok }) });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    showAlert('URL webhook berhasil disimpan', 'success');
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-brand">
        <div className="container d-flex align-items-center">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center">
            <Image src="/img/logo.png" alt="Logo" width={32} height={32} style={{ marginRight: 10 }} /> DAS STOK AKRAB
          </span>
          <div>
            <a href="/" className="btn btn-outline-brand me-2"><i className="bi bi-speedometer2"></i> Dashboard</a>
            <button onClick={() => { localStorage.removeItem('auth_token'); window.location.href = '/login'; }} className="btn btn-outline-danger"><i className="bi bi-box-arrow-right"></i> Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">Management Stok Paket Kuota</h2>
            <button onClick={() => setForm({ id: '', provider: '', nama_paket: '', area: '', stok: 0, harga: 0 })} className="btn btn-brand btn-sm"><i className="bi bi-plus-circle"></i> Tambah Paket</button>
          </div>
          <div className="toolbar-card">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-lg-5">
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                  <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} type="url" className="form-control" placeholder="https://example.com/webhook" />
                  <button onClick={() => broadcast(webhookUrl)} className="btn btn-outline-brand btn-compact"><i className="bi bi-broadcast"></i> Broadcast</button>
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                  <input value={webhookUrlStok} onChange={e => setWebhookUrlStok(e.target.value)} type="url" className="form-control" placeholder="https://example.com/webhook-stok" />
                  <button onClick={() => broadcast(webhookUrlStok)} className="btn btn-outline-brand btn-compact"><i className="bi bi-broadcast"></i> Broadcast Stok</button>
                </div>
              </div>
              <div className="col-12 col-lg-2">
                <button onClick={saveWebhooks} className="btn btn-brand w-100"><i className="bi bi-save"></i> Simpan URL</button>
              </div>
            </div>
          </div>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">{alert.message}</div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Provider</th>
                    <th>Nama Paket</th>
                    <th>Area</th>
                    <th>Stok</th>
                    <th>Harga</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="text-center">Loading data...</td></tr>
                  ) : rows.length === 0 ? (
                    <tr><td colSpan={8} className="text-center">Tidak ada data</td></tr>
                  ) : (
                    rows.map((item, index) => {
                      const status = item.stok === 0 ? { c: 'stock-out', t: 'Habis' } : item.stok < 5 ? { c: 'stock-low', t: 'Rendah' } : { c: 'stock-available', t: 'Tersedia' };
                      return (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.provider}</td>
                          <td>{item.nama_paket}</td>
                          <td>{item.area || '-'}</td>
                          <td>
                            <input type="number" className="form-control form-control-sm" style={{ width: 90 }} defaultValue={item.stok} min={0}
                              onBlur={(e) => {
                                const v = parseInt(e.target.value || '0', 10);
                                saveInlineStock(item, Number.isFinite(v) ? v : 0).catch(err => showAlert('Gagal update stok: ' + err.message, 'danger'));
                              }} />
                          </td>
                          <td>{formatRupiah(item.harga)}</td>
                          <td className="status-cell"><span className={status.c}>{status.t}</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => fetchDetail(item.id)}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(item.id)}><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Form modal substitute */}
        <div className="card mt-3">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3"><input className="form-control" placeholder="Provider" value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} /></div>
              <div className="col-md-3"><input className="form-control" placeholder="Nama Paket" value={form.nama_paket} onChange={e => setForm({ ...form, nama_paket: e.target.value })} /></div>
              <div className="col-md-3"><input className="form-control" placeholder="Area" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} /></div>
              <div className="col-md-1"><input type="number" className="form-control" placeholder="Stok" value={form.stok} onChange={e => setForm({ ...form, stok: e.target.value })} /></div>
              <div className="col-md-2"><input type="number" className="form-control" placeholder="Harga" value={form.harga} onChange={e => setForm({ ...form, harga: e.target.value })} /></div>
              <div className="col-12 d-flex gap-2">
                <button className="btn btn-primary" onClick={() => save().catch(err => showAlert('Gagal simpan: ' + err.message, 'danger'))}>Simpan</button>
                {form.id && <button className="btn btn-secondary" onClick={() => setForm({ id: '', provider: '', nama_paket: '', area: '', stok: 0, harga: 0 })}>Batal</button>}
              </div>
            </div>
          </div>
        </div>

        {deleteId && (
          <div className="alert alert-warning mt-3 d-flex justify-content-between align-items-center">
            <div>Hapus paket ini?</div>
            <div className="d-flex gap-2">
              <button className="btn btn-danger btn-sm" onClick={() => remove(deleteId).catch(err => showAlert('Gagal hapus: ' + err.message, 'danger')).finally(() => setDeleteId(null))}>Hapus</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setDeleteId(null)}>Batal</button>
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


