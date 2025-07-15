
-- ============================================
-- TABLET OS DATABASE STRUCTURE
-- Compatible with ox_mysql for FiveM/QBCore
-- ============================================

-- Organizations table
CREATE TABLE IF NOT EXISTS `tablet_organizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `balance` bigint(20) DEFAULT 0,
  `crypto_balance` decimal(15,8) DEFAULT 0.0,
  `member_slots` int(11) DEFAULT 20,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Organization members table
CREATE TABLE IF NOT EXISTS `tablet_organization_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `player_id` varchar(50) NOT NULL,
  `player_name` varchar(100) NOT NULL,
  `rank` int(11) DEFAULT 1,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`permissions`)),
  `joined_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `last_active` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `player_id` (`player_id`),
  UNIQUE KEY `org_player` (`organization_id`, `player_id`),
  CONSTRAINT `fk_org_members_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transactions table
CREATE TABLE IF NOT EXISTS `tablet_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `player_id` varchar(50) DEFAULT NULL,
  `type` enum('income','expense','transfer') NOT NULL,
  `category` varchar(50) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `player_id` (`player_id`),
  KEY `type` (`type`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `fk_transactions_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS `tablet_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `player_id` varchar(50) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `status` enum('pending','approved','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `player_id` (`player_id`),
  KEY `status` (`status`),
  CONSTRAINT `fk_orders_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Crypto portfolio table
CREATE TABLE IF NOT EXISTS `tablet_crypto_portfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `crypto_symbol` varchar(20) NOT NULL,
  `crypto_name` varchar(100) NOT NULL,
  `amount_owned` decimal(18,8) DEFAULT 0.0,
  `wallet_number` varchar(50) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `crypto_symbol` (`crypto_symbol`),
  UNIQUE KEY `org_crypto` (`organization_id`, `crypto_symbol`),
  CONSTRAINT `fk_crypto_portfolio_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Crypto prices table (for market simulation)
CREATE TABLE IF NOT EXISTS `tablet_crypto_prices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `crypto_symbol` varchar(20) NOT NULL,
  `price_usd` decimal(15,8) NOT NULL,
  `change_24h` decimal(8,4) DEFAULT 0.0,
  `volume_24h` decimal(20,2) DEFAULT 0.0,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `crypto_symbol` (`crypto_symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Crypto transactions table
CREATE TABLE IF NOT EXISTS `tablet_crypto_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `player_id` varchar(50) NOT NULL,
  `crypto_symbol` varchar(20) NOT NULL,
  `transaction_type` enum('buy','sell','deposit','transfer') NOT NULL,
  `amount` decimal(18,8) NOT NULL,
  `price_per_unit` decimal(15,8) DEFAULT NULL,
  `total_value` decimal(15,2) DEFAULT NULL,
  `wallet_from` varchar(50) DEFAULT NULL,
  `wallet_to` varchar(50) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `player_id` (`player_id`),
  KEY `crypto_symbol` (`crypto_symbol`),
  KEY `transaction_type` (`transaction_type`),
  CONSTRAINT `fk_crypto_transactions_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notes table
CREATE TABLE IF NOT EXISTS `tablet_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `player_id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `is_pinned` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `player_id` (`player_id`),
  KEY `is_pinned` (`is_pinned`),
  CONSTRAINT `fk_notes_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Installed apps table
CREATE TABLE IF NOT EXISTS `tablet_installed_apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  `app_name` varchar(100) NOT NULL,
  `installed_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  UNIQUE KEY `org_app` (`organization_id`, `app_id`),
  CONSTRAINT `fk_installed_apps_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Purchased apps table
CREATE TABLE IF NOT EXISTS `tablet_purchased_apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  `app_name` varchar(100) NOT NULL,
  `purchase_price` decimal(10,2) NOT NULL,
  `purchased_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  UNIQUE KEY `org_app_purchase` (`organization_id`, `app_id`),
  CONSTRAINT `fk_purchased_apps_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Heists/Napady table
CREATE TABLE IF NOT EXISTS `tablet_heists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `heist_name` varchar(255) NOT NULL,
  `target_location` varchar(255) NOT NULL,
  `difficulty` enum('easy','medium','hard','extreme') NOT NULL,
  `required_members` int(11) NOT NULL,
  `estimated_payout` decimal(15,2) NOT NULL,
  `status` enum('planning','in_progress','completed','failed') DEFAULT 'planning',
  `planned_date` datetime DEFAULT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `status` (`status`),
  CONSTRAINT `fk_heists_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Heist participants table
CREATE TABLE IF NOT EXISTS `tablet_heist_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `heist_id` int(11) NOT NULL,
  `player_id` varchar(50) NOT NULL,
  `player_name` varchar(100) NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `status` enum('invited','accepted','declined','ready') DEFAULT 'invited',
  `joined_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `heist_id` (`heist_id`),
  KEY `player_id` (`player_id`),
  UNIQUE KEY `heist_player` (`heist_id`, `player_id`),
  CONSTRAINT `fk_heist_participants_heist` FOREIGN KEY (`heist_id`) REFERENCES `tablet_heists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Jobs/Zlecenia table
CREATE TABLE IF NOT EXISTS `tablet_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `job_description` text NOT NULL,
  `job_type` enum('delivery','security','collection','other') NOT NULL,
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `reward` decimal(10,2) NOT NULL,
  `assigned_to` varchar(50) DEFAULT NULL,
  `status` enum('available','assigned','in_progress','completed','cancelled') DEFAULT 'available',
  `deadline` datetime DEFAULT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `status` (`status`),
  CONSTRAINT `fk_jobs_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notifications table
CREATE TABLE IF NOT EXISTS `tablet_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` int(11) NOT NULL,
  `player_id` varchar(50) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `player_id` (`player_id`),
  KEY `is_read` (`is_read`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `fk_notifications_org` FOREIGN KEY (`organization_id`) REFERENCES `tablet_organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert sample organization
INSERT INTO `tablet_organizations` (`id`, `name`, `balance`, `crypto_balance`, `member_slots`) VALUES
(1, 'Ballas', 12329713, 15.75000000, 20),
(2, 'Vagos', 8456231, 23.42000000, 25);

-- Insert sample crypto prices
INSERT INTO `tablet_crypto_prices` (`crypto_symbol`, `price_usd`, `change_24h`) VALUES
('LCOIN', 2847.50000000, 3.2100),
('VCASH', 1542.15000000, -2.1400),
('SANCOIN', 567.89000000, 5.6700),
('NCCOIN', 234.56000000, -1.2300),
('BULLCOIN', 89.34000000, 8.4500),
('LSCOIN', 45.67000000, -3.4500);

-- Insert sample crypto portfolio for Ballas
INSERT INTO `tablet_crypto_portfolio` (`organization_id`, `crypto_symbol`, `crypto_name`, `amount_owned`, `wallet_number`) VALUES
(1, 'LCOIN', 'Liberty Coin', 5.28470000, 'LC-4578-9021-3456'),
(1, 'VCASH', 'Vice Cash', 8.10000000, 'VC-7823-1456-9087'),
(1, 'SANCOIN', 'San Andreas Coin', 15.20000000, 'SA-2341-7865-4321');

-- Insert sample organization members
INSERT INTO `tablet_organization_members` (`organization_id`, `player_id`, `player_name`, `rank`) VALUES
(1, 'player1', 'John Davis', 7),
(1, 'player2', 'Mike Johnson', 5),
(1, 'player3', 'Sarah Wilson', 3);

-- Insert sample notes
INSERT INTO `tablet_notes` (`organization_id`, `player_id`, `title`, `content`, `is_pinned`) VALUES
(1, 'player1', 'Spotkanie organizacji', 'Spotkanie w sobotę o 20:00. Wszyscy muszą być obecni.', 1),
(1, 'player2', 'Zakup sprzętu', 'Potrzebujemy nowych broni. Budget: $50,000', 0);

-- ============================================
-- USEFUL QUERIES FOR LUA INTEGRATION
-- ============================================

-- Get organization data
-- SELECT * FROM tablet_organizations WHERE id = ?

-- Get organization members
-- SELECT * FROM tablet_organization_members WHERE organization_id = ? ORDER BY rank DESC

-- Get transactions for organization
-- SELECT * FROM tablet_transactions WHERE organization_id = ? ORDER BY created_at DESC LIMIT 50

-- Get crypto portfolio
-- SELECT cp.*, cpr.price_usd, cpr.change_24h 
-- FROM tablet_crypto_portfolio cp 
-- LEFT JOIN tablet_crypto_prices cpr ON cp.crypto_symbol = cpr.crypto_symbol 
-- WHERE cp.organization_id = ?

-- Add member to organization
-- INSERT INTO tablet_organization_members (organization_id, player_id, player_name, rank) VALUES (?, ?, ?, ?)

-- Add transaction
-- INSERT INTO tablet_transactions (organization_id, player_id, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)

-- Update organization balance
-- UPDATE tablet_organizations SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?

-- Update crypto balance
-- UPDATE tablet_organizations SET crypto_balance = crypto_balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?

-- Create notification
-- INSERT INTO tablet_notifications (organization_id, player_id, title, message, type) VALUES (?, ?, ?, ?, ?)

-- Get unread notifications
-- SELECT * FROM tablet_notifications WHERE organization_id = ? AND is_read = 0 ORDER BY created_at DESC

-- Mark notification as read
-- UPDATE tablet_notifications SET is_read = 1 WHERE id = ?

-- Get notes for organization
-- SELECT * FROM tablet_notes WHERE organization_id = ? ORDER BY is_pinned DESC, updated_at DESC

-- Save/Update note
-- INSERT INTO tablet_notes (organization_id, player_id, title, content, is_pinned) VALUES (?, ?, ?, ?, ?)
-- ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content), is_pinned = VALUES(is_pinned), updated_at = CURRENT_TIMESTAMP

-- Purchase member slots
-- UPDATE tablet_organizations SET member_slots = member_slots + ?, crypto_balance = crypto_balance - ? WHERE id = ?
