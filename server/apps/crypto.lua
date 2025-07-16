
-- Aplikacja kryptowalut - server
RegisterNetEvent('org-tablet:server:crypto:getPortfolio', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if org then
        local portfolio = MySQL.query.await([[
            SELECT cp.*, cpr.price_usd, cpr.change_24h 
            FROM org_crypto_portfolio cp 
            LEFT JOIN org_crypto_prices cpr ON cp.crypto_symbol = cpr.crypto_symbol 
            WHERE cp.organization = ?
        ]], {org})
        
        TriggerClientEvent('org-tablet:client:crypto:receivePortfolio', source, portfolio)
    end
end)

RegisterNetEvent('org-tablet:server:crypto:getPrices', function()
    local source = source
    local prices = MySQL.query.await('SELECT * FROM org_crypto_prices')
    TriggerClientEvent('org-tablet:client:crypto:receivePrices', source, prices)
end)

RegisterNetEvent('org-tablet:server:crypto:buyCrypto', function(symbol, amount)
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_crypto') then
        return
    end
    
    local price = MySQL.scalar.await('SELECT price_usd FROM org_crypto_prices WHERE crypto_symbol = ?', {symbol})
    local totalCost = price * amount
    
    local orgBalance = MySQL.scalar.await('SELECT balance FROM org_organizations WHERE name = ?', {org})
    
    if orgBalance >= totalCost then
        -- Odejmij koszt z salda organizacji
        MySQL.update('UPDATE org_organizations SET balance = balance - ? WHERE name = ?', {totalCost, org})
        
        -- Dodaj kryptowalutę do portfela
        MySQL.query('INSERT INTO org_crypto_portfolio (organization, crypto_symbol, amount_owned, wallet_address) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE amount_owned = amount_owned + VALUES(amount_owned)', {
            org, symbol, amount, 'WALLET-' .. string.upper(symbol) .. '-' .. math.random(1000, 9999)
        })
        
        -- Zapisz transakcję
        MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
            org, ESX.GetPlayerFromId(source).identifier, 'crypto_buy', 'crypto', totalCost, 'Zakup ' .. amount .. ' ' .. symbol
        })
        
        TriggerClientEvent('org-tablet:client:crypto:success', source, 'Zakupiono ' .. amount .. ' ' .. symbol)
        TriggerServerEvent('org-tablet:server:crypto:getPortfolio')
    else
        TriggerClientEvent('org-tablet:client:crypto:error', source, 'Niewystarczające środki')
    end
end)

RegisterNetEvent('org-tablet:server:crypto:sellCrypto', function(symbol, amount)
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_crypto') then
        return
    end
    
    local owned = MySQL.scalar.await('SELECT amount_owned FROM org_crypto_portfolio WHERE organization = ? AND crypto_symbol = ?', {org, symbol}) or 0
    
    if owned >= amount then
        local price = MySQL.scalar.await('SELECT price_usd FROM org_crypto_prices WHERE crypto_symbol = ?', {symbol})
        local totalValue = price * amount
        
        -- Dodaj wartość do salda organizacji
        MySQL.update('UPDATE org_organizations SET balance = balance + ? WHERE name = ?', {totalValue, org})
        
        -- Usuń kryptowalutę z portfela
        MySQL.update('UPDATE org_crypto_portfolio SET amount_owned = amount_owned - ? WHERE organization = ? AND crypto_symbol = ?', {
            amount, org, symbol
        })
        
        -- Zapisz transakcję
        MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
            org, ESX.GetPlayerFromId(source).identifier, 'crypto_sell', 'crypto', totalValue, 'Sprzedaż ' .. amount .. ' ' .. symbol
        })
        
        TriggerClientEvent('org-tablet:client:crypto:success', source, 'Sprzedano ' .. amount .. ' ' .. symbol .. ' za $' .. totalValue)
        TriggerServerEvent('org-tablet:server:crypto:getPortfolio')
    else
        TriggerClientEvent('org-tablet:client:crypto:error', source, 'Niewystarczająca ilość kryptowaluty')
    end
end)
