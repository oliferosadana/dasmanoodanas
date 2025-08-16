const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { testConnection } = require('./db');
const paketRoutes = require('./routes/paket');
const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./middleware/auth');
const broadcastRoutes = require('./routes/broadcast');
const settingsRoutes = require('./routes/settings');
const areaApiRoutes = require('./routes/area');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Settings routes (protected)
app.use('/api/settings', authenticateToken, settingsRoutes);

// Broadcast route (protected)
app.use('/api/broadcast', authenticateToken, broadcastRoutes);

// Public GET route for paket (dashboard only)
app.get('/api/paket', async (req, res) => {
  const { pool } = require('./db');
  try {
    const [rows] = await pool.query('SELECT * FROM paket_kuota ORDER BY provider, nama_paket');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Public API route for area table
app.use('/api/area', areaApiRoutes);

// Protected API routes
app.use('/api/paket', authenticateToken, paketRoutes);

// Public routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/area', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/area.html'));
});

// Management route (redirects to login if not authenticated in frontend)
app.get('/management', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/management.html'));
});

// Start server
async function startServer() {
  // Test database connection
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } else {
    console.error('Could not connect to database. Server not started.');
  }
}

startServer();
