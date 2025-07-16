
ESX = exports['es_extended']:getSharedObject()

-- Import funkcji pomocniczych z org-system
local function GetPlayerOrganization(source)
    if exports['org-system'] then
        return exports['org-system']:GetPlayerOrganization(source)
    end
    
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer then return nil end
    
    local result = MySQL.scalar.await('SELECT organization FROM org_members WHERE identifier = ?', {
        xPlayer.identifier
    })
    
    return result
end

local function GetOrganizationData(orgName)
    return MySQL.single.await('SELECT * FROM org_organizations WHERE name = ?', {orgName})
end

local function HasPermission(source, permission)
    if exports['org-system'] then
        return exports['org-system']:HasPermission(source, permission)
    end
    
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer then return false end
    
    local memberData = MySQL.single.await([[
        SELECT om.org_grade, om.individual_permissions 
        FROM org_members om 
        WHERE om.identifier = ?
    ]], {xPlayer.identifier})
    
    if not memberData then return false end
    
    -- Boss ma wszystkie uprawnienia
    if memberData.org_grade >= 5 then return true end
    
    -- Sprawdź indywidualne uprawnienia
    if memberData.individual_permissions then
        local individualPerms = json.decode(memberData.individual_permissions)
        for _, perm in pairs(individualPerms) do
            if perm == permission then
                return true
            end
        end
    end
    
    -- Sprawdź uprawnienia z rangi
    local gradePerms = Config.Grades[memberData.org_grade].permissions or {}
    for _, perm in pairs(gradePerms) do
        if perm == permission then
            return true
        end
    end
    
    return false
end

local function GetPlayerNameByIdentifier(identifier)
    local result = MySQL.scalar.await('SELECT firstname, lastname FROM users WHERE identifier = ?', {identifier})
    return result and (result.firstname .. ' ' .. result.lastname) or 'Unknown Player'
end

-- Główne eventy tabletu
RegisterNetEvent('org-tablet:server:getOrgData', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org then
        TriggerClientEvent('org-tablet:client:noOrganization', source)
        return
    end
    
    local orgData = GetOrganizationData(org)
    local memberCount = MySQL.scalar.await('SELECT COUNT(*) FROM org_members WHERE organization = ?', {org})
    
    -- Dodaj informacje o członkach
    orgData.member_count = memberCount
    
    TriggerClientEvent('org-tablet:client:receiveOrgData', source, orgData)
end)

-- Zarządzanie członkami
RegisterNetEvent('org-tablet:server:getMembers', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org then return end
    
    local members = MySQL.query.await([[
        SELECT om.*, u.firstname, u.lastname 
        FROM org_members om 
        LEFT JOIN users u ON om.identifier = u.identifier 
        WHERE om.organization = ? 
        ORDER BY om.org_grade DESC, om.joined_at ASC
    ]], {org})
    
    -- Dodaj nazwy graczy
    for i, member in pairs(members) do
        if member.firstname and member.lastname then
            members[i].player_name = member.firstname .. ' ' .. member.lastname
        else
            members[i].player_name = 'Unknown Player'
        end
    end
    
    TriggerClientEvent('org-tablet:client:receiveMembers', source, members)
end)

RegisterNetEvent('org-tablet:server:invitePlayer', function(playerId)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_members') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    local xTarget = ESX.GetPlayerFromId(playerId)
    if not xTarget then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Gracz nie jest online')
        return
    end
    
    -- Sprawdź czy gracz już należy do organizacji
    local targetOrg = GetPlayerOrganization(playerId)
    if targetOrg then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Gracz już należy do organizacji')
        return
    end
    
    -- Utwórz zaproszenie
    local invitationId = MySQL.insert('INSERT INTO org_invitations (organization, target_identifier, inviter_identifier) VALUES (?, ?, ?)', {
        org, xTarget.identifier, xPlayer.identifier
    })
    
    if invitationId then
        -- Wyślij zaproszenie do gracza
        TriggerClientEvent('org-tablet:client:receiveInvitation', playerId, {
            id = invitationId,
            organization = org,
            inviter_name = xPlayer.getName()
        })
        
        TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Zaproszenie zostało wysłane')
    end
end)

RegisterNetEvent('org-tablet:server:respondToInvitation', function(invitationId, response)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    
    local invitation = MySQL.single.await('SELECT * FROM org_invitations WHERE id = ? AND target_identifier = ?', {
        invitationId, xPlayer.identifier
    })
    
    if not invitation then return end
    
    if response == 'accept' then
        -- Sprawdź limit członków
        local orgData = GetOrganizationData(invitation.organization)
        local memberCount = MySQL.scalar.await('SELECT COUNT(*) FROM org_members WHERE organization = ?', {invitation.organization})
        
        if memberCount >= orgData.member_slots then
            TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Organizacja osiągnęła limit członków')
            return
        end
        
        -- Dodaj gracza do organizacji
        MySQL.insert('INSERT INTO org_members (identifier, organization, org_grade) VALUES (?, ?, ?)', {
            xPlayer.identifier, invitation.organization, 0
        })
        
        TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Dołączyłeś do organizacji: ' .. invitation.organization)
    end
    
    -- Usuń zaproszenie
    MySQL.update('UPDATE org_invitations SET status = ?, responded_at = NOW() WHERE id = ?', {
        response == 'accept' and 'accepted' or 'declined', invitationId
    })
end)

RegisterNetEvent('org-tablet:server:promoteMember', function(memberId, newGrade)
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_members') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    MySQL.update('UPDATE org_members SET org_grade = ? WHERE id = ? AND organization = ?', {
        newGrade, memberId, org
    })
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Członek został awansowany')
end)

RegisterNetEvent('org-tablet:server:fireMember', function(memberId)
    local source = source
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_members') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    MySQL.update('DELETE FROM org_members WHERE id = ? AND organization = ?', {memberId, org})
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Członek został wyrzucony')
end)

print('^2[ORG-TABLET]^7 Serwer tabletu został załadowany')
