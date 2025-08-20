"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        const resp = await fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } });
        if (resp.ok) {
          window.location.href = '/management';
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (_) {
        localStorage.removeItem('auth_token');
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.message || 'Login gagal');
        return;
      }
      localStorage.setItem('auth_token', data.token);
      window.location.href = '/management';
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-brand">
        <div className="container d-flex align-items-center">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <Image src="/img/logo.png" alt="Logo" width={32} height={32} style={{ marginRight: 10 }} /> OODANAA STORE
          </a>
        </div>
      </nav>
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="login-form">
          <div className="text-center mb-3"><i className="bi bi-box-seam" style={{ fontSize: '3rem', color: '#343a40' }}></i></div>
          <h3 className="text-center mb-4">DAS STOK AKRAB</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person"></i></span>
                <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Masukkan username" />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input type={showPassword ? 'text' : 'password'} className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Masukkan password" />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(s => !s)}>{showPassword ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <button type="submit" className="btn btn-brand w-100" disabled={submitting || checking}>
              {submitting ? (<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>) : (<i className="bi bi-box-arrow-in-right me-2"></i>)}
              {submitting ? 'Memproses...' : 'Login'}
            </button>
          </form>
          <div className="text-center mt-4">
            <a href="/" className="text-decoration-none text-secondary"><i className="bi bi-arrow-left me-1"></i> Kembali ke Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  );
}


