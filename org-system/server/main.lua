ESX = exports['es_extended']:getSharedObject()

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
        SELECT om.*, org.balance, org.crypto_balance, org.level, org.member_slots, org.garage_slots, org.stash_slots, org.label 
        FROM org_members om 
        JOIN org_organizations org ON om.organization = org.name 
        WHERE om.identifier = ?
    ]], {xPlayer.identifier})
    
    return result
end

function GetOrganizationData(orgName)
    return MySQL.single.await('SELECT * FROM org_organizations WHERE name = ?', {orgName})
end

function HasPermission(source, permission)
    local orgData = GetPlayerOrgData(source)
    if not orgData then return false end
    
    -- Boss ma wszystkie uprawnienia
    if orgData.org_grade >= 5 then return true end
    
    -- Sprawdź indywidualne uprawnienia
    local individualPerms = json.decode(orgData.individual_permissions or '[]')
    for _, perm in pairs(individualPerms) do
        if perm == permission then
            return true
        end
    end
    
    -- Sprawdź uprawnienia z rangi
    local gradePerms = Config.Grades[orgData.org_grade].permissions or {}
    for _, perm in pairs(gradePerms) do
        if perm == permission then
            return true
        end
    end
    
    return false
end

-- System organizacji - zaktualizowany dla dynamicznych pojemności
RegisterNetEvent('org-system:server:openStash', function(orgName)
    -- Przekieruj do nowego systemu schowków
    TriggerEvent('org-system:server:openStash', orgName)
end)

-- Spawn pojazdu - zaktualizowany
RegisterNetEvent('org-system:server:spawnVehicle', function(model, orgName)
    -- Przekieruj do nowego systemu garażu
    TriggerEvent('org-system:server:spawnVehicle', model, orgName)
end)

-- Wypłata wynagrodzeń
RegisterNetEvent('org-system:server:payroll', function(orgName)
    local source = source
    
    if not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień')
        return
    end
    
    local members = MySQL.query.await('SELECT * FROM org_members WHERE organization = ?', {orgName})
    local totalSalary = 0
    
    for _, member in pairs(members) do
        local salary = Config.Grades[member.org_grade].salary or 0
        totalSalary = totalSalary + salary
        
        -- Wypłać graczowi jeśli jest online
        local xTarget = ESX.GetPlayerFromIdentifier(member.identifier)
        if xTarget then
            xTarget.addMoney(salary)
            TriggerClientEvent('esx:showNotification', xTarget.source, 'Otrzymałeś wynagrodzenie: $' .. salary)
        end
    end
    
    -- Odejmij od salda organizacji
    MySQL.update('UPDATE org_organizations SET balance = balance - ? WHERE name = ?', {totalSalary, orgName})
    
    TriggerClientEvent('esx:showNotification', source, 'Wypłacono wynagrodzenia: $' .. totalSalary)
end)

-- Export funkcji
exports('GetPlayerOrganization', GetPlayerOrganization)
exports('GetPlayerOrgData', GetPlayerOrgData)
exports('HasPermission', HasPermission)
exports('GetOrganizationData', GetOrganizationData)

-- Nowe eventy dla rozbudowy organizacji
RegisterNetEvent('org-system:server:upgradeMemberSlots', function(orgName, amount)
    local source = source
    
    if not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień')
        return
    end
    
    MySQL.update('UPDATE org_organizations SET member_slots = member_slots + ? WHERE name = ?', {
        amount, orgName
    })
    
    TriggerClientEvent('esx:showNotification', source, 'Zwiększono limit członków o ' .. amount)
    print('^3[ORG-UPGRADE]^7 ' .. orgName .. ' zwiększył limit członków o ' .. amount)
end)

RegisterNetEvent('org-system:server:upgradeGarageSlots', function(orgName, amount)
    local source = source
    
    if not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień')
        return
    end
    
    MySQL.update('UPDATE org_organizations SET garage_slots = garage_slots + ? WHERE name = ?', {
        amount, orgName
    })
    
    TriggerClientEvent('esx:showNotification', source, 'Zwiększono pojemność garażu o ' .. amount .. ' pojazdów')
    print('^3[ORG-UPGRADE]^7 ' .. orgName .. ' zwiększył pojemność garażu o ' .. amount)
end)

RegisterNetEvent('org-system:server:upgradeStashSlots', function(orgName, amount)
    local source = source
    
    if not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień')
        return
    end
    
    MySQL.update('UPDATE org_organizations SET stash_slots = stash_slots + ? WHERE name = ?', {
        amount, orgName
    })
    
    TriggerClientEvent('esx:showNotification', source, 'Zwiększono pojemność szafki o ' .. amount .. 'kg')
    print('^3[ORG-UPGRADE]^7 ' .. orgName .. ' zwiększył pojemność szafki o ' .. amount .. 'kg')
end)

print('^2[ORG-SYSTEM]^7 System organizacji z dynamicznymi pojemnościami został załadowany')
