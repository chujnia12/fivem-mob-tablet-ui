
-- Tracker pojazdów - klient
local trackedVehicles = {}
local vehicleBlips = {}

-- Pobieranie pojazdów
RegisterNetEvent('org-tablet:client:receiveTrackedVehicles', function(vehicles)
    trackedVehicles = vehicles
    
    SendNUIMessage({
        action = 'updateTrackedVehicles',
        vehicles = vehicles
    })
end)

-- Otrzymanie lokalizacji pojazdu
RegisterNetEvent('org-tablet:client:receiveVehicleLocation', function(data)
    local coords = data.coords
    local vehicle = data.vehicle
    
    -- Utwórz blip na mapie
    local blip = AddBlipForCoord(coords.x, coords.y, coords.z)
    SetBlipSprite(blip, 225) -- Ikona samochodu
    SetBlipColour(blip, 5) -- Żółty kolor
    SetBlipScale(blip, 0.8)
    SetBlipAsShortRange(blip, true)
    BeginTextCommandSetBlipName('STRING')
    AddTextComponentSubstringPlayerName('Tracked: ' .. vehicle.model .. ' (' .. vehicle.plate .. ')')
    EndTextCommandSetBlipName(blip)
    
    -- Dodaj do listy blipów
    table.insert(vehicleBlips, {
        blip = blip,
        vehicle = vehicle,
        coords = coords,
        created = GetGameTimer()
    })
    
    -- Usuń blip po 10 minutach
    SetTimeout(600000, function()
        RemoveBlip(blip)
        for i, blipData in pairs(vehicleBlips) do
            if blipData.blip == blip then
                table.remove(vehicleBlips, i)
                break
            end
        end
    end)
    
    -- Wyślij do NUI
    SendNUIMessage({
        action = 'vehicleTracked',
        data = data
    })
end)

-- Callback z NUI
RegisterNUICallback('getTrackedVehicles', function(data, cb)
    TriggerServerEvent('org-tablet:server:getTrackedVehicles')
    cb('ok')
end)

RegisterNUICallback('trackVehicle', function(data, cb)
    TriggerServerEvent('org-tablet:server:trackVehicle', data.vehicleId, data.phoneNumber)
    cb('ok')
end)

RegisterNUICallback('setWaypoint', function(data, cb)
    if data.coords then
        SetNewWaypoint(data.coords.x, data.coords.y)
        ESX.ShowNotification('Waypoint został ustawiony na mapie')
    end
    cb('ok')
end)

-- Komenda admin do generowania pojazdów
RegisterCommand('generatevehicles', function()
    TriggerServerEvent('org-tablet:server:generateNewVehicles')
end)

-- Czyszczenie blipów przy wylogowaniu
AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        for _, blipData in pairs(vehicleBlips) do
            RemoveBlip(blipData.blip)
        end
        vehicleBlips = {}
    end
end)
