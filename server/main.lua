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

-- Otwieranie tabletu przez komendę
RegisterNetEvent('org-tablet:client:openTablet', function()
    local source = source
    TriggerServerEvent('org-tablet:server:getOrgData')
end)

-- Pobieranie danych organizacji
RegisterNetEvent('org-tablet:server:getOrgData', function()
    local source = source
    local orgData = GetPlayerOrgData(source)
    
    if orgData then
        -- Pobierz numer telefonu z bazy danych phone
        local phoneNumber = MySQL.scalar.await('SELECT phone_number FROM phone_phones WHERE citizenid = ?', {
            ESX.GetPlayerFromId(source).identifier
        }) or 'Brak'
        
        -- Aktualizuj numer w tabeli członków
        MySQL.update('UPDATE org_members SET phone_number = ? WHERE identifier = ?', {
            phoneNumber, ESX.GetPlayerFromId(source).identifier
        })
        
        -- Dodaj numer do danych
        orgData.phone_number = phoneNumber
        
        TriggerClientEvent('org-tablet:client:receiveOrgData', source, orgData)
    else
        TriggerClientEvent('org-tablet:client:noOrganization', source)
    end
end)

-- System zatrudniania
RegisterNetEvent('org-tablet:server:invitePlayer', function(targetId)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local xTarget = ESX.GetPlayerFromId(targetId)
    local org = GetPlayerOrganization(source)
    
    if not xTarget then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Gracz nie jest online')
        return
    end
    
    if not org then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nie należysz do organizacji')
        return
    end
    
    if not HasPermission(source, 'manage_members') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nie masz uprawnień do zatrudniania')
        return
    end
    
    -- Sprawdź czy gracz już należy do organizacji
    local existingMember = MySQL.scalar.await('SELECT id FROM org_members WHERE identifier = ?', {xTarget.identifier})
    if existingMember then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Gracz już należy do organizacji')
        return
    end
    
    -- Sprawdź limit członków
    local orgData = GetOrganizationData(org)
    local memberCount = MySQL.scalar.await('SELECT COUNT(*) FROM org_members WHERE organization = ?', {org})
    
    if memberCount >= orgData.member_slots then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Osiągnięto limit członków organizacji')
        return
    end
    
    -- Wyślij zaproszenie
    MySQL.insert('INSERT INTO org_invitations (organization, target_identifier, invited_by) VALUES (?, ?, ?)', {
        org, xTarget.identifier, xPlayer.identifier
    })
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Zaproszenie zostało wysłane')
    TriggerClientEvent('org-tablet:client:receiveInvitation', targetId, {
        id = MySQL.insert_id,
        organization = org,
        inviter_name = xPlayer.getName()
    })
end)

-- Odpowiedź na zaproszenie
RegisterNetEvent('org-tablet:server:respondToInvitation', function(inviteId, response)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    
    local invite = MySQL.single.await('SELECT * FROM org_invitations WHERE id = ? AND target_identifier = ?', {inviteId, xPlayer.identifier})
    
    if not invite then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Zaproszenie nie istnieje')
        return
    end
    
    if response == 'accept' then
        -- Pobierz numer telefonu
        local phoneNumber = MySQL.scalar.await('SELECT phone_number FROM phone_phones WHERE citizenid = ?', {
            xPlayer.identifier
        }) or 'Brak'
        
        -- Dodaj gracza do organizacji
        MySQL.insert('INSERT INTO org_members (organization, identifier, firstname, lastname, org_grade, phone_number) VALUES (?, ?, ?, ?, ?, ?)', {
            invite.organization, xPlayer.identifier, xPlayer.get('firstName'), xPlayer.get('lastName'), 1, phoneNumber
        })
        
        -- Zaktualizuj status zaproszenia
        MySQL.update('UPDATE org_invitations SET status = "accepted" WHERE id = ?', {inviteId})
        
        TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Dołączyłeś do organizacji: ' .. invite.organization)
        
        -- Powiadom zapraszającego
        local inviter = ESX.GetPlayerFromIdentifier(invite.invited_by)
        if inviter then
            TriggerClientEvent('org-tablet:client:showNotification', inviter.source, 'success', xPlayer.getName() .. ' dołączył do organizacji')
        end
    else
        -- Odrzuć zaproszenie
        MySQL.update('UPDATE org_invitations SET status = "declined" WHERE id = ?', {inviteId})
        
        TriggerClientEvent('org-tablet:client:showNotification', source, 'info', 'Odrzuciłeś zaproszenie do organizacji')
    end
end)

-- Zarządzanie członkami
RegisterNetEvent('org-tablet:server:promoteMember', function(memberId, newGrade)
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not HasPermission(source, 'manage_members') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nie masz uprawnień')
        return
    end
    
    local member = MySQL.single.await('SELECT * FROM org_members WHERE id = ? AND organization = ?', {memberId, org})
    if not member then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Członek nie istnieje')
        return
    end
    
    -- Sprawdź czy można awansować
    local playerGrade = GetPlayerOrgData(source).org_grade
    if newGrade >= playerGrade then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nie możesz awansować na wyższy lub równy stopień')
        return
    end
    
    MySQL.update('UPDATE org_members SET org_grade = ? WHERE id = ?', {newGrade, memberId})
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Członek został awansowany')
    
    -- Powiadom członka
    local targetPlayer = ESX.GetPlayerFromIdentifier(member.identifier)
    if targetPlayer then
        TriggerClientEvent('org-tablet:client:showNotification', targetPlayer.source, 'success', 'Zostałeś awansowany na stopień: ' .. newGrade)
    end
end)

RegisterNetEvent('org-tablet:server:fireMember', function(memberId)
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not HasPermission(source, 'manage_members') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nie masz uprawnień')
        return
    end
    
    local member = MySQL.single.await('SELECT * FROM org_members WHERE id = ? AND organization = ?', {memberId, org})
    if not member then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Członek nie istnieje')
        return
    end
    
    -- Sprawdź czy można wyrzucić
    local playerGrade = GetPlayerOrgData(source).org_grade
    if member.org_grade >= playerGrade then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nie możesz wyrzucić członka o wyższym lub równym stopniu')
        return
    end
    
    MySQL.update('DELETE FROM org_members WHERE id = ?', {memberId})
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Członek został wyrzucony')
    
    -- Powiadom członka
    local targetPlayer = ESX.GetPlayerFromIdentifier(member.identifier)
    if targetPlayer then
        TriggerClientEvent('org-tablet:client:showNotification', targetPlayer.source, 'warning', 'Zostałeś wyrzucony z organizacji')
    end
end)

-- Transakcje
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
    
    if not HasPermission(source, 'manage_finances') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Nie masz uprawnień')
        return
    end
    
    -- Aktualizuj saldo organizacji
    if type == 'income' then
        MySQL.update('UPDATE org_organizations SET balance = balance + ? WHERE name = ?', {amount, org})
    elseif type == 'expense' then
        MySQL.update('UPDATE org_organizations SET balance = balance - ? WHERE name = ?', {amount, org})
    end
    
    -- Dodaj transakcję
    MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
        org, xPlayer.identifier, type, category, amount, description
    })
    
    TriggerClientEvent('org-tablet:client:transactionSuccess', source)
end)

-- Komendy do tworzenia organizacji (tylko dla adminów)
ESX.RegisterCommand('createorg', 'admin', function(xPlayer, args, showError)
    local orgName = args.name
    local orgLabel = args.label or orgName
    local balance = args.balance or 0
    local memberSlots = args.slots or 20
    
    if orgName then
        MySQL.insert('INSERT INTO org_organizations (name, label, balance, member_slots) VALUES (?, ?, ?, ?)', {
            orgName, orgLabel, balance, memberSlots
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
    {name = 'label', help = 'Etykieta organizacji', type = 'string'},
    {name = 'balance', help = 'Saldo początkowe', type = 'number'},
    {name = 'slots', help = 'Limit członków', type = 'number'}
}})

-- Komenda do dodawania graczy do organizacji
ESX.RegisterCommand('addmember', 'admin', function(xPlayer, args, showError)
    local targetId = args.id
    local orgName = args.organization
    local grade = args.grade or 1
    
    local xTarget = ESX.GetPlayerFromId(targetId)
    if xTarget then
        MySQL.insert('INSERT INTO org_members (organization, identifier, firstname, lastname, org_grade) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE org_grade = VALUES(org_grade)', {
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

-- Komenda do usuwania organizacji
ESX.RegisterCommand('deleteorg', 'admin', function(xPlayer, args, showError)
    local orgName = args.name
    
    if orgName then
        MySQL.update('DELETE FROM org_organizations WHERE name = ?', {orgName})
        MySQL.update('DELETE FROM org_members WHERE organization = ?', {orgName})
        MySQL.update('DELETE FROM org_transactions WHERE organization = ?', {orgName})
        MySQL.update('DELETE FROM org_notes WHERE organization = ?', {orgName})
        MySQL.update('DELETE FROM org_crypto_portfolio WHERE organization = ?', {orgName})
        MySQL.update('DELETE FROM org_jobs WHERE organization = ?', {orgName})
        MySQL.update('DELETE FROM org_purchased_apps WHERE organization = ?', {orgName})
        
        xPlayer.showNotification('Organizacja ' .. orgName .. ' została usunięta')
    end
end, false, {help = 'Usuń organizację', validate = true, arguments = {
    {name = 'name', help = 'Nazwa organizacji', type = 'string'}
}})

print('^2[ORG-TABLET]^7 Skrypt główny serwera został załadowany')
