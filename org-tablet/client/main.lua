
ESX = exports['es_extended']:getSharedObject()

-- Komenda otwierania tabletu
RegisterCommand('tablet', function()
    ESX.TriggerServerCallback('org-tablet:checkMembership', function(isMember, orgData)
        if isMember then
            SetNuiFocus(true, true)
            SendNUIMessage({
                action = 'openTablet',
                orgData = orgData
            })
        else
            ESX.ShowNotification('Nie należysz do żadnej organizacji', 'error')
        end
    end)
end)

-- Zamykanie tabletu
RegisterNUICallback('closeTablet', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

-- Callback dla zakupu aplikacji
RegisterNUICallback('purchaseApp', function(data, cb)
    TriggerServerEvent('org-tablet:server:purchaseApp', data.appId)
    cb('ok')
end)

-- Callback dla zarządzania finansami
RegisterNUICallback('addTransaction', function(data, cb)
    TriggerServerEvent('org-tablet:server:addTransaction', data)
    cb('ok')
end)

-- Callback dla zarządzania członkami
RegisterNUICallback('inviteMember', function(data, cb)
    TriggerServerEvent('org-tablet:server:inviteMember', data.playerId)
    cb('ok')
end)

RegisterNUICallback('kickMember', function(data, cb)
    TriggerServerEvent('org-tablet:server:kickMember', data.memberId)
    cb('ok')
end)

RegisterNUICallback('promoteMember', function(data, cb)
    TriggerServerEvent('org-tablet:server:promoteMember', data.memberId)
    cb('ok')
end)

RegisterNUICallback('demoteMember', function(data, cb)
    TriggerServerEvent('org-tablet:server:demoteMember', data.memberId)
    cb('ok')
end)

-- Callback dla notatek
RegisterNUICallback('saveNote', function(data, cb)
    TriggerServerEvent('org-tablet:server:saveNote', data)
    cb('ok')
end)

RegisterNUICallback('deleteNote', function(data, cb)
    TriggerServerEvent('org-tablet:server:deleteNote', data.noteId)
    cb('ok')
end)

-- Callback dla zleceń
RegisterNUICallback('createJob', function(data, cb)
    TriggerServerEvent('org-tablet:server:createJob', data)
    cb('ok')
end)

RegisterNUICallback('takeJob', function(data, cb)
    TriggerServerEvent('org-tablet:server:takeJob', data.jobId)
    cb('ok')
end)

-- Callback dla rozbudowy organizacji
RegisterNUICallback('buyMemberSlot', function(data, cb)
    TriggerServerEvent('org-tablet:server:buyMemberSlot')
    cb('ok')
end)

RegisterNUICallback('upgradeGarage', function(data, cb)
    TriggerServerEvent('org-tablet:server:upgradeGarage')
    cb('ok')
end)

RegisterNUICallback('upgradeStash', function(data, cb)
    TriggerServerEvent('org-tablet:server:upgradeStash')
    cb('ok')
end)

-- Callback dla kryptowalut
RegisterNUICallback('buyCrypto', function(data, cb)
    TriggerServerEvent('org-tablet:server:buyCrypto', data)
    cb('ok')
end)

RegisterNUICallback('sellCrypto', function(data, cb)
    TriggerServerEvent('org-tablet:server:sellCrypto', data)
    cb('ok')
end)

-- Callback dla trackera
RegisterNUICallback('trackVehicle', function(data, cb)
    TriggerServerEvent('org-tablet:server:trackVehicle', data.vehicleId)
    cb('ok')
end)

-- Callback dla napadów
RegisterNUICallback('planHeist', function(data, cb)
    TriggerServerEvent('org-tablet:server:planHeist', data)
    cb('ok')
end)

print('^2[ORG-TABLET]^7 Klient systemu tabletu został załadowany')
