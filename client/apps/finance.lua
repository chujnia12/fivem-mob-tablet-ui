
-- Aplikacja finansów - client
RegisterNUICallback('finance:deposit', function(data, cb)
    TriggerServerEvent('org-tablet:server:finance:deposit', data.amount)
    cb('ok')
end)

RegisterNUICallback('finance:withdraw', function(data, cb)
    TriggerServerEvent('org-tablet:server:finance:withdraw', data.amount)
    cb('ok')
end)

RegisterNUICallback('finance:getStats', function(data, cb)
    TriggerServerEvent('org-tablet:server:finance:getStats')
    cb('ok')
end)

RegisterNetEvent('org-tablet:client:finance:success', function(message)
    ESX.ShowNotification(message, 'success')
end)

RegisterNetEvent('org-tablet:client:finance:error', function(message)
    ESX.ShowNotification(message, 'error')
end)

RegisterNetEvent('org-tablet:client:finance:receiveStats', function(stats)
    SendNUIMessage({
        action = 'updateFinanceStats',
        stats = stats
    })
end)
