
-- Rozszerzona obsługa szafek i garażu z dynamiczną pojemnością
ESX = exports['es_extended']:getSharedObject()

-- Otwieranie szafki z dynamiczną pojemnością
RegisterNetEvent('org-system:server:openStash', function(orgName)
    local source = source
    local playerOrg = GetPlayerOrganization(source)
    
    if playerOrg ~= orgName then
        TriggerClientEvent('esx:showNotification', source, 'Nie należysz do tej organizacji')
        return
    end
    
    if not HasPermission(source, 'stash_access') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień do schowka')
        return
    end
    
    -- Pobierz dane organizacji z dynamiczną pojemnością
    local orgData = GetOrganizationData(orgName)
    local stashSize = orgData.stash_slots or 500 -- domyślnie 500kg
    local stashWeight = math.floor(stashSize * 1000) -- konwersja na gramy dla ox_inventory
    
    -- Rejestruj schowek z odpowiednią pojemnością
    exports.ox_inventory:RegisterStash('org_stash_' .. orgName, 'Schowek ' .. orgName, 50, stashWeight)
    TriggerClientEvent('ox_inventory:openInventory', source, 'stash', 'org_stash_' .. orgName)
    
    -- Log dla debugowania
    print('^3[ORG-STASH]^7 Otwarty schowek dla ' .. orgName .. ' o pojemności: ' .. stashSize .. 'kg')
end)

-- Pobieranie pojazdów organizacji z limitem garażu
ESX.RegisterServerCallback('org-system:getOrgVehicles', function(source, cb, orgName)
    local playerOrg = GetPlayerOrganization(source)
    
    if playerOrg ~= orgName then
        cb({})
        return
    end
    
    if not HasPermission(source, 'garage_access') then
        cb({})
        return
    end
    
    local vehicles = MySQL.query.await('SELECT * FROM org_vehicles WHERE organization = ?', {orgName})
    local orgData = GetOrganizationData(orgName)
    local garageLimit = orgData.garage_slots or 10
    
    -- Dodaj informacje o limicie do odpowiedzi
    cb({
        vehicles = vehicles,
        limit = garageLimit,
        current = #vehicles
    })
    
    print('^3[ORG-GARAGE]^7 Pobrano pojazdy dla ' .. orgName .. ' (' .. #vehicles .. '/' .. garageLimit .. ')')
end)

-- Spawn pojazdu z sprawdzaniem limitu garażu
RegisterNetEvent('org-system:server:spawnVehicle', function(model, orgName)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local playerOrg = GetPlayerOrganization(source)
    
    if playerOrg ~= orgName then
        TriggerClientEvent('esx:showNotification', source, 'Nie należysz do tej organizacji')
        return
    end
    
    if not HasPermission(source, 'garage_access') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień do garażu')
        return
    end
    
    -- Sprawdź limit pojazdów z bazy danych
    local vehicleCount = MySQL.scalar.await('SELECT COUNT(*) FROM org_vehicles WHERE organization = ?', {orgName})
    local orgData = GetOrganizationData(orgName)
    local garageLimit = orgData.garage_slots or 10
    
    if vehicleCount >= garageLimit then
        TriggerClientEvent('esx:showNotification', source, 'Garaż jest pełny (' .. vehicleCount .. '/' .. garageLimit .. ')')
        return
    end
    
    -- Wygeneruj tablicę
    local plate = 'ORG' .. string.upper(string.sub(orgName, 1, 3)) .. math.random(10, 99)
    
    -- Dodaj pojazd do bazy
    MySQL.insert('INSERT INTO org_vehicles (organization, model, plate) VALUES (?, ?, ?)', {
        orgName, model, plate
    })
    
    -- Spawn pojazdu
    local coords = Config.Organizations[orgName].garage
    TriggerClientEvent('org-system:client:spawnVehicle', source, model, plate, coords)
    
    -- Powiadomienie z aktualną liczbą pojazdów
    TriggerClientEvent('esx:showNotification', source, 'Pojazd wyparkowany (' .. (vehicleCount + 1) .. '/' .. garageLimit .. ')')
    
    print('^3[ORG-GARAGE]^7 Spawn pojazdu ' .. model .. ' dla ' .. orgName .. ' (' .. (vehicleCount + 1) .. '/' .. garageLimit .. ')')
end)

-- Export funkcji do sprawdzania limitów
exports('GetOrgStashCapacity', function(orgName)
    local orgData = GetOrganizationData(orgName)
    return orgData.stash_slots or 500
end)

exports('GetOrgGarageCapacity', function(orgName)
    local orgData = GetOrganizationData(orgName)
    return orgData.garage_slots or 10
end)

exports('GetOrgGarageUsage', function(orgName)
    local vehicleCount = MySQL.scalar.await('SELECT COUNT(*) FROM org_vehicles WHERE organization = ?', {orgName})
    return vehicleCount or 0
end)

print('^2[ORG-STASH-GARAGE]^7 System schowków i garażu z dynamiczną pojemnością został załadowany')
