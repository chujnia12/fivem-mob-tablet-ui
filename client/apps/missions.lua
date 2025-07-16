
-- System misji - klient
local currentMission = nil
local missionBlips = {}
local missionVehicle = nil

-- Otrzymanie misji
RegisterNetEvent('org-tablet:client:missionAssigned', function(mission)
    ESX.ShowNotification('Nowa misja: ' .. mission.title .. ' - Nagroda: $' .. mission.reward)
end)

-- Rozpoczęcie misji w grze
RegisterNetEvent('org-tablet:client:startMissionInGame', function(mission)
    currentMission = mission
    
    if mission.job_type == 'delivery' then
        StartDeliveryMission(mission)
    elseif mission.job_type == 'heist' then
        StartHeistMission(mission)
    elseif mission.job_type == 'protection' then
        StartProtectionMission(mission)
    end
end)

-- Misja dostawy
function StartDeliveryMission(mission)
    local locations = {
        vector3(-1037.23, -2738.45, 20.16),
        vector3(1210.67, -1419.89, 35.22),
        vector3(726.34, -979.12, 24.88),
        vector3(-543.78, -216.45, 37.65)
    }
    
    local pickupLocation = locations[math.random(#locations)]
    local deliveryLocation = locations[math.random(#locations)]
    
    -- Stwórz blip pickup
    local pickupBlip = AddBlipForCoord(pickupLocation.x, pickupLocation.y, pickupLocation.z)
    SetBlipSprite(pickupBlip, 478)
    SetBlipColour(pickupBlip, 5)
    SetBlipRoute(pickupBlip, true)
    BeginTextCommandSetBlipName('STRING')
    AddTextComponentSubstringPlayerName('Pickup - ' .. mission.title)
    EndTextCommandSetBlipName(pickupBlip)
    
    table.insert(missionBlips, pickupBlip)
    
    -- Monitoring pickup
    CreateThread(function()
        while currentMission and currentMission.id == mission.id do
            local playerCoords = GetEntityCoords(PlayerPedId())
            local distance = #(playerCoords - pickupLocation)
            
            if distance < 3.0 then
                ESX.ShowHelpNotification('Naciśnij ~INPUT_CONTEXT~ aby odebrać ładunek')
                if IsControlJustReleased(0, 38) then
                    -- Usuń blip pickup
                    RemoveBlip(pickupBlip)
                    
                    -- Stwórz blip delivery
                    local deliveryBlip = AddBlipForCoord(deliveryLocation.x, deliveryLocation.y, deliveryLocation.z)
                    SetBlipSprite(deliveryBlip, 478)
                    SetBlipColour(deliveryBlip, 2)
                    SetBlipRoute(deliveryBlip, true)
                    BeginTextCommandSetBlipName('STRING')
                    AddTextComponentSubstringPlayerName('Dostawa - ' .. mission.title)
                    EndTextCommandSetBlipName(deliveryBlip)
                    
                    table.insert(missionBlips, deliveryBlip)
                    
                    ESX.ShowNotification('Ładunek odebrany! Dostarcz go do miejsca przeznaczenia')
                    
                    -- Monitoring delivery
                    CreateThread(function()
                        while currentMission and currentMission.id == mission.id do
                            local playerCoords2 = GetEntityCoords(PlayerPedId())
                            local distance2 = #(playerCoords2 - deliveryLocation)
                            
                            if distance2 < 3.0 then
                                ESX.ShowHelpNotification('Naciśnij ~INPUT_CONTEXT~ aby dostarczyć ładunek')
                                if IsControlJustReleased(0, 38) then
                                    CompleteMission(true)
                                    break
                                end
                            end
                            Wait(0)
                        end
                    end)
                    break
                end
            end
            Wait(0)
        end
    end)
end

-- Misja napadu
function StartHeistMission(mission)
    local heistLocations = {
        {coords = vector3(253.12, 225.67, 101.87), name = 'Pacific Bank'},
        {coords = vector3(-351.23, -49.78, 49.04), name = 'Fleeca Bank'},
        {coords = vector3(149.56, -1040.12, 29.37), name = 'Fleeca Bank'},
        {coords = vector3(-1212.45, -330.89, 37.78), name = 'Fleeca Bank'}
    }
    
    local heistLocation = heistLocations[math.random(#heistLocations)]
    
    -- Stwórz blip
    local heistBlip = AddBlipForCoord(heistLocation.coords.x, heistLocation.coords.y, heistLocation.coords.z)
    SetBlipSprite(heistBlip, 161)
    SetBlipColour(heistBlip, 1)
    SetBlipRoute(heistBlip, true)
    BeginTextCommandSetBlipName('STRING')
    AddTextComponentSubstringPlayerName('Napad - ' .. heistLocation.name)
    EndTextCommandSetBlipName(heistBlip)
    
    table.insert(missionBlips, heistBlip)
    
    CreateThread(function()
        while currentMission and currentMission.id == mission.id do
            local playerCoords = GetEntityCoords(PlayerPedId())
            local distance = #(playerCoords - heistLocation.coords)
            
            if distance < 5.0 then
                ESX.ShowHelpNotification('Naciśnij ~INPUT_CONTEXT~ aby rozpocząć napad')
                if IsControlJustReleased(0, 38) then
                    -- Rozpocznij napad
                    ESX.ShowNotification('Napad rozpoczęty! Wykonaj zadanie i uciekaj!')
                    
                    -- Symuluj alarm
                    PlaySoundFrontend(-1, "CHECKPOINT_PERFECT", "HUD_MINI_GAME_SOUNDSET", 1)
                    
                    -- Dodaj wanted level
                    SetPlayerWantedLevel(PlayerId(), 3, false)
                    SetPlayerWantedLevelNow(PlayerId(), false)
                    
                    -- Timer na napad (2 minuty)
                    SetTimeout(120000, function()
                        if currentMission and currentMission.id == mission.id then
                            CompleteMission(true)
                        end
                    end)
                    break
                end
            end
            Wait(0)
        end
    end)
end

-- Misja ochrony
function StartProtectionMission(mission)
    local protectionLocations = {
        {coords = vector3(-623.45, -230.12, 38.05), name = 'Sklep'},
        {coords = vector3(1165.23, -323.78, 69.20), name = 'Klub'},
        {coords = vector3(-706.89, -914.56, 19.21), name = 'Warsztat'},
        {coords = vector3(372.67, 326.45, 103.56), name = 'Biuro'}
    }
    
    local protectionLocation = protectionLocations[math.random(#protectionLocations)]
    
    -- Stwórz blip
    local protectionBlip = AddBlipForCoord(protectionLocation.coords.x, protectionLocation.coords.y, protectionLocation.coords.z)
    SetBlipSprite(protectionBlip, 162)
    SetBlipColour(protectionBlip, 3)
    SetBlipRoute(protectionBlip, true)
    BeginTextCommandSetBlipName('STRING')
    AddTextComponentSubstringPlayerName('Ochrona - ' .. protectionLocation.name)
    EndTextCommandSetBlipName(protectionBlip)
    
    table.insert(missionBlips, protectionBlip)
    
    CreateThread(function()
        local startTime = GetGameTimer()
        local duration = 300000 -- 5 minut
        
        while currentMission and currentMission.id == mission.id do
            local playerCoords = GetEntityCoords(PlayerPedId())
            local distance = #(playerCoords - protectionLocation.coords)
            
            if distance < 10.0 then
                local remaining = math.ceil((duration - (GetGameTimer() - startTime)) / 1000)
                if remaining > 0 then
                    ESX.ShowHelpNotification('Pozostało: ' .. remaining .. 's - Chroń lokalizację')
                else
                    CompleteMission(true)
                    break
                end
            else
                ESX.ShowHelpNotification('Wróć do chronionej lokalizacji!')
            end
            
            Wait(1000)
        end
    end)
end

-- Ukończenie misji
function CompleteMission(success)
    if currentMission then
        TriggerServerEvent('org-tablet:server:completeMission', currentMission.id, success)
        
        -- Wyczyść blips
        for _, blip in pairs(missionBlips) do
            RemoveBlip(blip)
        end
        missionBlips = {}
        
        -- Wyczyść pojazd misji
        if missionVehicle and DoesEntityExist(missionVehicle) then
            DeleteEntity(missionVehicle)
            missionVehicle = nil
        end
        
        currentMission = nil
        
        -- Usuń wanted level
        SetPlayerWantedLevel(PlayerId(), 0, false)
        SetPlayerWantedLevelNow(PlayerId(), false)
    end
end

-- Anulowanie misji przy rozłączeniu
AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        if currentMission then
            TriggerServerEvent('org-tablet:server:completeMission', currentMission.id, false)
        end
        
        for _, blip in pairs(missionBlips) do
            RemoveBlip(blip)
        end
        
        if missionVehicle and DoesEntityExist(missionVehicle) then
            DeleteEntity(missionVehicle)
        end
    end
end)
