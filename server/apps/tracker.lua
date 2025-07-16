
-- Aplikacja trackera pojazdów - server
local trackedVehicles = {}

-- Generowanie losowych pojazdów do śledzenia
CreateThread(function()
    while true do
        Wait(Config.VehicleTracker.refresh_interval)
        
        -- Wyczyść stare pojazdy
        trackedVehicles = {}
        
        -- Wygeneruj nowe pojazdy
        local vehicleModels = {'adder', 'zentorno', 'turismor', 'osiris', 'entityxf', 'sultan', 'kuruma', 'massacro', 'jester'}
        local locations = {
            'Centrum handlowe', 'Dzielnica biznesowa', 'Parking przy restauracji',
            'Hotel luksusowy', 'Vinewood Hills', 'Downtown', 'Airport'
        }
        
        for i = 1, 6 do
            local model = vehicleModels[math.random(#vehicleModels)]
            local location = locations[math.random(#locations)]
            local vehicleType = GetVehicleType(model)
            local config = Config.VehicleTracker.vehicle_types[vehicleType] or Config.VehicleTracker.vehicle_types['sedans']
            
            local vehicle = {
                id = i,
                model = model,
                location = location,
                area = location .. ' - Sektor ' .. math.random(1, 5),
                value = math.random(config.value_min, config.value_max),
                difficulty = config.difficulty,
                timeLeft = math.random(15, 90), -- minuty
                coords = {
                    x = math.random(-3000, 3000),
                    y = math.random(-3000, 3000),
                    z = math.random(0, 100)
                }
            }
            
            table.insert(trackedVehicles, vehicle)
        end
        
        -- Wyślij aktualizację do wszystkich klientów
        TriggerClientEvent('org-tablet:client:tracker:updateVehicles', -1, trackedVehicles)
    end
end)

function GetVehicleType(model)
    local sportsCars = {'adder', 'zentorno', 'turismor', 'osiris', 'entityxf'}
    local sedans = {'sultan', 'kuruma', 'primo', 'fugitive'}
    local suvs = {'huntley', 'cavalcade', 'granger', 'radius'}
    
    for _, car in ipairs(sportsCars) do
        if car == model then return 'sports' end
    end
    
    for _, car in ipairs(sedans) do
        if car == model then return 'sedans' end
    end
    
    for _, car in ipairs(suvs) do
        if car == model then return 'suvs' end
    end
    
    return 'sedans'
end

RegisterNetEvent('org-tablet:server:tracker:getVehicles', function()
    local source = source
    TriggerClientEvent('org-tablet:client:tracker:receiveVehicles', source, trackedVehicles)
end)

RegisterNetEvent('org-tablet:server:tracker:trackVehicle', function(vehicleId)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org then return end
    
    local orgData = MySQL.single.await('SELECT crypto_balance FROM org_organizations WHERE name = ?', {org})
    
    if orgData.crypto_balance >= Config.VehicleTracker.cost_per_track then
        -- Znajdź pojazd
        local vehicle = nil
        for _, v in ipairs(trackedVehicles) do
            if v.id == vehicleId then
                vehicle = v
                break
            end
        end
        
        if vehicle then
            -- Odejmij koszt
            MySQL.update('UPDATE org_organizations SET crypto_balance = crypto_balance - ? WHERE name = ?', {
                Config.VehicleTracker.cost_per_track, org
            })
            
            -- Zapisz śledzony pojazd
            MySQL.insert('INSERT INTO org_tracked_vehicles (organization, model, plate, location, value, difficulty, coords) VALUES (?, ?, ?, ?, ?, ?, ?)', {
                org, vehicle.model, 'TRACK' .. math.random(100, 999), vehicle.location, vehicle.value, vehicle.difficulty, json.encode(vehicle.coords)
            })
            
            -- Wyślij SMS na telefon gracza
            local phoneNumber = xPlayer.get('phoneNumber')
            if phoneNumber then
                -- Integracja z systemem SMS (wymagana odpowiednia integracja)
                TriggerEvent('esx_phone:sendMessage', phoneNumber, 'TRACKER', 'Pojazd ' .. vehicle.model .. ' namierzony w obszarze: ' .. vehicle.area)
            end
            
            TriggerClientEvent('org-tablet:client:tracker:success', source, vehicle)
            TriggerServerEvent('org-tablet:server:getOrgData')
        end
    else
        TriggerClientEvent('org-tablet:client:tracker:error', source, 'Niewystarczające środki')
    end
end)
