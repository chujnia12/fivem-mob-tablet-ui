
ESX = exports['es_extended']:getSharedObject()

-- Rejestracja używalnego przedmiotu
if Config.UseOxInventory then
    exports('org_tablet', function(event, item, inventory, slot, data)
        if event == 'usingItem' then
            local source = inventory.id
            TriggerClientEvent('org-tablet:client:openTablet', source)
        end
    end)
else
    ESX.RegisterUsableItem(Config.UsableItem, function(source)
        TriggerClientEvent('org-tablet:client:openTablet', source)
    end)
end

-- Funkcje pomocnicze
function GetPlayerOrganization(source)
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer then return nil end
    
    local result = MySQL.scalar.await('SELECT organization FROM org_members WHERE identifier = ?', {
        xPlayer.identifier
    })
    
    return result
end

function GetPlayerOrgData(source)
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer then return nil end
    
    local result = MySQL.single.await([[
        SELECT om.*, org.balance, org.crypto_balance, org.level 
        FROM org_members om 
        JOIN org_organizations org ON om.organization = org.name 
        WHERE om.identifier = ?
    ]], {xPlayer.identifier})
    
    return result
end

function HasPermission(source, permission)
    local orgData = GetPlayerOrgData(source)
    if not orgData then return false end
    
    -- Boss ma wszystkie uprawnienia
    if orgData.grade >= 4 then return true end
    
    local permissions = json.decode(orgData.permissions or '[]')
    return table.contains(permissions, permission)
end

-- Eventy sieciowe
RegisterNetEvent('org-tablet:server:getOrgData', function()
    local source = source
    local orgData = GetPlayerOrgData(source)
    
    if orgData then
        TriggerClientEvent('org-tablet:client:receiveOrgData', source, orgData)
    else
        TriggerClientEvent('org-tablet:client:noOrganization', source)
    end
end)

RegisterNetEvent('org-tablet:server:getMembers', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if org then
        local members = MySQL.query.await('SELECT * FROM org_members WHERE organization = ? ORDER BY grade DESC', {org})
        TriggerClientEvent('org-tablet:client:receiveMembers', source, members)
    end
end)

RegisterNetEvent('org-tablet:server:getTransactions', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if org then
        local transactions = MySQL.query.await('SELECT * FROM org_transactions WHERE organization = ? ORDER BY created_at DESC LIMIT 50', {org})
        TriggerClientEvent('org-tablet:client:receiveTransactions', source, transactions)
    end
end)

RegisterNetEvent('org-tablet:server:addTransaction', function(type, category, amount, description)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if org and HasPermission(source, 'manage_finances') then
        MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
            org, xPlayer.identifier, type, category, amount, description
        })
        
        -- Aktualizuj saldo organizacji
        if type == 'income' then
            MySQL.update('UPDATE org_organizations SET balance = balance + ? WHERE name = ?', {amount, org})
        elseif type == 'expense' then
            MySQL.update('UPDATE org_organizations SET balance = balance - ? WHERE name = ?', {amount, org})
        end
        
        TriggerClientEvent('org-tablet:client:transactionSuccess', source)
        TriggerEvent('org-tablet:server:getTransactions')
    end
end)

-- Komenda do tworzenia organizacji (tylko dla adminów)
ESX.RegisterCommand('createorg', 'admin', function(xPlayer, args, showError)
    local orgName = args.name
    local orgLabel = args.label
    
    if orgName and orgLabel then
        MySQL.insert('INSERT INTO org_organizations (name, label) VALUES (?, ?)', {
            orgName, orgLabel
        }, function(insertId)
            if insertId then
                xPlayer.showNotification('Organizacja ' .. orgLabel .. ' została utworzona')
            else
                xPlayer.showNotification('Błąd podczas tworzenia organizacji')
            end
        end)
    end
end, false, {help = 'Utwórz organizację', validate = true, arguments = {
    {name = 'name', help = 'Nazwa organizacji', type = 'string'},
    {name = 'label', help = 'Etykieta organizacji', type = 'string'}
}})

-- Komenda do dodawania graczy do organizacji
ESX.RegisterCommand('addmember', 'admin', function(xPlayer, args, showError)
    local targetId = args.id
    local orgName = args.organization
    local grade = args.grade or 0
    
    local xTarget = ESX.GetPlayerFromId(targetId)
    if xTarget then
        MySQL.insert('INSERT INTO org_members (organization, identifier, firstname, lastname, grade) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE grade = VALUES(grade)', {
            orgName, xTarget.identifier, xTarget.get('firstName'), xTarget.get('lastName'), grade
        }, function(insertId)
            if insertId then
                xPlayer.showNotification('Gracz został dodany do organizacji')
                xTarget.showNotification('Zostałeś dodany do organizacji: ' .. orgName)
            end
        end)
    end
end, false, {help = 'Dodaj gracza do organizacji', validate = true, arguments = {
    {name = 'id', help = 'ID gracza', type = 'number'},
    {name = 'organization', help = 'Nazwa organizacji', type = 'string'},
    {name = 'grade', help = 'Stopień (opcjonalne)', type = 'number'}
}})

print('^2[ORG-TABLET]^7 Skrypt główny serwera został załadowany')
