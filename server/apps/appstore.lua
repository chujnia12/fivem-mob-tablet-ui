
-- Sklep aplikacji - server
RegisterNetEvent('org-tablet:server:apps:purchaseApp', function(appId)
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'purchase_apps') then
        return
    end
    
    local appConfig = Config.AppStore[appId]
    if not appConfig then
        return
    end
    
    local orgData = MySQL.single.await('SELECT crypto_balance FROM org_organizations WHERE name = ?', {org})
    
    if orgData.crypto_balance >= appConfig.price then
        -- Sprawdź czy aplikacja nie jest już zakupiona
        local alreadyPurchased = MySQL.scalar.await('SELECT COUNT(*) FROM org_purchased_apps WHERE organization = ? AND app_id = ?', {org, appId})
        
        if alreadyPurchased == 0 then
            -- Odejmij koszt
            MySQL.update('UPDATE org_organizations SET crypto_balance = crypto_balance - ? WHERE name = ?', {
                appConfig.price, org
            })
            
            -- Dodaj do zakupionych
            MySQL.insert('INSERT INTO org_purchased_apps (organization, app_id) VALUES (?, ?)', {org, appId})
            
            -- Zapisz transakcję
            MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
                org, ESX.GetPlayerFromId(source).identifier, 'expense', 'app_purchase', appConfig.price, 'Zakup aplikacji: ' .. appConfig.name
            })
            
            TriggerClientEvent('org-tablet:client:apps:purchaseSuccess', source, appConfig.name)
            TriggerServerEvent('org-tablet:server:getOrgData')
        else
            TriggerClientEvent('org-tablet:client:apps:error', source, 'Aplikacja już została zakupiona')
        end
    else
        TriggerClientEvent('org-tablet:client:apps:error', source, 'Niewystarczające środki')
    end
end)

RegisterNetEvent('org-tablet:server:apps:getPurchasedApps', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if org then
        local purchasedApps = MySQL.query.await('SELECT app_id FROM org_purchased_apps WHERE organization = ?', {org})
        TriggerClientEvent('org-tablet:client:apps:receivePurchasedApps', source, purchasedApps)
    end
end)
