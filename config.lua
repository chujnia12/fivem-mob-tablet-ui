
Config = {}

-- Podstawowe ustawienia
Config.Debug = true
Config.UseOxInventory = true

-- Uprawnienia organizacji
Config.Permissions = {
    ['manage_finances'] = 'Zarządzanie finansami',
    ['manage_members'] = 'Zarządzanie członkami',
    ['manage_crypto'] = 'Zarządzanie kryptowalutami',
    ['view_tracker'] = 'Dostęp do trackera',
    ['manage_jobs'] = 'Zarządzanie zleceniami',
    ['manage_notes'] = 'Zarządzanie notatkami',
    ['purchase_apps'] = 'Zakup aplikacji',
    ['stash_access'] = 'Dostęp do schowka',
    ['garage_access'] = 'Dostęp do garażu',
    ['missions_access'] = 'Dostęp do misji'
}

-- Stopnie organizacji z indywidualnymi uprawnieniami
Config.Grades = {
    [0] = {label = 'Rekrut', salary = 0, permissions = {}},
    [1] = {label = 'Członek', salary = 1000, permissions = {'stash_access', 'view_tracker'}},
    [2] = {label = 'Starszy Członek', salary = 2000, permissions = {'stash_access', 'garage_access', 'view_tracker', 'missions_access'}},
    [3] = {label = 'Porucznik', salary = 3000, permissions = {'stash_access', 'garage_access', 'view_tracker', 'manage_notes', 'missions_access', 'manage_jobs'}},
    [4] = {label = 'Zastępca', salary = 5000, permissions = {'stash_access', 'garage_access', 'view_tracker', 'manage_notes', 'missions_access', 'manage_jobs', 'manage_finances'}},
    [5] = {label = 'Szef', salary = 8000, permissions = {'stash_access', 'garage_access', 'view_tracker', 'manage_notes', 'missions_access', 'manage_jobs', 'manage_finances', 'manage_members', 'manage_crypto', 'purchase_apps'}}
}

-- Kryptowaluty
Config.Crypto = {
    ['LCOIN'] = {
        name = 'Liberty Coin',
        icon = '🏛️',
        min_price = 2500.0,
        max_price = 3500.0,
        volatility = 0.05
    },
    ['VCASH'] = {
        name = 'Vice Cash',
        icon = '🌴',
        min_price = 1200.0,
        max_price = 1800.0,
        volatility = 0.03
    },
    ['SANCOIN'] = {
        name = 'San Andreas Coin',
        icon = '🏔️',
        min_price = 400.0,
        max_price = 700.0,
        volatility = 0.07
    },
    ['NCCOIN'] = {
        name = 'North Coast Coin',
        icon = '🌊',
        min_price = 150.0,
        max_price = 350.0,
        volatility = 0.04
    },
    ['BULLCOIN'] = {
        name = 'Bull Coin',
        icon = '🐂',
        min_price = 50.0,
        max_price = 150.0,
        volatility = 0.10
    },
    ['LSCOIN'] = {
        name = 'Los Santos Coin',
        icon = '🌆',
        min_price = 20.0,
        max_price = 80.0,
        volatility = 0.08
    }
}

-- Aplikacje do kupienia
Config.Apps = {
    ['zlecenia'] = {
        name = 'Zlecenia',
        description = 'System zarządzania zleceniami organizacji',
        price = 50.0,
        icon = '📋'
    },
    ['kryptowaluty'] = {
        name = 'Kryptowaluty',
        description = 'Handel i zarządzanie kryptowalutami',
        price = 100.0,
        icon = '💰'
    },
    ['napady'] = {
        name = 'Napady',
        description = 'Planowanie i organizacja napadów',
        price = 200.0,
        icon = '🎭'
    },
    ['tracker'] = {
        name = 'Tracker',
        description = 'Śledzenie pojazdów w mieście',
        price = 75.0,
        icon = '🚗'
    }
}

-- Kategorie transakcji
Config.TransactionCategories = {
    income = {
        'Sprzedaż',
        'Inwestycje',
        'Zlecenia',
        'Napady',
        'Misje',
        'Inne'
    },
    expense = {
        'Broń',
        'Pojazdy',
        'Ubrania',
        'Wyposażenie',
        'Opłaty',
        'Rozbudowa',
        'Aplikacje',
        'Inne'
    }
}

-- Pojazdy GTA 5 do trackingu
Config.VehicleModels = {
    -- Supersport
    'adder', 'banshee', 'bullet', 'cheetah', 'entityxf', 'infernus', 'monroe', 'vacca', 'voltic', 'zentorno',
    'osiris', 't20', 'turismor', 'fmj', 'reaper', 'x80proto', 'tyrus', 'cyclone', 'visione', 'tezeract',
    -- Sport
    'alpha', 'banshee2', 'bestiagts', 'blista2', 'blista3', 'buffalo', 'buffalo2', 'buffalo3', 'carbonizzare', 'comet2',
    'coquette', 'elegy2', 'feltzer2', 'furoregt', 'fusilade', 'futo', 'jester', 'khamelion', 'kuruma', 'lynx',
    -- Sedan
    'asea', 'asterope', 'cog55', 'cog552', 'cognoscenti', 'cognoscenti2', 'emperor', 'emperor2', 'emperor3', 'fugitive',
    'glendale', 'ingot', 'intruder', 'limo2', 'premier', 'primo', 'primo2', 'regina', 'romero', 'schafter2',
    -- SUV
    'baller', 'baller2', 'baller3', 'baller4', 'baller5', 'baller6', 'cavalcade', 'cavalcade2', 'contender', 'dubsta',
    'dubsta2', 'fq2', 'granger', 'gresley', 'habanero', 'huntley', 'landstalker', 'mesa', 'mesa2', 'patriot',
    -- Compacts
    'blista', 'brioso', 'dilettante', 'dilettante2', 'issi2', 'panto', 'prairie', 'rhapsody'
}

-- Organizacje pojazdy
Config.OrgVehicles = {
    'sultan', 'kuruma', 'schafter2', 'buffalo', 'washington',
    'sandking', 'mesa', 'dubsta3', 'patriot2', 'granger',
    'insurgent', 'technical', 'halftrack', 'nightshark', 'menacer'
}

-- Ceny trackingu
Config.TrackerPrices = {
    ['Łatwy'] = 10.0,
    ['Średni'] = 25.0,
    ['Trudny'] = 50.0
}

-- Ceny rozbudowy organizacji
Config.UpgradePrices = {
    member_slot = 25.0,
    garage_upgrade = 100.0,
    stash_upgrade = 75.0
}

-- Lokalizacja
Config.Locale = {
    ['no_organization'] = 'Nie należysz do żadnej organizacji',
    ['no_permission'] = 'Nie masz uprawnień do wykonania tej czynności',
    ['transaction_success'] = 'Transakcja została wykonana pomyślnie',
    ['insufficient_funds'] = 'Niewystarczające środki',
    ['member_invited'] = 'Zaproszenie zostało wysłane',
    ['member_promoted'] = 'Członek został awansowany',
    ['member_fired'] = 'Członek został wyrzucony',
    ['crypto_bought'] = 'Kryptowaluta została zakupiona',
    ['crypto_sold'] = 'Kryptowaluta została sprzedana',
    ['note_saved'] = 'Notatka została zapisana',
    ['note_deleted'] = 'Notatka została usunięta',
    ['job_created'] = 'Zlecenie zostało utworzone',
    ['job_assigned'] = 'Zlecenie zostało przydzielone',
    ['job_completed'] = 'Zlecenie zostało ukończone',
    ['vehicle_tracked'] = 'Pojazd został dodany do trackingu',
    ['app_purchased'] = 'Aplikacja została zakupiona',
    ['slot_purchased'] = 'Slot dla członka został zakupiony',
    ['garage_upgraded'] = 'Garaż został rozbudowany',
    ['stash_upgraded'] = 'Szafka została rozbudowana'
}

-- Ustawienia NUI
Config.NUI = {
    ['tablet_width'] = 1024,
    ['tablet_height'] = 768,
    ['animation_speed'] = 300
}
