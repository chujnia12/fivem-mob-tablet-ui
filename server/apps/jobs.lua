
-- Aplikacja zleceń - server
RegisterNetEvent('org-tablet:server:jobs:getJobs', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if org then
        local jobs = MySQL.query.await('SELECT * FROM org_jobs WHERE organization = ? ORDER BY created_at DESC', {org})
        TriggerClientEvent('org-tablet:client:jobs:receiveJobs', source, jobs)
    end
end)

RegisterNetEvent('org-tablet:server:jobs:createJob', function(jobData)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if not org or not HasPermission(source, 'manage_jobs') then
        return
    end
    
    MySQL.insert('INSERT INTO org_jobs (organization, title, description, job_type, priority, reward, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)', {
        org, jobData.title, jobData.description, jobData.job_type, jobData.priority, jobData.reward, xPlayer.identifier
    })
    
    TriggerClientEvent('org-tablet:client:jobs:success', source, 'Zlecenie zostało utworzone')
    TriggerServerEvent('org-tablet:server:jobs:getJobs')
end)

RegisterNetEvent('org-tablet:server:jobs:acceptJob', function(jobId)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if org then
        MySQL.update('UPDATE org_jobs SET assigned_to = ?, status = "assigned" WHERE id = ? AND organization = ?', {
            xPlayer.identifier, jobId, org
        })
        
        TriggerClientEvent('org-tablet:client:jobs:success', source, 'Zlecenie zostało przyjęte')
        TriggerServerEvent('org-tablet:server:jobs:getJobs')
    end
end)

RegisterNetEvent('org-tablet:server:jobs:completeJob', function(jobId)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if org then
        local job = MySQL.single.await('SELECT * FROM org_jobs WHERE id = ? AND organization = ? AND assigned_to = ?', {
            jobId, org, xPlayer.identifier
        })
        
        if job then
            -- Oznacz jako ukończone
            MySQL.update('UPDATE org_jobs SET status = "completed" WHERE id = ?', {jobId})
            
            -- Dodaj nagrodę do salda organizacji
            MySQL.update('UPDATE org_organizations SET balance = balance + ? WHERE name = ?', {job.reward, org})
            
            -- Zapisz transakcję
            MySQL.insert('INSERT INTO org_transactions (organization, identifier, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)', {
                org, xPlayer.identifier, 'income', 'job_reward', job.reward, 'Nagroda za zlecenie: ' .. job.title
            })
            
            TriggerClientEvent('org-tablet:client:jobs:success', source, 'Zlecenie ukończone! Otrzymano $' .. job.reward)
            TriggerServerEvent('org-tablet:server:jobs:getJobs')
            TriggerServerEvent('org-tablet:server:getOrgData')
        end
    end
end)
