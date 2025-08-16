const express = require('express');
const { pool } = require('../db');

const router = express.Router();

async function ensureTableAndRow() {
	await pool.query(`CREATE TABLE IF NOT EXISTS settings (
		id INT PRIMARY KEY,
		webhook_url TEXT,
		webhook_url_stok TEXT,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	)`);
	const [rows] = await pool.query('SELECT id FROM settings WHERE id = 1');
	if (rows.length === 0) {
		await pool.query('INSERT INTO settings (id, webhook_url, webhook_url_stok) VALUES (1, \'\', \'\')');
	}
}

// GET /api/settings/webhooks
router.get('/webhooks', async (req, res) => {
	try {
		await ensureTableAndRow();
		const [rows] = await pool.query('SELECT webhook_url, webhook_url_stok FROM settings WHERE id = 1');
		return res.json(rows[0] || { webhook_url: '', webhook_url_stok: '' });
	} catch (error) {
		console.error('Get webhooks error:', error);
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// POST /api/settings/webhooks
// Body: { webhook_url?: string, webhook_url_stok?: string }
router.post('/webhooks', async (req, res) => {
	try {
		await ensureTableAndRow();
		const webhookUrl = (req.body?.webhook_url || '').toString().trim();
		const webhookUrlStok = (req.body?.webhook_url_stok || '').toString().trim();
		await pool.query('UPDATE settings SET webhook_url = ?, webhook_url_stok = ? WHERE id = 1', [webhookUrl, webhookUrlStok]);
		return res.json({ message: 'Settings updated' });
	} catch (error) {
		console.error('Save webhooks error:', error);
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
});

module.exports = router;
