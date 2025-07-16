
Config = {}

-- Główna konfiguracja
Config.Framework = 'esx' -- esx lub qbcore
Config.UseOxInventory = true
Config.UsableItem = 'org_tablet'

-- Konfiguracja organizacji
Config.Organizations = {
    ['ballas'] = {
        name = 'Ballas',
        label = 'Grove Street Families',
        grade_names = {
            [0] = 'Rekrut',
            [1] = 'Członek',
            [2] = 'Starszy Członek',
            [3] = 'Zastępca',
            [4] = 'Przywódca',
            [5] = 'Boss'
        },
        max_members = 50,
        territory = {x = -2040.0, y = -90.0, z = 30.0},
        apps = {
            'finance', 'members', 'transactions', 'orders', 
            'settings', 'stats', 'notes', 'apps'
        }
    },
    ['vagos'] = {
        name = 'Vagos',
        label = 'Los Santos Vagos',
        grade_names = {
            [0] = 'Soldado',
            [1] = 'Miembro',
            [2] = 'Veterano',
            [3] = 'Teniente',
            [4] = 'Jefe',
            [5] = 'Líder'
        },
        max_members = 45,
        territory = {x = 331.0, y = -2040.0, z = 20.0},
        apps = {
            'finance', 'members', 'transactions', 'orders', 
            'settings', 'stats', 'notes', 'apps'
        }
    }
}

-- Konfiguracja aplikacji sklepu
Config.AppStore = {
    ['zlecenia'] = {
        name = 'Zlecenia',
        description = 'System zarządzania zleceniami organizacji',
        price = 2.5,
        category = 'Biznes',
        icon = 'briefcase'
    },
    ['kryptowaluty'] = {
        name = 'Kryptowaluty',
        description = 'Handel kryptowalutami i portfel',
        price = 3.2,
        category = 'Finanse',
        icon = 'bitcoin'
    },
    ['napady'] = {
        name = 'Napady',
        description = 'Planowanie i zarządzanie napadami',
        price = 4.8,
        category = 'Akcja',
        icon = 'crosshair'
    },
    ['tracker'] = {
        name = 'Tracker Pojazdów',
        description = 'Śledzenie pojazdów do kradzieży',
        price = 6.5,
        category = 'Narzędzia',
        icon = 'map-pin'
    }
}

-- Konfiguracja kryptowalut
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
        volatility = 0.08
    },
    ['SANCOIN'] = {
        name = 'San Andreas Coin',
        icon = '🏔️',
        min_price = 400.0,
        max_price = 700.0,
        volatility = 0.12
    }
}

-- Konfiguracja trackera
Config.VehicleTracker = {
    cost_per_track = 2.5, -- Koszt w kryptowalutach
    refresh_interval = 300000, -- 5 minut w ms
    max_tracked_vehicles = 10,
    vehicle_types = {
        ['sports'] = {value_min = 80000, value_max = 150000, difficulty = 'Trudny'},
        ['super'] = {value_min = 150000, value_max = 300000, difficulty = 'Trudny'},
        ['sedans'] = {value_min = 30000, value_max = 80000, difficulty = 'Średni'},
        ['suvs'] = {value_min = 50000, value_max = 120000, difficulty = 'Średni'},
        ['compacts'] = {value_min = 15000, value_max = 40000, difficulty = 'Łatwy'}
    }
}

-- Konfiguracja finansów
Config.Finance = {
    daily_income = {
        territory_control = 5000,
        drug_sales = 3000,
        protection_money = 2000
    },
    transaction_types = {
        'income', 'expense', 'transfer', 'crypto_buy', 'crypto_sell'
    }
}

-- Lokalizacja
Config.Locale = {
    ['tablet_opened'] = 'Tablet organizacji został otwarty',
    ['tablet_closed'] = 'Tablet organizacji został zamknięty',
    ['no_organization'] = 'Nie należysz do żadnej organizacji',
    ['insufficient_rank'] = 'Niewystarczające uprawnienia',
    ['transaction_success'] = 'Transakcja wykonana pomyślnie',
    ['app_purchased'] = 'Aplikacja została zakupiona',
    ['vehicle_tracked'] = 'Pojazd został namierzony'
}
