
-- Finanse - rozszerzony skrypt serwera
ESX = exports['es_extended']:getSharedObject()

-- Pobieranie transakcji
RegisterNetEvent('org-tablet:server:getTransactions', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nie należysz do organizacji')
        return
    end
    
    local transactions = MySQL.query.await('SELECT * FROM org_transactions WHERE organization = ? ORDER BY created_at DESC LIMIT 100', {org})
    
    -- Dodaj nazwy graczy
    for i, transaction in pairs(transactions) do
        if transaction.identifier then
            local playerName = GetPlayerNameByIdentifier(transaction.identifier)
            transactions[i].player_name = playerName
        end
    end
    
    TriggerClientEvent('org-tablet:client:receiveTransactions', source, transactions)
end)

-- Dodawanie transakcji
RegisterNetEvent('org-tablet:server:addTransaction', function(transactionType, category, amount, description)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    amount = math.abs(tonumber(amount))
    if amount <= 0 then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nieprawidłowa kwota')
        return
    end
    
    local orgData = GetOrganizationData(org)
    
    -- Sprawdź czy organizacja ma wystarczające środki dla wydatków
    if transactionType == 'expense' and orgData.balance < amount then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Niewystarczające środki')
        return
    end
    
    -- Dodaj transakcję
    MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
        org, xPlayer.identifier, transactionType, category, amount, description or ''
    })
    
    -- Aktualizuj saldo organizacji
    if transactionType == 'income' then
        MySQL.update('UPDATE org_organizations SET balance = balance + ? WHERE name = ?', {amount, org})
    elseif transactionType == 'expense' then
        MySQL.update('UPDATE org_organizations SET balance = balance - ? WHERE name = ?', {amount, org})
    end
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Transakcja została dodana')
    TriggerClientEvent('org-tablet:client:transactionSuccess', source)
end)

-- Transfer między organizacjami
RegisterNetEvent('org-tablet:server:transferMoney', function(targetOrg, amount, description)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    amount = math.abs(tonumber(amount))
    if amount <= 0 then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nieprawidłowa kwota')
        return
    end
    
    local orgData = GetOrganizationData(org)
    local targetOrgData = GetOrganizationData(targetOrg)
    
    if not targetOrgData then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Organizacja docelowa nie istnieje')
        return
    end
    
    if orgData.balance < amount then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Niewystarczające środki')
        return
    end
    
    -- Wykonaj transfer
    MySQL.update('UPDATE org_organizations SET balance = balance - ? WHERE name = ?', {amount, org})
    MySQL.update('UPDATE org_organizations SET balance = balance + ? WHERE name = ?', {amount, targetOrg})
    
    -- Dodaj transakcje
    MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
        org, xPlayer.identifier, 'transfer', 'Transfer OUT', amount, 'Transfer do: ' .. targetOrg .. ' - ' .. (description or '')
    })
    
    MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
        targetOrg, xPlayer.identifier, 'transfer', 'Transfer IN', amount, 'Transfer od: ' .. org .. ' - ' .. (description or '')
    })
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Transfer został wykonany')
    TriggerClientEvent('org-tablet:client:transactionSuccess', source)
end)

-- Pobieranie statystyk finansowych
RegisterNetEvent('org-tablet:server:getFinanceStats', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nie należysz do organizacji')
        return
    end
    
    -- Statystyki miesięczne
    local monthlyIncome = MySQL.scalar.await([[
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM org_transactions 
        WHERE organization = ? AND type = 'income' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    ]], {org})
    
    local monthlyExpenses = MySQL.scalar.await([[
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM org_transactions 
        WHERE organization = ? AND type = 'expense' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    ]], {org})
    
    -- Statystyki tygodniowe
    local weeklyIncome = MySQL.scalar.await([[
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM org_transactions 
        WHERE organization = ? AND type = 'income' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ]], {org})
    
    local weeklyExpenses = MySQL.scalar.await([[
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM org_transactions 
        WHERE organization = ? AND type = 'expense' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ]], {org})
    
    -- Kategorie wydatków
    local expenseCategories = MySQL.query.await([[
        SELECT category, SUM(amount) as total 
        FROM org_transactions 
        WHERE organization = ? AND type = 'expense' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY category
        ORDER BY total DESC
    ]], {org})
    
    local stats = {
        monthly = {
            income = monthlyIncome,
            expenses = monthlyExpenses,
            profit = monthlyIncome - monthlyExpenses
        },
        weekly = {
            income = weeklyIncome,
            expenses = weeklyExpenses,
            profit = weeklyIncome - weeklyExpenses
        },
        categories = expenseCategories
    }
    
    TriggerClientEvent('org-tablet:client:receiveFinanceStats', source, stats)
end)

-- Pobieranie listy organizacji do transferu
RegisterNetEvent('org-tablet:server:getOrganizations', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org then
        return
    end
    
    local organizations = MySQL.query.await('SELECT name, label FROM org_organizations WHERE name != ?', {org})
    TriggerClientEvent('org-tablet:client:receiveOrganizations', source, organizations)
end)
