-- Database creation
CREATE DATABASE IF NOT EXISTS stok_kuota;
USE stok_kuota;

-- Table creation for packages
CREATE TABLE IF NOT EXISTS paket_kuota (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  nama_paket VARCHAR(100) NOT NULL,
  area VARCHAR(100) DEFAULT '',
  stok INT NOT NULL DEFAULT 0,
  harga INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table creation for users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for packages
INSERT INTO paket_kuota (provider, nama_paket, area, stok, harga) VALUES
('XL', 'Super Mini', '', 4, 10000),
('XL', 'MegaBig', '', 0, 20000),
('XL', 'Mini', 'Area A', 42, 5000);

-- Sample user (username: admin, password: admin123)
-- Note: In production, always use properly hashed passwords
INSERT INTO users (username, password, name) VALUES
('admin', '$2b$10$CRIlr5B7WnJRS/ZpGc9q6O0bo32BfdDD.XNkYs3yM0cyI2zw7/wRW', 'Administrator');