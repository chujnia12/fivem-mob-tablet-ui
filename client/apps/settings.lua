
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

-- Obsługa upgradów organizacji
RegisterNUICallback('settings:purchaseUpgrade', function(data, cb)
    local upgradeType = data.upgradeType
    
    if upgradeType == 'member_slot' then
        TriggerServerEvent('org-tablet:server:settings:buyMemberSlot')
    elseif upgradeType == 'garage_upgrade' then
        TriggerServerEvent('org-tablet:server:settings:upgradeGarage')
    elseif upgradeType == 'stash_upgrade' then
        TriggerServerEvent('org-tablet:server:settings:upgradeStash')
    end
    
    cb('ok')
end)

RegisterNetEvent('org-tablet:client:settings:receiveOrgSettings', function(settings)
    SendNUIMessage({
        action = 'updateOrgSettings',
        settings = settings
    })
end)
