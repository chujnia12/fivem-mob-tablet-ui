
-- App Store - serwer
ESX = exports['es_extended']:getSharedObject()

-- Pobieranie dostępnych aplikacji
RegisterNetEvent('org-tablet:server:getAvailableApps', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nie należysz do organizacji')
        return
    end
    
    -- Pobierz zakupione aplikacje
    local purchasedApps = MySQL.query.await('SELECT app_id FROM org_purchased_apps WHERE organization = ?', {org})
    local purchasedList = {}
    for _, app in pairs(purchasedApps) do
        table.insert(purchasedList, app.app_id)
    end
    
    -- Przygotuj listę aplikacji
    local availableApps = {}
    for appId, appData in pairs(Config.Apps) do
        table.insert(availableApps, {
            id = appId,
            name = appData.name,
            description = appData.description,
            price = appData.price,
            icon = appData.icon,
            purchased = table.contains(purchasedList, appId)
        })
    end
    
    TriggerClientEvent('org-tablet:client:receiveAvailableApps', source, availableApps)
end)

-- Zakup aplikacji
RegisterNetEvent('org-tablet:server:purchaseApp', function(appId)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'purchase_apps') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    local appData = Config.Apps[appId]
    if not appData then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Aplikacja nie istnieje')
        return
    end
    
    -- Sprawdź czy aplikacja już została zakupiona
    local existing = MySQL.scalar.await('SELECT id FROM org_purchased_apps WHERE organization = ? AND app_id = ?', {org, appId})
    if existing then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Aplikacja już została zakupiona')
        return
    end
    
    local orgData = GetOrganizationData(org)
    if orgData.crypto_balance < appData.price then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Niewystarczające środki krypto')
        return
    end
    
    -- Wykonaj zakup
    MySQL.update('UPDATE org_organizations SET crypto_balance = crypto_balance - ? WHERE name = ?', {appData.price, org})
    MySQL.insert('INSERT INTO org_purchased_apps (organization, app_id) VALUES (?, ?)', {org, appId})
    
    -- Dodaj transakcję
    MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
        org, xPlayer.identifier, 'expense', 'Aplikacje', appData.price, 'Zakup aplikacji: ' .. appData.name
    })
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Aplikacja została zakupiona: ' .. appData.name)
    TriggerClientEvent('org-tablet:client:appPurchased', source, appId)
end)

-- Funkcja pomocnicza
function table.contains(table, element)
    for _, value in pairs(table) do
        if value == element then
            return true
        end
    end
    return false
end
