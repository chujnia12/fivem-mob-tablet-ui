
-- Aplikacja finansów - server
RegisterNetEvent('org-tablet:server:finance:deposit', function(amount)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_finances') then
        return
    end
    
    if xPlayer.getMoney() >= amount then
        xPlayer.removeMoney(amount)
        
        MySQL.update('UPDATE org_organizations SET balance = balance + ? WHERE name = ?', {amount, org})
        MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
            org, xPlayer.identifier, 'income', 'deposit', amount, 'Wpłata gotówki'
        })
        
        TriggerClientEvent('org-tablet:client:finance:success', source, 'Wpłacono $' .. amount)
        TriggerServerEvent('org-tablet:server:getOrgData')
    else
        TriggerClientEvent('org-tablet:client:finance:error', source, 'Niewystarczające środki')
    end
end)

RegisterNetEvent('org-tablet:server:finance:withdraw', function(amount)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_finances') then
        return
    end
    
    local orgBalance = MySQL.scalar.await('SELECT balance FROM org_organizations WHERE name = ?', {org})
    
    if orgBalance >= amount then
        xPlayer.addMoney(amount)
        
        MySQL.update('UPDATE org_organizations SET balance = balance - ? WHERE name = ?', {amount, org})
        MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
            org, xPlayer.identifier, 'expense', 'withdraw', amount, 'Wypłata gotówki'
        })
        
        TriggerClientEvent('org-tablet:client:finance:success', source, 'Wypłacono $' .. amount)
        TriggerServerEvent('org-tablet:server:getOrgData')
    else
        TriggerClientEvent('org-tablet:client:finance:error', source, 'Niewystarczające środki organizacji')
    end
end)

RegisterNetEvent('org-tablet:server:finance:getStats', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if org then
        local income = MySQL.scalar.await('SELECT SUM(amount) FROM org_transactions WHERE organization = ? AND type = "income" AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)', {org}) or 0
        local expenses = MySQL.scalar.await('SELECT SUM(amount) FROM org_transactions WHERE organization = ? AND type = "expense" AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)', {org}) or 0
        
        local stats = {
            income = income,
            expenses = expenses,
            profit = income - expenses,
            growth = math.random(5, 20) -- Symulacja wzrostu
        }
        
        TriggerClientEvent('org-tablet:client:finance:receiveStats', source, stats)
    end
end)
