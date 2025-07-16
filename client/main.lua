
ESX = exports['es_extended']:getSharedObject()
local isTabletOpen = false
local orgData = nil

-- Otwieranie tabletu
RegisterNetEvent('org-tablet:client:openTablet', function()
    if not isTabletOpen then
        TriggerServerEvent('org-tablet:server:getOrgData')
    end
end)

RegisterNetEvent('org-tablet:client:receiveOrgData', function(data)
    orgData = data
    isTabletOpen = true
    
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'openTablet',
        orgData = orgData
    })
    
    -- Animacja wyciągania tabletu
    RequestAnimDict('amb@world_human_seat_wall_tablet@female@base')
    while not HasAnimDictLoaded('amb@world_human_seat_wall_tablet@female@base') do
        Wait(100)
    end
    
    TaskPlayAnim(PlayerPedId(), 'amb@world_human_seat_wall_tablet@female@base', 'base', 8.0, -8.0, -1, 50, 0, false, false, false)
end)

RegisterNetEvent('org-tablet:client:noOrganization', function()
    ESX.ShowNotification(Config.Locale['no_organization'])
end)

-- Odbieranie danych aplikacji
RegisterNetEvent('org-tablet:client:receiveMembers', function(members)
    SendNUIMessage({
        action = 'updateMembers',
        members = members
    })
end)

RegisterNetEvent('org-tablet:client:receiveTransactions', function(transactions)
    SendNUIMessage({
        action = 'updateTransactions',
        transactions = transactions
    })
end)

RegisterNetEvent('org-tablet:client:transactionSuccess', function()
    ESX.ShowNotification(Config.Locale['transaction_success'])
    TriggerServerEvent('org-tablet:server:getOrgData')
end)

-- Callback z NUI
RegisterNUICallback('closeTablet', function(data, cb)
    isTabletOpen = false
    SetNuiFocus(false, false)
    ClearPedTasks(PlayerPedId())
    cb('ok')
end)

RegisterNUICallback('getMembers', function(data, cb)
    TriggerServerEvent('org-tablet:server:getMembers')
    cb('ok')
end)

RegisterNUICallback('getTransactions', function(data, cb)
    TriggerServerEvent('org-tablet:server:getTransactions')
    cb('ok')
end)

RegisterNUICallback('addTransaction', function(data, cb)
    TriggerServerEvent('org-tablet:server:addTransaction', data.type, data.category, data.amount, data.description)
    cb('ok')
end)

-- Escape key handler
CreateThread(function()
    while true do
        Wait(0)
        if isTabletOpen then
            DisableControlAction(0, 322, true) -- ESC
            if IsDisabledControlJustPressed(0, 322) then
                SendNUIMessage({action = 'closeTablet'})
                isTabletOpen = false
                SetNuiFocus(false, false)
                ClearPedTasks(PlayerPedId())
            end
        else
            Wait(500)
        end
    end
end)

print('^2[ORG-TABLET]^7 Skrypt główny klienta został załadowany')
