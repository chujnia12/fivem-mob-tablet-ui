
Config = {}

-- Organizacje
Config.Organizations = {
    ['ballas'] = {
        name = 'Ballas',
        label = 'Ballas Gang',
        color = '#800080',
        spawn = vector4(84.17, -1959.48, 21.12, 318.89),
        garage = vector3(72.58, -1962.18, 21.12),
        stash = vector3(105.34, -1985.32, 21.12),
        boss_menu = vector3(110.73, -1988.57, 21.12)
    },
    ['families'] = {
        name = 'Families',
        label = 'Grove Street Families',
        color = '#00FF00',
        spawn = vector4(-175.22, -1618.25, 33.65, 231.78),
        garage = vector3(-188.23, -1607.45, 33.67),
        stash = vector3(-173.89, -1638.92, 33.49),
        boss_menu = vector3(-170.12, -1642.33, 33.49)
    },
    ['vagos'] = {
        name = 'Vagos',
        label = 'Los Santos Vagos',
        color = '#FFFF00',
        spawn = vector4(331.23, -2012.34, 22.35, 140.45),
        garage = vector3(323.45, -2027.67, 22.35),
        stash = vector3(346.78, -2011.23, 22.35),
        boss_menu = vector3(348.12, -2008.89, 22.35)
    },
    ['marabunta'] = {
        name = 'Marabunta',
        label = 'Marabunta Grande',
        color = '#0080FF',
        spawn = vector4(1398.35, -1490.67, 59.65, 201.23),
        garage = vector3(1407.23, -1496.78, 59.65),
        stash = vector3(1391.45, -1506.89, 59.65),
        boss_menu = vector3(1389.67, -1510.23, 59.65)
    }
}

-- Stopnie organizacji
Config.Grades = {
    [0] = {label = 'Rekrut', salary = 0, permissions = {}},
    [1] = {label = 'Członek', salary = 1000, permissions = {'stash_access'}},
    [2] = {label = 'Starszy Członek', salary = 2000, permissions = {'stash_access', 'garage_access'}},
    [3] = {label = 'Porucznik', salary = 3000, permissions = {'stash_access', 'garage_access', 'manage_notes'}},
    [4] = {label = 'Zastępca', salary = 5000, permissions = {'stash_access', 'garage_access', 'manage_notes', 'manage_finances'}},
    [5] = {label = 'Szef', salary = 8000, permissions = {'stash_access', 'garage_access', 'manage_notes', 'manage_finances', 'manage_members', 'manage_crypto'}}
}

-- Pojazdy organizacji
Config.OrgVehicles = {
    'sultan', 'kuruma', 'schafter2', 'buffalo', 'washington',
    'sandking', 'mesa', 'dubsta3', 'patriot2', 'granger'
}

-- Misje organizacji
Config.Missions = {
    ['delivery'] = {
        name = 'Dostawa',
        min_grade = 1,
        reward = {min = 2500, max = 5000},
        locations = {
            vector3(-1037.23, -2738.45, 20.16),
            vector3(1210.67, -1419.89, 35.22),
            vector3(726.34, -979.12, 24.88),
            vector3(-543.78, -216.45, 37.65)
        }
    },
    ['heist'] = {
        name = 'Napad',
        min_grade = 3,
        reward = {min = 15000, max = 35000},
        locations = {
            vector3(253.12, 225.67, 101.87), -- Pacific Bank
            vector3(-351.23, -49.78, 49.04), -- Fleeca Bank
            vector3(149.56, -1040.12, 29.37), -- Fleeca Bank
            vector3(-1212.45, -330.89, 37.78) -- Fleeca Bank
        }
    },
    ['protection'] = {
        name = 'Ochrona',
        min_grade = 2,
        reward = {min = 3500, max = 7500},
        locations = {
            vector3(-623.45, -230.12, 38.05),
            vector3(1165.23, -323.78, 69.20),
            vector3(-706.89, -914.56, 19.21),
            vector3(372.67, 326.45, 103.56)
        }
    }
}

-- Lokalizacje sklepów z bronią
Config.WeaponShops = {
    vector3(22.56, -1107.28, 29.79),
    vector3(810.25, -2157.67, 29.61),
    vector3(1693.44, 3759.50, 34.70),
    vector3(-330.24, 6083.88, 31.45)
}
