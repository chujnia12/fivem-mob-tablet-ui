
-- Aplikacja ustawień - server
ESX = exports['es_extended']:getSharedObject()

-- Kupowanie slotu dla członka (25 COIN)
RegisterNetEvent('org-tablet:server:settings:buyMemberSlot', function()
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    local slotPrice = 25.0 -- Cena za slot w COIN
    local orgData = GetOrganizationData(org)
    
    if orgData.crypto_balance < slotPrice then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Niewystarczające środki COIN')
        return
    end
    
    -- Zwiększ limit członków i odejmij koszt
    MySQL.update('UPDATE org_organizations SET member_slots = member_slots + 1, crypto_balance = crypto_balance - ? WHERE name = ?', {
        slotPrice, org
    })
    
    -- Dodaj transakcję
    MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
        org, xPlayer.identifier, 'expense', 'Rozbudowa', slotPrice, 'Zakup slotu dla członka (+1 slot)'
    })
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Slot dla członka został zakupiony za 25 COIN')
    TriggerServerEvent('org-tablet:server:getOrgData')
end)

-- Zwiększenie garażu (100 COIN)
RegisterNetEvent('org-tablet:server:settings:upgradeGarage', function()
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    local upgradePrice = 100.0 -- Cena za rozbudowę garażu w COIN
    local orgData = GetOrganizationData(org)
    
    if orgData.crypto_balance < upgradePrice then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Niewystarczające środki COIN')
        return
    end
    
    -- Zwiększ sloty w garażu
    MySQL.update('UPDATE org_organizations SET garage_slots = garage_slots + 1, crypto_balance = crypto_balance - ? WHERE name = ?', {
        upgradePrice, org
    })
    
    -- Dodaj transakcję
    MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
        org, xPlayer.identifier, 'expense', 'Rozbudowa', upgradePrice, 'Rozbudowa garażu (+1 pojazd)'
    })
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Garaż został rozbudowany za 100 COIN (+1 pojazd)')
    TriggerServerEvent('org-tablet:server:getOrgData')
end)

-- Zwiększenie szafki (75 COIN)
RegisterNetEvent('org-tablet:server:settings:upgradeStash', function()
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    local upgradePrice = 75.0 -- Cena za rozbudowę szafki w COIN
    local orgData = GetOrganizationData(org)
    
    if orgData.crypto_balance < upgradePrice then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Niewystarczające środki COIN')
        return
    end
    
    -- Zwiększ sloty w szafce
    MySQL.update('UPDATE org_organizations SET stash_slots = stash_slots + 100, crypto_balance = crypto_balance - ? WHERE name = ?', {
        upgradePrice, org
    })
    
    -- Dodaj transakcję
    MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
        org, xPlayer.identifier, 'expense', 'Rozbudowa', upgradePrice, 'Rozbudowa szafki (+100kg)'
    })
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Szafka została rozbudowana za 75 COIN (+100kg)')
    TriggerServerEvent('org-tablet:server:getOrgData')
end)

-- Nadawanie indywidualnych uprawnień
RegisterNetEvent('org-tablet:server:settings:setIndividualPermissions', function(memberId, permissions)
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_members') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    -- Sprawdź czy członek istnieje
    local member = MySQL.single.await('SELECT * FROM org_members WHERE id = ? AND organization = ?', {memberId, org})
    if not member then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Członek nie istnieje')
        return
    end
    
    -- Aktualizuj indywidualne uprawnienia
    MySQL.update('UPDATE org_members SET individual_permissions = ? WHERE id = ?', {
        json.encode(permissions), memberId
    })
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Uprawnienia zostały zaktualizowane')
    
    -- Powiadom członka
    local targetPlayer = ESX.GetPlayerFromIdentifier(member.identifier)
    if targetPlayer then
        TriggerClientEvent('org-tablet:client:showNotification', targetPlayer.source, 'info', 'Twoje uprawnienia zostały zaktualizowane')
    end
end)

-- Pobieranie ustawień organizacji
RegisterNetEvent('org-tablet:server:settings:getOrgSettings', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if org then
        local orgData = GetOrganizationData(org)
        local memberCount = MySQL.scalar.await('SELECT COUNT(*) FROM org_members WHERE organization = ?', {org})
        
        TriggerClientEvent('org-tablet:client:settings:receiveOrgSettings', source, {
            organization = orgData,
            memberCount = memberCount,
            slotPrice = 25.0,
            garageUpgradePrice = 100.0,
            stashUpgradePrice = 75.0
        })
    end
end)
