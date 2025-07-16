
ESX = exports['es_extended']:getSharedObject()

-- Komenda otwierania tabletu
RegisterCommand('zavmdt', function()
    local playerData = ESX.GetPlayerData()
    
    -- Sprawdź czy gracz należy do organizacji
    ESX.TriggerServerCallback('org-system:checkMembership', function(isMember)
        if isMember then
            TriggerEvent('org-tablet:client:openTablet')
        else
            ESX.ShowNotification('Nie należysz do żadnej organizacji', 'error')
        end
    end)
end)

-- Obsługa punktów organizacji
CreateThread(function()
    while true do
        local sleep = 1000
        local playerPed = PlayerPedId()
        local playerCoords = GetEntityCoords(playerPed)
        
        for orgName, orgData in pairs(Config.Organizations) do
            -- Sprawdź czy gracz jest w pobliżu punktów organizacji
            local distanceToSpawn = #(playerCoords - orgData.spawn.xyz)
            local distanceToGarage = #(playerCoords - orgData.garage)
            local distanceToStash = #(playerCoords - orgData.stash)
            local distanceToBoss = #(playerCoords - orgData.boss_menu)
            
            if distanceToSpawn < 5.0 or distanceToGarage < 5.0 or distanceToStash < 5.0 or distanceToBoss < 5.0 then
                sleep = 5
                
                -- Sprawdź członkostwo
                ESX.TriggerServerCallback('org-system:checkOrgMembership', function(isOrgMember)
                    if isOrgMember then
                        if distanceToSpawn < 2.0 then
                            ESX.ShowHelpNotification('Naciśnij ~INPUT_CONTEXT~ aby się zespawnować')
                            if IsControlJustReleased(0, 38) then
                                DoScreenFadeOut(500)
                                Wait(500)
                                SetEntityCoords(playerPed, orgData.spawn.x, orgData.spawn.y, orgData.spawn.z)
                                SetEntityHeading(playerPed, orgData.spawn.w)
                                Wait(500)
                                DoScreenFadeIn(500)
                            end
                        elseif distanceToGarage < 2.0 then
                            ESX.ShowHelpNotification('Naciśnij ~INPUT_CONTEXT~ aby otworzyć garaż')
                            if IsControlJustReleased(0, 38) then
                                TriggerEvent('org-system:client:openGarage', orgName)
                            end
                        elseif distanceToStash < 2.0 then
                            ESX.ShowHelpNotification('Naciśnij ~INPUT_CONTEXT~ aby otworzyć schowek')
                            if IsControlJustReleased(0, 38) then
                                TriggerEvent('org-system:client:openStash', orgName)
                            end
                        elseif distanceToBoss < 2.0 then
                            ESX.ShowHelpNotification('Naciśnij ~INPUT_CONTEXT~ aby otworzyć menu szefa')
                            if IsControlJustReleased(0, 38) then
                                TriggerEvent('org-system:client:openBossMenu', orgName)
                            end
                        end
                    end
                end, orgName)
            end
        end
        
        Wait(sleep)
    end
end)

-- Obsługa gareży organizacji
RegisterNetEvent('org-system:client:openGarage', function(orgName)
    ESX.TriggerServerCallback('org-system:getOrgVehicles', function(vehicles)
        local elements = {}
        
        for _, vehicle in pairs(vehicles) do
            table.insert(elements, {
                label = vehicle.model .. ' - ' .. vehicle.plate,
                value = vehicle
            })
        end
        
        table.insert(elements, {label = '--- Wyparkuj nowy pojazd ---', value = 'spawn_new'})
        
        ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'org_garage', {
            title = 'Garaż organizacji',
            align = 'top-left',
            elements = elements
        }, function(data, menu)
            if data.current.value == 'spawn_new' then
                -- Menu wyboru pojazdu
                local vehicleElements = {}
                for _, model in pairs(Config.OrgVehicles) do
                    table.insert(vehicleElements, {
                        label = GetDisplayNameFromVehicleModel(model),
                        value = model
                    })
                end
                
                ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'select_vehicle', {
                    title = 'Wybierz pojazd',
                    align = 'top-left',
                    elements = vehicleElements
                }, function(data2, menu2)
                    TriggerServerEvent('org-system:spawnVehicle', data2.current.value, orgName)
                    menu2.close()
                    menu.close()
                end, function(data2, menu2)
                    menu2.close()
                end)
            else
                TriggerServerEvent('org-system:spawnStoredVehicle', data.current.value.id)
                menu.close()
            end
        end, function(data, menu)
            menu.close()
        end)
    end, orgName)
end)

-- Obsługa schowków
RegisterNetEvent('org-system:client:openStash', function(orgName)
    TriggerServerEvent('org-system:openStash', orgName)
end)

-- Menu szefa
RegisterNetEvent('org-system:client:openBossMenu', function(orgName)
    ESX.TriggerServerCallback('org-system:isBoss', function(isBoss)
        if not isBoss then
            ESX.ShowNotification('Nie masz uprawnień', 'error')
            return
        end
        
        local elements = {
            {label = 'Zarządzaj organizacją', value = 'manage'},
            {label = 'Wypłać wynagrodzenia', value = 'payroll'},
            {label = 'Otwórz tablet', value = 'tablet'}
        }
        
        ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'boss_menu', {
            title = 'Menu szefa - ' .. orgName,
            align = 'top-left',
            elements = elements
        }, function(data, menu)
            if data.current.value == 'manage' then
                -- Dodatkowe opcje zarządzania
            elseif data.current.value == 'payroll' then
                TriggerServerEvent('org-system:payroll', orgName)
            elseif data.current.value == 'tablet' then
                TriggerEvent('org-tablet:client:openTablet')
            end
            menu.close()
        end, function(data, menu)
            menu.close()
        end)
    end, orgName)
end)

print('^2[ORG-SYSTEM]^7 Klient systemu organizacji został załadowany')
