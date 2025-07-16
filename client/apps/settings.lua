
-- Aplikacja ustawień - client
RegisterNUICallback('settings:getOrgSettings', function(data, cb)
    TriggerServerEvent('org-tablet:server:settings:getOrgSettings')
    cb('ok')
end)

RegisterNUICallback('settings:buyMemberSlot', function(data, cb)
    TriggerServerEvent('org-tablet:server:settings:buyMemberSlot')
    cb('ok')
end)

RegisterNUICallback('settings:upgradeGarage', function(data, cb)
    TriggerServerEvent('org-tablet:server:settings:upgradeGarage')
    cb('ok')
end)

RegisterNUICallback('settings:upgradeStash', function(data, cb)
    TriggerServerEvent('org-tablet:server:settings:upgradeStash')
    cb('ok')
end)

RegisterNUICallback('settings:setIndividualPermissions', function(data, cb)
    TriggerServerEvent('org-tablet:server:settings:setIndividualPermissions', data.memberId, data.permissions)
    cb('ok')
end)

RegisterNetEvent('org-tablet:client:settings:receiveOrgSettings', function(settings)
    SendNUIMessage({
        action = 'updateOrgSettings',
        settings = settings
    })
end)
