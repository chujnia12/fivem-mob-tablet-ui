
Config = {}

-- Ceny aplikacji w kryptowalutach
Config.AppPrices = {
    kryptowaluty = 50.0,
    tracker = 75.0,
    napady = 100.0,
    zlecenia = 25.0
}

-- Uprawnienia systemowe
Config.Permissions = {
    manage_finances = { min_grade = 4 },
    manage_members = { min_grade = 5 },
    manage_crypto = { min_grade = 4 },
    view_tracker = { min_grade = 2 },
    manage_jobs = { min_grade = 3 },
    manage_notes = { min_grade = 1 },
    purchase_apps = { min_grade = 5 },
    stash_access = { min_grade = 1 },
    garage_access = { min_grade = 1 }
}

-- Stopnie organizacji
Config.OrgGrades = {
    [0] = 'Rekrut',
    [1] = 'Członek', 
    [2] = 'Starszy Członek',
    [3] = 'Porucznik',
    [4] = 'Zastępca',
    [5] = 'Szef'
}

-- Kategorie transakcji
Config.TransactionCategories = {
    'Wynagrodzenia',
    'Zakupy',
    'Sprzedaż',
    'Napady',
    'Inwestycje',
    'Kary',
    'Inne'
}

-- Ceny rozbudowy organizacji
Config.UpgradePrices = {
    member_slot = 25.0,
    garage_slot = 50.0,
    stash_upgrade = 30.0
}
