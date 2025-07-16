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
            `garage_slots` int(11) DEFAULT 10,
            `stash_slots` int(11) DEFAULT 50,
            `level` int(11) DEFAULT 1,
            `territory` longtext DEFAULT NULL,
            `stats` longtext DEFAULT NULL,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `name` (`name`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Tabela członków organizacji z indywidualnymi uprawnieniami
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_members` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `organization` varchar(50) NOT NULL,
            `identifier` varchar(50) NOT NULL,
            `firstname` varchar(50) NOT NULL,
            `lastname` varchar(50) NOT NULL,
            `org_grade` int(11) DEFAULT 0,
            `permissions` longtext DEFAULT '[]',
            `individual_permissions` longtext DEFAULT '[]',
            `salary` int(11) DEFAULT 0,
            `phone_number` varchar(20) DEFAULT NULL,
            `joined_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            `last_active` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `org_member` (`organization`, `identifier`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Tabela zaproszeń do organizacji
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_invitations` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `organization` varchar(50) NOT NULL,
            `target_identifier` varchar(50) NOT NULL,
            `invited_by` varchar(50) NOT NULL,
            `status` enum('pending','accepted','declined') DEFAULT 'pending',
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
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

    -- Tabela pojazdów do trackingu z GTA 5 lore
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
            `owner_name` varchar(100) DEFAULT NULL,
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

    -- Dodaj kolumnę statystyk do organizacji
    MySQL.query('ALTER TABLE `org_organizations` ADD COLUMN `stats` longtext DEFAULT NULL')
    
    -- Dodaj kolumnę numeru telefonu do członków
    MySQL.query('ALTER TABLE `org_members` ADD COLUMN `phone_number` varchar(20) DEFAULT NULL')
    
    -- Tabela pojazdów organizacji
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `org_vehicles` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `organization` varchar(50) NOT NULL,
            `model` varchar(50) NOT NULL,
            `plate` varchar(20) NOT NULL,
            `stored` tinyint(1) DEFAULT 1,
            `garage` varchar(50) DEFAULT 'main',
            `fuel` int(11) DEFAULT 100,
            `engine` float DEFAULT 1000.0,
            `body` float DEFAULT 1000.0,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])

    -- Dodaj przykładowe organizacje
    local organizations = {
        {name = 'ballas', label = 'Ballas Gang', balance = 100000, crypto_balance = 50.0},
        {name = 'families', label = 'Grove Street Families', balance = 150000, crypto_balance = 75.0},
        {name = 'vagos', label = 'Los Santos Vagos', balance = 120000, crypto_balance = 60.0},
        {name = 'marabunta', label = 'Marabunta Grande', balance = 80000, crypto_balance = 40.0}
    }

    for _, org in pairs(organizations) do
        MySQL.insert('INSERT IGNORE INTO org_organizations (name, label, balance, crypto_balance) VALUES (?, ?, ?, ?)', {
            org.name, org.label, org.balance, org.crypto_balance
        })
    end

    -- Wstaw początkowe dane kryptowalut
    for symbol, data in pairs(Config.Crypto) do
        local price = math.random(data.min_price * 100, data.max_price * 100) / 100
        MySQL.insert('INSERT INTO org_crypto_prices (crypto_symbol, price_usd, change_24h) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE price_usd = VALUES(price_usd)', {
            symbol, price, math.random(-500, 500) / 100
        })
    end

    -- Dodaj kryptowaluty do organizacji
    MySQL.query('SELECT name FROM org_organizations', {}, function(orgs)
        for _, org in pairs(orgs) do
            for symbol, _ in pairs(Config.Crypto) do
                MySQL.insert('INSERT IGNORE INTO org_crypto_portfolio (organization, crypto_symbol, amount_owned, wallet_address) VALUES (?, ?, ?, ?)', {
                    org.name, symbol, 0.0, GenerateWalletAddress()
                })
            end
        end
    end)

    print('^2[ORG-TABLET]^7 Baza danych została zainicjalizowana')
end)

-- Generowanie adresu portfela
function GenerateWalletAddress()
    local chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    local address = ''
    for i = 1, 34 do
        local rand = math.random(#chars)
        address = address .. chars:sub(rand, rand)
    end
    return address
end

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

-- Aktualizacja pojazdów co 30 minut
CreateThread(function()
    while true do
        Wait(1800000) -- 30 minut
        
        -- Dodaj nowe pojazdy losowo
        local newVehicles = {
            {model = 'sultan', plate = 'STRX'..math.random(100,999), location = 'Sandy Shores', value = math.random(45000, 85000), difficulty = 'Łatwy'},
            {model = 'elegy2', plate = 'TUNE'..math.random(100,999), location = 'Grapeseed', value = math.random(55000, 95000), difficulty = 'Łatwy'},
            {model = 'jester', plate = 'SPRT'..math.random(100,999), location = 'Palomino Freeway', value = math.random(75000, 125000), difficulty = 'Średni'},
            {model = 'kuruma', plate = 'ARMR'..math.random(100,999), location = 'Grand Senora Desert', value = math.random(95000, 145000), difficulty = 'Średni'}
        }
        
        local randomVehicle = newVehicles[math.random(#newVehicles)]
        local coords = {
            x = math.random(-3000, 3000),
            y = math.random(-3000, 3000),
            z = math.random(1, 500)
        }
        
        MySQL.insert('INSERT INTO org_tracked_vehicles (organization, model, plate, location, value, difficulty, owner_name, coords) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', {
            '', randomVehicle.model, randomVehicle.plate, randomVehicle.location, randomVehicle.value, randomVehicle.difficulty, 'Unknown Owner', json.encode(coords)
        })
    end
end)
