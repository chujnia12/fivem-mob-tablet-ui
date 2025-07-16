
-- Kompletna baza danych dla systemu tabletu organizacji
-- Wykonaj to przed instalacją skryptu

-- Tabela organizacji (główna)
CREATE TABLE IF NOT EXISTS `org_organizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL UNIQUE,
  `label` varchar(100) NOT NULL,
  `balance` bigint(20) DEFAULT 0,
  `crypto_balance` decimal(15,2) DEFAULT 25.00,
  `level` int(11) DEFAULT 1,
  `member_slots` int(11) DEFAULT 10,
  `garage_slots` int(11) DEFAULT 5,
  `stash_slots` int(11) DEFAULT 1000,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela członków organizacji
CREATE TABLE IF NOT EXISTS `org_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(60) NOT NULL,
  `organization` varchar(50) NOT NULL,
  `org_grade` int(11) DEFAULT 0,
  `individual_permissions` longtext DEFAULT NULL,
  `joined_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `identifier` (`identifier`),
  KEY `organization` (`organization`),
  FOREIGN KEY (`organization`) REFERENCES `org_organizations`(`name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela transakcji finansowych
CREATE TABLE IF NOT EXISTS `org_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization` varchar(50) NOT NULL,
  `identifier` varchar(60) DEFAULT NULL,
  `type` enum('income','expense','transfer','crypto_buy','crypto_sell') NOT NULL,
  `category` varchar(50) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization` (`organization`),
  KEY `type` (`type`),
  KEY `created_at` (`created_at`),
  FOREIGN KEY (`organization`) REFERENCES `org_organizations`(`name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela zaproszeń do organizacji
CREATE TABLE IF NOT EXISTS `org_invitations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization` varchar(50) NOT NULL,
  `target_identifier` varchar(60) NOT NULL,
  `inviter_identifier` varchar(60) NOT NULL,
  `status` enum('pending','accepted','declined') DEFAULT 'pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `responded_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `target_identifier` (`target_identifier`),
  KEY `organization` (`organization`),
  FOREIGN KEY (`organization`) REFERENCES `org_organizations`(`name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela notatek organizacji
CREATE TABLE IF NOT EXISTS `org_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization` varchar(50) NOT NULL,
  `identifier` varchar(60) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` longtext NOT NULL,
  `is_pinned` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization` (`organization`),
  KEY `is_pinned` (`is_pinned`),
  FOREIGN KEY (`organization`) REFERENCES `org_organizations`(`name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela zleceń/misji
CREATE TABLE IF NOT EXISTS `org_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `job_type` varchar(50) NOT NULL DEFAULT 'general',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `reward` decimal(15,2) DEFAULT 0,
  `assigned_to` varchar(60) DEFAULT NULL,
  `created_by` varchar(60) NOT NULL,
  `status` enum('available','assigned','in_progress','completed','cancelled') DEFAULT 'available',
  `deadline` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `organization` (`organization`),
  KEY `status` (`status`),
  KEY `assigned_to` (`assigned_to`),
  FOREIGN KEY (`organization`) REFERENCES `org_organizations`(`name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela portfela kryptowalut
CREATE TABLE IF NOT EXISTS `org_crypto_portfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization` varchar(50) NOT NULL,
  `crypto_symbol` varchar(10) NOT NULL,
  `amount_owned` decimal(15,8) DEFAULT 0,
  `wallet_address` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `org_crypto` (`organization`, `crypto_symbol`),
  FOREIGN KEY (`organization`) REFERENCES `org_organizations`(`name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela cen kryptowalut
CREATE TABLE IF NOT EXISTS `org_crypto_prices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `crypto_symbol` varchar(10) NOT NULL UNIQUE,
  `price_usd` decimal(15,8) NOT NULL,
  `change_24h` decimal(5,2) DEFAULT 0,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `crypto_symbol` (`crypto_symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela zakupionych aplikacji
CREATE TABLE IF NOT EXISTS `org_purchased_apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization` varchar(50) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  `purchased_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `org_app` (`organization`, `app_id`),
  FOREIGN KEY (`organization`) REFERENCES `org_organizations`(`name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela trackowanych pojazdów
CREATE TABLE IF NOT EXISTS `org_tracked_vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization` varchar(50) DEFAULT '',
  `model` varchar(50) NOT NULL,
  `plate` varchar(10) NOT NULL,
  `location` varchar(100) NOT NULL,
  `value` int(11) NOT NULL,
  `difficulty` varchar(20) NOT NULL,
  `coords` longtext NOT NULL,
  `owner_name` varchar(100) DEFAULT 'Unknown',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization` (`organization`),
  KEY `difficulty` (`difficulty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wstaw podstawowe ceny kryptowalut
INSERT IGNORE INTO `org_crypto_prices` (`crypto_symbol`, `price_usd`, `change_24h`) VALUES
('COIN', 1.00, 0.00),
('LCOIN', 3000.00, 2.50),
('VCASH', 1500.00, -1.20),
('SANCOIN', 550.00, 4.80),
('NCCOIN', 250.00, -0.80),
('BULLCOIN', 100.00, 8.50);

-- Przykładowe trackowane pojazdy
INSERT IGNORE INTO `org_tracked_vehicles` (`model`, `plate`, `location`, `value`, `difficulty`, `coords`, `owner_name`) VALUES
('adder', 'ABC123', 'Centrum miasta', 120000, 'Trudny', '{"x": 215.0, "y": -810.0, "z": 30.0}', 'John Doe'),
('zentorno', 'XYZ789', 'Vinewood Hills', 95000, 'Średni', '{"x": -1020.0, "y": 360.0, "z": 70.0}', 'Jane Smith'),
('elegy2', 'DEF456', 'Sandy Shores', 45000, 'Łatwy', '{"x": 1680.0, "y": 3580.0, "z": 35.0}', 'Mike Johnson');
