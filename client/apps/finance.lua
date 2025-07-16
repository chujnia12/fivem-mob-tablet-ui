
-- Finanse - klient
local financeStats = {}
local organizations = {}

-- Otrzymywanie danych finansowych
RegisterNetEvent('org-tablet:client:receiveFinanceStats', function(stats)
    financeStats = stats
    
    SendNUIMessage({
        action = 'updateFinanceStats',
        stats = stats
    })
end)

RegisterNetEvent('org-tablet:client:receiveOrganizations', function(orgs)
    organizations = orgs
    
    SendNUIMessage({
        action = 'updateOrganizations',
        organizations = orgs
    })
end)

-- Callback z NUI
RegisterNUICallback('getFinanceStats', function(data, cb)
    TriggerServerEvent('org-tablet:server:getFinanceStats')
    cb('ok')
end)

RegisterNUICallback('getOrganizations', function(data, cb)
    TriggerServerEvent('org-tablet:server:getOrganizations')
    cb('ok')
end)

RegisterNUICallback('transferMoney', function(data, cb)
    TriggerServerEvent('org-tablet:server:transferMoney', data.targetOrg, data.amount, data.description)
    cb('ok')
end)
