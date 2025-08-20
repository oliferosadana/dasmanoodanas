-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 20, 2025 at 07:40 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stok_kuota`
--

-- --------------------------------------------------------

--
-- Table structure for table `paket_kuota`
--

CREATE TABLE `paket_kuota` (
  `id` int NOT NULL,
  `provider` varchar(50) NOT NULL,
  `nama_paket` varchar(100) NOT NULL,
  `area` varchar(100) DEFAULT '',
  `stok` int NOT NULL DEFAULT '0',
  `harga` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `paket_kuota`
--

INSERT INTO `paket_kuota` (`id`, `provider`, `nama_paket`, `area`, `stok`, `harga`, `created_at`, `updated_at`) VALUES
(24, 'XL', 'Mega Big', 'Area 1 : 87 - 90 GB\nArea 2 : 89 - 92 GB\nArea 3 : 94 - 97 gb\nArea 4 : 104 - 107 GB', 0, 94000, '2025-08-16 05:12:24', '2025-08-16 05:40:34'),
(25, 'XL', 'Jumbo V2', 'AREA 1 : 50-53 GB\nAREA 2 : 52-55 GB\nAREA 3 : 57-60 GB\nAREA 4 : 67-70 GB', 0, 72000, '2025-08-16 05:13:49', '2025-08-16 05:20:02'),
(26, 'XL', 'Jumbo', 'AREA 1 : 65 GB\nAREA 2 : 70 GB\nAREA 3 : 83 GB\nAREA 4 : 123 GB', 0, 82000, '2025-08-16 05:14:35', '2025-08-20 06:05:12'),
(27, 'XL', 'Big Plus', 'AREA 1 : 35 GB\nAREA 2 : 38 GB\nAREA 3 : 49 GB\nAREA 4 : 73 GB', 0, 67000, '2025-08-16 05:15:12', '2025-08-20 06:05:07'),
(28, 'XL', 'Big', 'AREA 1 : 38-40 GB\nAREA 2 : 40-42 GB \nAREA 3 : 45-47 GB \nAREA 4 : 55-57 GB', 1, 60000, '2025-08-16 05:16:06', '2025-08-20 07:38:26'),
(31, 'XL', 'Mini', 'AREA 1 : 31-33 GB\nAREA 2 : 33-35 GB\nAREA 3 : 38-40 GB\nAREA 4 : 48-50 GB', 0, 54000, '2025-08-16 05:22:22', '2025-08-16 05:22:22'),
(32, 'XL', 'Super Mini', 'AREA 1 : 13-15 GB\nAREA 2 : 15-17 GB\nAREA 3 : 20-22 GB\nAREA 4 : 30-32 GB', 0, 44000, '2025-08-16 05:23:00', '2025-08-16 05:37:32');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int NOT NULL,
  `webhook_url` text,
  `webhook_url_stok` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `webhook_url`, `webhook_url_stok`, `updated_at`) VALUES
(1, 'https://n8n.oodana.my.id/webhook/das-paket', 'https://n8n.oodana.my.id/webhook/das-stok', '2025-08-20 06:05:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `name`, `created_at`) VALUES
(5, 'admin', '$2b$10$c96GxD5THKrRMIq5IH517OD4.2YtReaFbV6odr8xNL8DVYRaDlXmu', 'Administrator', '2025-08-15 18:45:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `paket_kuota`
--
ALTER TABLE `paket_kuota`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `paket_kuota`
--
ALTER TABLE `paket_kuota`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
