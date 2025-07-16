
ESX = exports['es_extended']:getSharedObject()
local isTabletOpen = false
local orgData = nil
local pendingInvitations = {}

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

-- System zaproszeń
RegisterNetEvent('org-tablet:client:receiveInvitation', function(invitation)
    table.insert(pendingInvitations, invitation)
    
    -- Pokaż powiadomienie
    ESX.ShowNotification('Otrzymałeś zaproszenie do organizacji: ' .. invitation.organization .. ' od ' .. invitation.inviter_name)
    
    -- Pokaż dialog wyboru
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
            -- Usuń zaproszenie z listy
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

-- Zarządzanie członkami
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

-- Komenda do sprawdzania zaproszeń
RegisterCommand('invitations', function()
    if #pendingInvitations > 0 then
        ESX.ShowNotification('Masz ' .. #pendingInvitations .. ' oczekujących zaproszeń do organizacji')
        for _, invitation in pairs(pendingInvitations) do
            ESX.ShowNotification('Organizacja: ' .. invitation.organization .. ' od ' .. invitation.inviter_name)
        end
    else
        ESX.ShowNotification('Nie masz oczekujących zaproszeń')
    end
end)

print('^2[ORG-TABLET]^7 Skrypt główny klienta został załadowany')
