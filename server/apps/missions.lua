
-- System misji dla organizacji
ESX = exports['es_extended']:getSharedObject()

local activeMissions = {}
local missionCooldowns = {}

-- Tworzenie misji
RegisterNetEvent('org-tablet:server:createMission', function(missionData)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = exports['org-system']:GetPlayerOrganization(source)
    
    if not org or not exports['org-system']:HasPermission(source, 'manage_jobs') then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Brak uprawnień')
        return
    end
    
    -- Sprawdź cooldown
    local cooldownKey = org .. '_' .. missionData.type
    if missionCooldowns[cooldownKey] and missionCooldowns[cooldownKey] > GetGameTimer() then
        local remaining = math.ceil((missionCooldowns[cooldownKey] - GetGameTimer()) / 60000)
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Musisz poczekać ' .. remaining .. ' minut')
        return
    end
    
    local missionId = MySQL.insert.await('INSERT INTO org_jobs (organization, title, description, job_type, priority, reward, created_by, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', {
        org, missionData.title, missionData.description, missionData.type, missionData.priority, missionData.reward, xPlayer.identifier, missionData.deadline
    })
    
    if missionId then
        -- Dodaj cooldown (30 minut)
        missionCooldowns[cooldownKey] = GetGameTimer() + (30 * 60 * 1000)
        
        -- Powiadom wszystkich członków organizacji
        local members = MySQL.query.await('SELECT identifier FROM org_members WHERE organization = ?', {org})
        
        for _, member in pairs(members) do
            local targetPlayer = ESX.GetPlayerFromIdentifier(member.identifier)
            if targetPlayer then
                TriggerClientEvent('org-tablet:client:showNotification', targetPlayer.source, 'success', 'Nowa misja dostępna: ' .. missionData.title)
                TriggerClientEvent('org-tablet:client:missionCreated', targetPlayer.source, {
                    id = missionId,
                    title = missionData.title,
                    type = missionData.type,
                    reward = missionData.reward
                })
            end
        end
        
        TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Misja została utworzona')
        exports['org-system']:UpdateOrgStats(org, 'missions_created', 1)
    end
end)

-- Przypisanie do misji
RegisterNetEvent('org-tablet:server:assignToMission', function(missionId, targetId)
    local source = source
    local org = exports['org-system']:GetPlayerOrganization(source)
    
    if not org then return end
    
    local mission = MySQL.single.await('SELECT * FROM org_jobs WHERE id = ? AND organization = ?', {missionId, org})
    if not mission then return end
    
    local xTarget = ESX.GetPlayerFromId(targetId)
    if not xTarget then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Gracz nie jest online')
        return
    end
    
    -- Sprawdź czy gracz należy do organizacji
    local targetOrg = exports['org-system']:GetPlayerOrganization(targetId)
    if targetOrg ~= org then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Gracz nie należy do organizacji')
        return
    end
    
    MySQL.update('UPDATE org_jobs SET assigned_to = ?, status = "assigned" WHERE id = ?', {
        xTarget.identifier, missionId
    })
    
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Misja została przypisana')
    TriggerClientEvent('org-tablet:client:showNotification', targetId, 'success', 'Przypisano Ci nową misję: ' .. mission.title)
    TriggerClientEvent('org-tablet:client:missionAssigned', targetId, mission)
end)

-- Rozpoczęcie misji
RegisterNetEvent('org-tablet:server:startMission', function(missionId)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = exports['org-system']:GetPlayerOrganization(source)
    
    local mission = MySQL.single.await('SELECT * FROM org_jobs WHERE id = ? AND assigned_to = ? AND organization = ?', {
        missionId, xPlayer.identifier, org
    })
    
    if not mission then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Misja nie istnieje lub nie jest do Ciebie przypisana')
        return
    end
    
    if mission.status ~= 'assigned' then
        TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Misja już została rozpoczęta lub ukończona')
        return
    end
    
    MySQL.update('UPDATE org_jobs SET status = "in_progress" WHERE id = ?', {missionId})
    
    -- Rozpocznij misję w grze
    activeMissions[source] = mission
    TriggerClientEvent('org-tablet:client:startMissionInGame', source, mission)
    TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Misja rozpoczęta: ' .. mission.title)
end)

-- Ukończenie misji
RegisterNetEvent('org-tablet:server:completeMission', function(missionId, success)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = exports['org-system']:GetPlayerOrganization(source)
    
    local mission = activeMissions[source]
    if not mission or mission.id ~= missionId then
        return
    end
    
    activeMissions[source] = nil
    
    if success then
        -- Wypłać nagrodę
        local orgData = MySQL.single.await('SELECT * FROM org_organizations WHERE name = ?', {org})
        if orgData.balance >= mission.reward then
            MySQL.update('UPDATE org_organizations SET balance = balance - ? WHERE name = ?', {mission.reward, org})
            xPlayer.addMoney(mission.reward)
            
            MySQL.update('UPDATE org_jobs SET status = "completed" WHERE id = ?', {missionId})
            
            -- Dodaj transakcję
            MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
                org, xPlayer.identifier, 'expense', 'Misje', mission.reward, 'Nagroda za misję: ' .. mission.title
            })
            
            TriggerClientEvent('org-tablet:client:showNotification', source, 'success', 'Misja ukończona! Otrzymałeś $' .. mission.reward)
            exports['org-system']:UpdateOrgStats(org, 'missions_completed', 1)
            exports['org-system']:UpdateOrgStats(org, 'mission_earnings', mission.reward)
        else
            TriggerClientEvent('org-tablet:client:showNotification', source, 'error', 'Organizacja nie ma wystarczających środków')
        end
    else
        MySQL.update('UPDATE org_jobs SET status = "available", assigned_to = NULL WHERE id = ?', {missionId})
        TriggerClientEvent('org-tablet:client:showNotification', source, 'warning', 'Misja nie powiodła się')
    end
end)

-- Czyszczenie nieaktywnych misji
CreateThread(function()
    while true do
        Wait(300000) -- 5 minut
        
        -- Usuń przedawnione misje
        MySQL.update('UPDATE org_jobs SET status = "cancelled" WHERE deadline < NOW() AND status IN ("available", "assigned")', {})
        
        -- Wyczyść cooldowny
        local currentTime = GetGameTimer()
        for key, time in pairs(missionCooldowns) do
            if time < currentTime then
                missionCooldowns[key] = nil
            end
        end
    end
end)

-- Event gdy gracz się rozłączy
AddEventHandler('playerDropped', function()
    local source = source
    if activeMissions[source] then
        local mission = activeMissions[source]
        MySQL.update('UPDATE org_jobs SET status = "available", assigned_to = NULL WHERE id = ?', {mission.id})
        activeMissions[source] = nil
    end
end)
