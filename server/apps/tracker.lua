
-- Tracker pojazdów - obsługa serwera
ESX = exports['es_extended']:getSharedObject()

-- Pobieranie dostępnych pojazdów
RegisterNetEvent('org-tablet:server:getTrackedVehicles', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'view_tracker') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    -- Pobierz wszystkie dostępne pojazdy
    local vehicles = MySQL.query.await('SELECT * FROM org_tracked_vehicles WHERE organization = "" OR organization = ? ORDER BY value DESC LIMIT 50', {org})
    
    -- Dodaj informacje o pojazdach z GTA
    for i, vehicle in pairs(vehicles) do
        local modelHash = GetHashKey(vehicle.model)
        local displayName = GetDisplayNameFromVehicleModel(modelHash)
        vehicles[i].display_name = displayName
        vehicles[i].class = GetVehicleClassFromName(modelHash)
    end
    
    TriggerClientEvent('org-tablet:client:receiveTrackedVehicles', source, vehicles)
end)

-- Trackowanie pojazdu
RegisterNetEvent('org-tablet:server:trackVehicle', function(vehicleId, phoneNumber)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'view_tracker') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    local vehicle = MySQL.single.await('SELECT * FROM org_tracked_vehicles WHERE id = ?', {vehicleId})
    if not vehicle then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Pojazd nie istnieje')
        return
    end
    
    local price = Config.TrackerPrices[vehicle.difficulty] or 25.0
    
    -- Sprawdź saldo krypto
    local orgData = GetOrganizationData(org)
    if orgData.crypto_balance < price then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Niewystarczające środki krypto')
        return
    end
    
    -- Pobierz aktualne współrzędne pojazdu
    local coords = json.decode(vehicle.coords)
    if not coords then
        coords = {
            x = math.random(-3000, 3000),
            y = math.random(-3000, 3000),
            z = math.random(1, 500)
        }
    end
    
    -- Dodaj losowe odchylenie dla realizmu
    coords.x = coords.x + math.random(-100, 100)
    coords.y = coords.y + math.random(-100, 100)
    
    -- Zaktualizuj saldo organizacji
    MySQL.update('UPDATE org_organizations SET crypto_balance = crypto_balance - ? WHERE name = ?', {price, org})
    
    -- Dodaj transakcję
    MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
        org, xPlayer.identifier, 'expense', 'Tracker', price, 'Tracking pojazdu: ' .. vehicle.model .. ' (' .. vehicle.plate .. ')'
    })
    
    -- Wyślij SMS z lokalizacją (jeśli podano numer)
    if phoneNumber and phoneNumber ~= '' then
        -- Tutaj można dodać integrację z systemem SMS
        -- exports['your-phone-system']:sendSMS(phoneNumber, 'TRACKER', 'Lokalizacja pojazdu ' .. vehicle.plate .. ': GPS ' .. coords.x .. ', ' .. coords.y)
    end
    
    -- Wyślij lokalizację do klienta
    TriggerClientEvent('org-tablet:client:receiveVehicleLocation', source, {
        vehicle = vehicle,
        coords = coords,
        cost = price,
        phone_sent = phoneNumber and phoneNumber ~= ''
    })
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Pojezd został namierzony! Koszt: $' .. price)
end)

-- Generowanie nowych pojazdów
RegisterNetEvent('org-tablet:server:generateNewVehicles', function()
    local source = source
    
    if not IsPlayerAceAllowed(source, 'command.admin') then
        return
    end
    
    for i = 1, 5 do
        local model = Config.VehicleModels[math.random(#Config.VehicleModels)]
        local plate = GenerateRandomPlate()
        local location = GetRandomLocation()
        local value = math.random(25000, 500000)
        local difficulty = GetDifficultyFromValue(value)
        local coords = GetRandomCoords()
        
        MySQL.insert('INSERT INTO org_tracked_vehicles (organization, model, plate, location, value, difficulty, coords, owner_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', {
            '', model, plate, location, value, difficulty, json.encode(coords), 'Unknown Owner'
        })
    end
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Wygenerowano 5 nowych pojazdów')
end)

-- Funkcje pomocnicze
function GenerateRandomPlate()
    local chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    local plate = ''
    for i = 1, 8 do
        local rand = math.random(#chars)
        plate = plate .. chars:sub(rand, rand)
    end
    return plate
end

function GetRandomLocation()
    local locations = {
        'Vinewood Hills', 'Downtown LS', 'Rockford Hills', 'Del Perro', 'Vespucci Beach',
        'Little Seoul', 'Mirror Park', 'Hawick', 'Burton', 'West Vinewood',
        'Pillbox Hill', 'La Mesa', 'Davis', 'Strawberry', 'Chamberlain Hills',
        'Sandy Shores', 'Paleto Bay', 'Grapeseed', 'Grand Senora Desert'
    }
    return locations[math.random(#locations)]
end

function GetDifficultyFromValue(value)
    if value < 75000 then
        return 'Łatwy'
    elseif value < 200000 then
        return 'Średni'
    else
        return 'Trudny'
    end
end

function GetRandomCoords()
    return {
        x = math.random(-3000, 3000),
        y = math.random(-3000, 3000),
        z = math.random(1, 500)
    }
end
