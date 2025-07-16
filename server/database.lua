
-- Tworzenie tabel organizacji
CreateThread(function()
    -- Tabela organizacji
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_organizations` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `name` varchar(50) NOT NULL,
            `label` varchar(100) NOT NULL,
            `balance` bigint(20) DEFAULT 0,
            `crypto_balance` decimal(15,8) DEFAULT 0.0,
            `member_slots` int(11) DEFAULT 20,
            `level` int(11) DEFAULT 1,
            `territory` longtext DEFAULT NULL,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `name` (`name`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Tabela członków organizacji
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_members` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `organization` varchar(50) NOT NULL,
            `identifier` varchar(50) NOT NULL,
            `firstname` varchar(50) NOT NULL,
            `lastname` varchar(50) NOT NULL,
            `grade` int(11) DEFAULT 0,
            `permissions` longtext DEFAULT '[]',
            `joined_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            `last_active` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `org_member` (`organization`, `identifier`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Tabela transakcji
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_transactions` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `organization` varchar(50) NOT NULL,
            `identifier` varchar(50) DEFAULT NULL,
            `type` enum('income','expense','transfer','crypto_buy','crypto_sell') NOT NULL,
            `category` varchar(50) NOT NULL,
            `amount` decimal(15,2) NOT NULL,
            `description` text DEFAULT NULL,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `organization` (`organization`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Tabela kryptowalut
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_crypto_portfolio` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `organization` varchar(50) NOT NULL,
            `crypto_symbol` varchar(20) NOT NULL,
            `amount_owned` decimal(18,8) DEFAULT 0.0,
            `wallet_address` varchar(50) NOT NULL,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `org_crypto` (`organization`, `crypto_symbol`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Tabela cen kryptowalut
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_crypto_prices` (
            `crypto_symbol` varchar(20) NOT NULL,
            `price_usd` decimal(15,8) NOT NULL,
            `change_24h` decimal(8,4) DEFAULT 0.0,
            `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`crypto_symbol`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Tabela notatek
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_notes` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `organization` varchar(50) NOT NULL,
            `identifier` varchar(50) NOT NULL,
            `title` varchar(255) NOT NULL,
            `content` longtext NOT NULL,
            `is_pinned` tinyint(1) DEFAULT 0,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Tabela zakupionych aplikacji
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_purchased_apps` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `organization` varchar(50) NOT NULL,
            `app_id` varchar(50) NOT NULL,
            `purchased_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `org_app` (`organization`, `app_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Tabela pojazdów do trackingu
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_tracked_vehicles` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `organization` varchar(50) NOT NULL,
            `model` varchar(50) NOT NULL,
            `plate` varchar(20) NOT NULL,
            `location` varchar(255) NOT NULL,
            `value` decimal(10,2) NOT NULL,
            `difficulty` enum('Łatwy','Średni','Trudny') NOT NULL,
            `coords` longtext DEFAULT NULL,
            `tracked_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Tabela zleceń
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_jobs` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `organization` varchar(50) NOT NULL,
            `title` varchar(255) NOT NULL,
            `description` text NOT NULL,
            `job_type` enum('delivery','security','collection','heist','other') NOT NULL,
            `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
            `reward` decimal(10,2) NOT NULL,
            `assigned_to` varchar(50) DEFAULT NULL,
            `status` enum('available','assigned','in_progress','completed','cancelled') DEFAULT 'available',
            `deadline` datetime DEFAULT NULL,
            `created_by` varchar(50) NOT NULL,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Wstaw początkowe dane kryptowalut
    for symbol, data in pairs(Config.Crypto) do
        local price = math.random(data.min_price * 100, data.max_price * 100) / 100
        MySQL.insert('INSERT INTO org_crypto_prices (crypto_symbol, price_usd, change_24h) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE price_usd = VALUES(price_usd)', {
            symbol, price, math.random(-500, 500) / 100
        })
    end

    print('^2[ORG-TABLET]^7 Baza danych została zainicjalizowana')
end)

-- Aktualizacja cen kryptowalut co 5 minut
CreateThread(function()
    while true do
        Wait(300000) -- 5 minut
        
        for symbol, data in pairs(Config.Crypto) do
            local currentPrice = MySQL.scalar.await('SELECT price_usd FROM org_crypto_prices WHERE crypto_symbol = ?', {symbol})
            if currentPrice then
                local change = (math.random(-data.volatility * 100, data.volatility * 100) / 100)
                local newPrice = currentPrice * (1 + change)
                newPrice = math.max(data.min_price, math.min(data.max_price, newPrice))
                
                MySQL.update('UPDATE org_crypto_prices SET price_usd = ?, change_24h = ?, updated_at = NOW() WHERE crypto_symbol = ?', {
                    newPrice, change * 100, symbol
                })
            end
        end
    end
end)
