
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

-- System organizacji
RegisterNetEvent('org-system:server:openStash', function(orgName)
    local source = source
    local playerOrg = GetPlayerOrganization(source)
    
    if playerOrg ~= orgName then
        TriggerClientEvent('esx:showNotification', source, 'Nie należysz do tej organizacji')
        return
    end
    
    if not HasPermission(source, 'stash_access') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień do schowka')
        return
    end
    
    local orgData = GetOrganizationData(orgName)
    local stashSize = orgData.stash_slots or 50
    
    exports.ox_inventory:RegisterStash('org_stash_' .. orgName, 'Schowek ' .. orgName, stashSize, 100000)
    TriggerClientEvent('ox_inventory:openInventory', source, 'stash', 'org_stash_' .. orgName)
end)

-- Spawn pojazdu
RegisterNetEvent('org-system:server:spawnVehicle', function(model, orgName)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local playerOrg = GetPlayerOrganization(source)
    
    if playerOrg ~= orgName then
        TriggerClientEvent('esx:showNotification', source, 'Nie należysz do tej organizacji')
        return
    end
    
    if not HasPermission(source, 'garage_access') then
        TriggerClientEvent('esx:showNotification', source, 'Brak uprawnień do garażu')
        return
    end
    
    -- Sprawdź limit pojazdów
    local vehicleCount = MySQL.scalar.await('SELECT COUNT(*) FROM org_vehicles WHERE organization = ?', {orgName})
    local orgData = GetOrganizationData(orgName)
    
    if vehicleCount >= (orgData.garage_slots or 10) then
        TriggerClientEvent('esx:showNotification', source, 'Garaż jest pełny')
        return
    end
    
    -- Wygeneruj tablicę
    local plate = 'ORG' .. string.upper(string.sub(orgName, 1, 3)) .. math.random(10, 99)
    
    -- Dodaj pojazd do bazy
    MySQL.insert('INSERT INTO org_vehicles (organization, model, plate) VALUES (?, ?, ?)', {
        orgName, model, plate
    })
    
    -- Spawn pojazdu
    local coords = Config.Organizations[orgName].garage
    TriggerClientEvent('org-system:client:spawnVehicle', source, model, plate, coords)
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

print('^2[ORG-SYSTEM]^7 System organizacji został załadowany')
