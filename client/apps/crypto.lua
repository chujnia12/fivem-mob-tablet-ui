
-- Aplikacja kryptowalut - client
RegisterNUICallback('crypto:getPortfolio', function(data, cb)
    TriggerServerEvent('org-tablet:server:crypto:getPortfolio')
    cb('ok')
end)

RegisterNUICallback('crypto:getPrices', function(data, cb)
    TriggerServerEvent('org-tablet:server:crypto:getPrices')
    cb('ok')
end)

RegisterNUICallback('crypto:buyCrypto', function(data, cb)
    TriggerServerEvent('org-tablet:server:crypto:buyCrypto', data.symbol, data.amount)
    cb('ok')
end)

RegisterNUICallback('crypto:sellCrypto', function(data, cb)
    TriggerServerEvent('org-tablet:server:crypto:sellCrypto', data.symbol, data.amount)
    cb('ok')
end)

RegisterNetEvent('org-tablet:client:crypto:receivePortfolio', function(portfolio)
    SendNUIMessage({
        action = 'updateCryptoPortfolio',
        portfolio = portfolio
    })
end)

RegisterNetEvent('org-tablet:client:crypto:receivePrices', function(prices)
    SendNUIMessage({
        action = 'updateCryptoPrices',
        prices = prices
    })
end)

RegisterNetEvent('org-tablet:client:crypto:success', function(message)
    ESX.ShowNotification(message, 'success')
end)

RegisterNetEvent('org-tablet:client:crypto:error', function(message)
    ESX.ShowNotification(message, 'error')
end)
