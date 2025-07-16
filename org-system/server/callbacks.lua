
ESX = exports['es_extended']:getSharedObject()

-- Sprawdzanie członkostwa w organizacji
ESX.RegisterServerCallback('org-system:checkMembership', function(source, cb)
    local org = exports['org-system']:GetPlayerOrganization(source)
    cb(org ~= nil)
end)

-- Sprawdzanie członkostwa w konkretnej organizacji
ESX.RegisterServerCallback('org-system:checkOrgMembership', function(source, cb, orgName)
    local playerOrg = exports['org-system']:GetPlayerOrganization(source)
    cb(playerOrg == orgName)
end)

-- Sprawdzanie czy gracz jest szefem
ESX.RegisterServerCallback('org-system:isBoss', function(source, cb, orgName)
    local orgData = exports['org-system']:GetPlayerOrgData(source)
    cb(orgData and orgData.org_grade >= 5 and orgData.organization == orgName)
end)

-- Pobieranie pojazdów organizacji
ESX.RegisterServerCallback('org-system:getOrgVehicles', function(source, cb, orgName)
    local vehicles = MySQL.query.await('SELECT * FROM org_vehicles WHERE organization = ?', {orgName})
    cb(vehicles)
end)
