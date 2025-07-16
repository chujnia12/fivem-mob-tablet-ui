
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
        SELECT om.*, org.balance, org.crypto_balance, org.level, org.member_slots, org.label 
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
    if orgData.org_grade >= 4 then return true end
    
    local permissions = json.decode(orgData.permissions or '[]')
    for _, perm in pairs(permissions) do
        if perm == permission then
            return true
        end
    end
    
    return false
end

function GetPlayerNameByIdentifier(identifier)
    local result = MySQL.scalar.await('SELECT CONCAT(firstname, " ", lastname) as name FROM users WHERE identifier = ?', {identifier})
    return result or 'Unknown Player'
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
        local members = MySQL.query.await('SELECT * FROM org_members WHERE organization = ? ORDER BY org_grade DESC', {org})
        
        -- Dodaj nazwy graczy
        for i, member in pairs(members) do
            local playerName = GetPlayerNameByIdentifier(member.identifier)
            members[i].player_name = playerName
        end
        
        TriggerClientEvent('org-tablet:client:receiveMembers', source, members)
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
    
    -- Sprawdź czy zaproszenie już istnieje
    local existingInvite = MySQL.scalar.await('SELECT id FROM org_invitations WHERE target_identifier = ? AND status = "pending"', {xTarget.identifier})
    if existingInvite then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Zaproszenie już zostało wysłane')
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

RegisterNetEvent('org-tablet:server:respondToInvitation', function(inviteId, response)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    
    local invite = MySQL.single.await('SELECT * FROM org_invitations WHERE id = ? AND target_identifier = ?', {inviteId, xPlayer.identifier})
    
    if not invite then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Zaproszenie nie istnieje')
        return
    end
    
    if response == 'accept' then
        -- Dodaj gracza do organizacji
        MySQL.insert('INSERT INTO org_members (organization, identifier, firstname, lastname, org_grade) VALUES (?, ?, ?, ?, ?)', {
            invite.organization, xPlayer.identifier, xPlayer.get('firstName'), xPlayer.get('lastName'), 1
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
        
        -- Powiadom zapraszającego
        local inviter = ESX.GetPlayerFromIdentifier(invite.invited_by)
        if inviter then
            TriggerClientEvent('org-tablet:client:showNotification', inviter.source, 'warning', xPlayer.getName() .. ' odrzucił zaproszenie')
        end
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
