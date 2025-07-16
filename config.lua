
Config = {}

-- Podstawowe ustawienia
Config.Debug = true
Config.UseOxInventory = true -- Ustaw na false jeśli używasz innego systemu inventory
Config.UsableItem = 'org_tablet' -- Nazwa przedmiotu w bazie danych

-- Uprawnienia organizacji
Config.Permissions = {
    ['manage_finances'] = 'Zarządzanie finansami',
    ['manage_members'] = 'Zarządzanie członkami',
    ['manage_crypto'] = 'Zarządzanie kryptowalutami',
    ['view_tracker'] = 'Dostęp do trackera',
    ['manage_jobs'] = 'Zarządzanie zleceniami',
    ['manage_notes'] = 'Zarządzanie notatkami',
    ['purchase_apps'] = 'Zakup aplikacji'
}

-- Stopnie organizacji
Config.Grades = {
    [0] = {label = 'Rekrut', salary = 0, permissions = {}},
    [1] = {label = 'Członek', salary = 1000, permissions = {'view_tracker'}},
    [2] = {label = 'Starszy Członek', salary = 2000, permissions = {'view_tracker', 'manage_notes'}},
    [3] = {label = 'Starszy Członek', salary = 3000, permissions = {'view_tracker', 'manage_notes', 'manage_jobs'}},
    [4] = {label = 'Zastępca', salary = 5000, permissions = {'view_tracker', 'manage_notes', 'manage_jobs', 'manage_finances'}},
    [5] = {label = 'Zastępca', salary = 6000, permissions = {'view_tracker', 'manage_notes', 'manage_jobs', 'manage_finances', 'manage_members'}},
    [6] = {label = 'Zastępca', salary = 7000, permissions = {'view_tracker', 'manage_notes', 'manage_jobs', 'manage_finances', 'manage_members', 'manage_crypto'}},
    [7] = {label = 'Szef', salary = 10000, permissions = {'view_tracker', 'manage_notes', 'manage_jobs', 'manage_finances', 'manage_members', 'manage_crypto', 'purchase_apps'}}
}

-- Kryptowaluty
Config.Crypto = {
    ['LCOIN'] = {
        name = 'Liberty Coin',
        icon = '🏛️',
        min_price = 2500.0,
        max_price = 3500.0,
        volatility = 0.05 -- 5% zmienność
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
        'Inne'
    },
    expense = {
        'Broń',
        'Pojazdy',
        'Ubrania',
        'Wyposażenie',
        'Opłaty',
        'Inne'
    }
}

-- Pojazdy GTA 5 do trackingu
Config.VehicleModels = {
    -- Supersport
    'adder', 'banshee', 'bullet', 'cheetah', 'entityxf', 'infernus', 'monroe', 'vacca', 'voltic', 'zentorno',
    -- Sport
    'alpha', 'banshee2', 'bestiagts', 'blista2', 'blista3', 'buffalo', 'buffalo2', 'buffalo3', 'carbonizzare', 'comet2',
    -- Sedan
    'asea', 'asterope', 'cog55', 'cog552', 'cognoscenti', 'cognoscenti2', 'emperor', 'emperor2', 'emperor3', 'fugitive',
    -- SUV
    'baller', 'baller2', 'baller3', 'baller4', 'baller5', 'baller6', 'cavalcade', 'cavalcade2', 'contender', 'dubsta',
    -- Compacts
    'blista', 'brioso', 'dilettante', 'dilettante2', 'issi2', 'panto', 'prairie', 'rhapsody'
}

-- Lokalizacje
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
    ['app_purchased'] = 'Aplikacja została zakupiona'
}

-- Ceny trackingu
Config.TrackerPrices = {
    ['Łatwy'] = 10.0,
    ['Średni'] = 25.0,
    ['Trudny'] = 50.0
}

-- Ustawienia NUI
Config.NUI = {
    ['tablet_width'] = 1024,
    ['tablet_height'] = 768,
    ['animation_speed'] = 300
}
