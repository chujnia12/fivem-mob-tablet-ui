
ESX = exports['es_extended']:getSharedObject()

-- Funkcje pomocnicze
function GetPlayerOrganization(source)
    return exports['org-system']:GetPlayerOrganization(source)
end

function GetPlayerOrgData(source)
    return exports['org-system']:GetPlayerOrgData(source)
end

function HasPermission(source, permission)
    return exports['org-system']:HasPermission(source, permission)
end

-- Sprawdzanie członkostwa w organizacji
ESX.RegisterServerCallback('org-tablet:checkMembership', function(source, cb)
    local orgData = GetPlayerOrgData(source)
    if orgData then
        -- Pobierz dodatkowe dane
        local members = MySQL.query.await('SELECT COUNT(*) as count FROM org_members WHERE organization = ?', {orgData.organization})
        orgData.member_count = members[1].count
        
        -- Pobierz zakupione aplikacje
        local apps = MySQL.query.await('SELECT app_id FROM org_purchased_apps WHERE organization = ?', {orgData.organization})
        orgData.purchased_apps = {}
        for _, app in pairs(apps) do
            table.insert(orgData.purchased_apps, app.app_id)
        end
        
        cb(true, orgData)
    else
        cb(false, nil)
    end
end)

-- Zakup aplikacji
RegisterNetEvent('org-tablet:server:purchaseApp', function(appId)
    local source = source
    local orgData = GetPlayerOrgData(source)
    
    if not orgData or not HasPermission(source, 'purchase_apps') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień')
        return
    end
    
    local price = Config.AppPrices[appId] or 0
    if orgData.crypto_balance < price then
        TriggerClientEvent('esx:showNotification', source, 'Brak środków na zakup aplikacji')
        return
    end
    
    -- Sprawdź czy już zakupiona
    local existing = MySQL.scalar.await('SELECT id FROM org_purchased_apps WHERE organization = ? AND app_id = ?', {
        orgData.organization, appId
    })
    
    if existing then
        TriggerClientEvent('esx:showNotification', source, 'Aplikacja już zakupiona')
        return
    end
    
    -- Dodaj aplikację
    MySQL.insert('INSERT INTO org_purchased_apps (organization, app_id) VALUES (?, ?)', {
        orgData.organization, appId
    })
    
    -- Odejmij kryptowaluty
    MySQL.update('UPDATE org_organizations SET crypto_balance = crypto_balance - ? WHERE name = ?', {
        price, orgData.organization
    })
    
    TriggerClientEvent('esx:showNotification', source, 'Aplikacja ' .. appId .. ' została zakupiona')
    print('^3[ORG-TABLET]^7 ' .. orgData.organization .. ' zakupił aplikację: ' .. appId)
end)

-- Dodawanie transakcji
RegisterNetEvent('org-tablet:server:addTransaction', function(data)
    local source = source
    local orgData = GetPlayerOrgData(source)
    
    if not orgData or not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień')
        return
    end
    
    MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
        orgData.organization,
        ESX.GetPlayerFromId(source).identifier,
        data.type,
        data.category,
        data.amount,
        data.description
    })
    
    -- Aktualizuj saldo organizacji
    if data.type == 'income' then
        MySQL.update('UPDATE org_organizations SET balance = balance + ? WHERE name = ?', {data.amount, orgData.organization})
    elseif data.type == 'expense' then
        MySQL.update('UPDATE org_organizations SET balance = balance - ? WHERE name = ?', {data.amount, orgData.organization})
    end
    
    TriggerClientEvent('esx:showNotification', source, 'Transakcja dodana')
end)

-- Zarządzanie członkami
RegisterNetEvent('org-tablet:server:inviteMember', function(playerId)
    local source = source
    local orgData = GetPlayerOrgData(source)
    local xTarget = ESX.GetPlayerFromId(playerId)
    
    if not orgData or not HasPermission(source, 'manage_members') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień')
        return
    end
    
    if not xTarget then
        TriggerClientEvent('esx:showNotification', source, 'Gracz nie znaleziony')
        return
    end
    
    -- Sprawdź czy gracz już należy do organizacji
    local existingOrg = GetPlayerOrganization(playerId)
    if existingOrg then
        TriggerClientEvent('esx:showNotification', source, 'Gracz już należy do organizacji')
        return
    end
    
    -- Dodaj zaproszenie
    MySQL.insert('INSERT INTO org_invitations (organization, target_identifier, inviter_identifier) VALUES (?, ?, ?)', {
        orgData.organization,
        xTarget.identifier,
        ESX.GetPlayerFromId(source).identifier
    })
    
    TriggerClientEvent('esx:showNotification', source, 'Zaproszenie wysłane do ' .. xTarget.getName())
    TriggerClientEvent('esx:showNotification', playerId, 'Otrzymałeś zaproszenie do organizacji ' .. orgData.organization)
end)

-- Rozbudowa organizacji
RegisterNetEvent('org-tablet:server:buyMemberSlot', function()
    local source = source
    local orgData = GetPlayerOrgData(source)
    
    if not orgData or not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień')
        return
    end
    
    local price = Config.UpgradePrices.member_slot
    if orgData.crypto_balance < price then
        TriggerClientEvent('esx:showNotification', source, 'Brak środków')
        return
    end
    
    MySQL.update('UPDATE org_organizations SET member_slots = member_slots + 1, crypto_balance = crypto_balance - ? WHERE name = ?', {
        price, orgData.organization
    })
    
    TriggerClientEvent('esx:showNotification', source, 'Zwiększono limit członków')
end)

print('^2[ORG-TABLET]^7 Serwer systemu tabletu został załadowany')
