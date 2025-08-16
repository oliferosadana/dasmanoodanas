const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// POST /api/broadcast
// Body: { url: string, id?: number }
router.post('/', async (req, res) => {
	try {
		const { url, id } = req.body || {};
		if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
			return res.status(400).json({ message: 'Webhook URL tidak valid' });
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
			data: rows
		};

		// Use global fetch (Node 18+)
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const responseText = await response.text().catch(() => '');
		if (!response.ok) {
			return res.status(502).json({ message: 'Webhook gagal merespon', status: response.status, body: responseText });
		}

		return res.json({ message: 'Broadcast berhasil dikirim', status: response.status, body: responseText });
	} catch (error) {
		console.error('Broadcast error:', error);
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
});

module.exports = router;
