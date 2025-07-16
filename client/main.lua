
ESX = exports['es_extended']:getSharedObject()
local isTabletOpen = false
local orgData = nil
local pendingInvitations = {}

-- Komenda otwierania tabletu
RegisterCommand('tablet', function()
    TriggerServerEvent('org-tablet:server:getOrgData')
end)

-- Komenda dla admina do generowania danych testowych
RegisterCommand('generatevehicles', function()
    TriggerServerEvent('org-tablet:server:generateNewVehicles')
end)

-- Eventy podstawowe
RegisterNetEvent('org-tablet:client:receiveOrgData', function(data)
    orgData = data
    isTabletOpen = true
    
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'openTablet',
        orgData = orgData
    })
    
    -- Animacja tabletu
    RequestAnimDict('amb@world_human_seat_wall_tablet@female@base')
    while not HasAnimDictLoaded('amb@world_human_seat_wall_tablet@female@base') do
        Wait(100)
    end
    
    TaskPlayAnim(PlayerPedId(), 'amb@world_human_seat_wall_tablet@female@base', 'base', 8.0, -8.0, -1, 50, 0, false, false, false)
end)

RegisterNetEvent('org-tablet:client:noOrganization', function()
    ESX.ShowNotification('Nie należysz do żadnej organizacji', 'error')
end)

-- System zaproszeń
RegisterNetEvent('org-tablet:client:receiveInvitation', function(invitation)
    table.insert(pendingInvitations, invitation)
    
    ESX.ShowNotification('Otrzymałeś zaproszenie do organizacji: ' .. invitation.organization)
    
    -- Dialog wyboru
    ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'org_invitation', {
        title = 'Zaproszenie do organizacji',
        align = 'top-left',
        elements = {
            {label = 'Organizacja: ' .. invitation.organization, value = nil},
            {label = 'Zapraszający: ' .. invitation.inviter_name, value = nil},
            {label = '---', value = nil},
            {label = 'Przyjmij zaproszenie', value = 'accept'},
            {label = 'Odrzuć zaproszenie', value = 'decline'}
        }
    }, function(data, menu)
        if data.current.value == 'accept' then
            TriggerServerEvent('org-tablet:server:respondToInvitation', invitation.id, 'accept')
        elseif data.current.value == 'decline' then
            TriggerServerEvent('org-tablet:server:respondToInvitation', invitation.id, 'decline')
        end
        
        if data.current.value then
            menu.close()
            for i, inv in pairs(pendingInvitations) do
                if inv.id == invitation.id then
                    table.remove(pendingInvitations, i)
                    break
                end
            end
        end
    end, function(data, menu)
        menu.close()
    end)
end)

-- Powiadomienia
RegisterNetEvent('org-tablet:client:showNotification', function(type, message)
    if type == 'success' then
        ESX.ShowNotification(message, 'success')
    elseif type == 'error' then
        ESX.ShowNotification(message, 'error')
    elseif type == 'warning' then
        ESX.ShowNotification(message, 'warning')
    else
        ESX.ShowNotification(message)
    end
end)

-- Odbieranie danych z NUI
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

RegisterNetEvent('org-tablet:client:receiveNotes', function(notes)
    SendNUIMessage({
        action = 'updateNotes',
        notes = notes
    })
end)

RegisterNetEvent('org-tablet:client:receiveJobs', function(jobs)
    SendNUIMessage({
        action = 'updateJobs',
        jobs = jobs
    })
end)

RegisterNetEvent('org-tablet:client:receiveTrackedVehicles', function(vehicles)
    SendNUIMessage({
        action = 'updateVehicles',
        vehicles = vehicles
    })
end)

RegisterNetEvent('org-tablet:client:receiveVehicleLocation', function(data)
    SendNUIMessage({
        action = 'showVehicleLocation',
        locationData = data
    })
end)

RegisterNetEvent('org-tablet:client:receiveAvailableApps', function(apps)
    SendNUIMessage({
        action = 'updateAvailableApps',
        apps = apps
    })
end)

RegisterNetEvent('org-tablet:client:appPurchased', function(appId)
    SendNUIMessage({
        action = 'appPurchased',
        appId = appId
    })
end)

-- NUI Callbacks
RegisterNUICallback('closeTablet', function(data, cb)
    isTabletOpen = false
    SetNuiFocus(false, false)
    ClearPedTasks(PlayerPedId())
    cb('ok')
end)

-- Zarządzanie członkami
RegisterNUICallback('getMembers', function(data, cb)
    TriggerServerEvent('org-tablet:server:getMembers')
    cb('ok')
end)

RegisterNUICallback('invitePlayer', function(data, cb)
    TriggerServerEvent('org-tablet:server:invitePlayer', data.playerId)
    cb('ok')
end)

RegisterNUICallback('promoteMember', function(data, cb)
    TriggerServerEvent('org-tablet:server:promoteMember', data.memberId, data.newGrade)
    cb('ok')
end)

RegisterNUICallback('fireMember', function(data, cb)
    TriggerServerEvent('org-tablet:server:fireMember', data.memberId)
    cb('ok')
end)

-- Finanse
RegisterNUICallback('getTransactions', function(data, cb)
    TriggerServerEvent('org-tablet:server:getTransactions')
    cb('ok')
end)

RegisterNUICallback('addTransaction', function(data, cb)
    TriggerServerEvent('org-tablet:server:addTransaction', data.type, data.category, data.amount, data.description)
    cb('ok')
end)

-- Notatki
RegisterNUICallback('getNotes', function(data, cb)
    TriggerServerEvent('org-tablet:server:notes:getNotes')
    cb('ok')
end)

RegisterNUICallback('saveNote', function(data, cb)
    TriggerServerEvent('org-tablet:server:notes:saveNote', data)
    cb('ok')
end)

RegisterNUICallback('deleteNote', function(data, cb)
    TriggerServerEvent('org-tablet:server:notes:deleteNote', data.noteId)
    cb('ok')
end)

-- Zlecenia
RegisterNUICallback('getJobs', function(data, cb)
    TriggerServerEvent('org-tablet:server:jobs:getJobs')
    cb('ok')
end)

RegisterNUICallback('createJob', function(data, cb)
    TriggerServerEvent('org-tablet:server:jobs:createJob', data)
    cb('ok')
end)

RegisterNUICallback('acceptJob', function(data, cb)
    TriggerServerEvent('org-tablet:server:jobs:acceptJob', data.jobId)
    cb('ok')
end)

RegisterNUICallback('completeJob', function(data, cb)
    TriggerServerEvent('org-tablet:server:jobs:completeJob', data.jobId)
    cb('ok')
end)

-- Tracker
RegisterNUICallback('getTrackedVehicles', function(data, cb)
    TriggerServerEvent('org-tablet:server:getTrackedVehicles')
    cb('ok')
end)

RegisterNUICallback('trackVehicle', function(data, cb)
    TriggerServerEvent('org-tablet:server:trackVehicle', data.vehicleId, data.phoneNumber)
    cb('ok')
end)

-- App Store
RegisterNUICallback('getAvailableApps', function(data, cb)
    TriggerServerEvent('org-tablet:server:getAvailableApps')
    cb('ok')
end)

RegisterNUICallback('purchaseApp', function(data, cb)
    TriggerServerEvent('org-tablet:server:purchaseApp', data.appId)
    cb('ok')
end)

-- Ustawienia
RegisterNUICallback('buyMemberSlot', function(data, cb)
    TriggerServerEvent('org-tablet:server:settings:buyMemberSlot')
    cb('ok')
end)

RegisterNUICallback('upgradeGarage', function(data, cb)
    TriggerServerEvent('org-tablet:server:settings:upgradeGarage')
    cb('ok')
end)

RegisterNUICallback('upgradeStash', function(data, cb)
    TriggerServerEvent('org-tablet:server:settings:upgradeStash')
    cb('ok')
end)

-- Obsługa ESC
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

print('^2[ORG-TABLET]^7 Klient tabletu został załadowany')
