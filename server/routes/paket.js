const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Get all paket
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM paket_kuota ORDER BY provider, nama_paket');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single paket
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM paket_kuota WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Paket not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching paket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new paket
router.post('/', async (req, res) => {
  const { provider, nama_paket, area, stok, harga } = req.body;
  
  if (!provider || !nama_paket || stok === undefined || harga === undefined) {
    return res.status(400).json({ message: 'Provider, nama paket, stok, dan harga wajib diisi' });
  }
  
  const areaValue = (area ?? '').toString().trim().slice(0, 100);
  
  try {
    const [result] = await pool.query(
      'INSERT INTO paket_kuota (provider, nama_paket, area, stok, harga) VALUES (?, ?, ?, ?, ?)',
      [provider, nama_paket, areaValue, stok, harga]
    );
    
    res.status(201).json({ 
      message: 'Paket created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating paket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a paket
router.put('/:id', async (req, res) => {
  const { provider, nama_paket, area, stok, harga } = req.body;
  const id = req.params.id;
  
  if (!provider || !nama_paket || stok === undefined || harga === undefined) {
    return res.status(400).json({ message: 'Provider, nama paket, stok, dan harga wajib diisi' });
  }
  
  const areaValue = (area ?? '').toString().trim().slice(0, 100);
  
  try {
    const [result] = await pool.query(
      'UPDATE paket_kuota SET provider = ?, nama_paket = ?, area = ?, stok = ?, harga = ? WHERE id = ?',
      [provider, nama_paket, areaValue, stok, harga, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Paket not found' });
    }
    
    res.json({ message: 'Paket updated successfully' });
  } catch (error) {
    console.error('Error updating paket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a paket
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM paket_kuota WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Paket not found' });
    }
    
    res.json({ message: 'Paket deleted successfully' });
  } catch (error) {
    console.error('Error deleting paket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
