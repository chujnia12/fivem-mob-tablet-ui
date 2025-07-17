
-- Funkcje obsługi bazy danych dla systemu tabletu

-- Pobieranie danych organizacji
function GetOrganizationData(orgName)
    return MySQL.single.await('SELECT * FROM org_organizations WHERE name = ?', {orgName})
end

-- Pobieranie członków organizacji
function GetOrganizationMembers(orgName)
    return MySQL.query.await([[
        SELECT om.*, u.firstname, u.lastname 
        FROM org_members om 
        LEFT JOIN users u ON om.identifier = u.identifier 
        WHERE om.organization = ?
    ]], {orgName})
end

-- Pobieranie transakcji organizacji
function GetOrganizationTransactions(orgName, limit)
    limit = limit or 50
    return MySQL.query.await([[
        SELECT ot.*, u.firstname, u.lastname 
        FROM org_transactions ot 
        LEFT JOIN users u ON ot.identifier = u.identifier 
        WHERE ot.organization = ? 
        ORDER BY ot.created_at DESC 
        LIMIT ?
    ]], {orgName, limit})
end

-- Pobieranie notatek organizacji
function GetOrganizationNotes(orgName)
    return MySQL.query.await([[
        SELECT on.*, u.firstname, u.lastname 
        FROM org_notes on 
        LEFT JOIN users u ON on.identifier = u.identifier 
        WHERE on.organization = ? 
        ORDER BY on.is_pinned DESC, on.created_at DESC
    ]], {orgName})
end

-- Pobieranie zleceń organizacji
function GetOrganizationJobs(orgName)
    return MySQL.query.await([[
        SELECT oj.*, 
               u1.firstname as creator_firstname, u1.lastname as creator_lastname,
               u2.firstname as assigned_firstname, u2.lastname as assigned_lastname
        FROM org_jobs oj 
        LEFT JOIN users u1 ON oj.created_by = u1.identifier 
        LEFT JOIN users u2 ON oj.assigned_to = u2.identifier 
        WHERE oj.organization = ? 
        ORDER BY oj.created_at DESC
    ]], {orgName})
end

-- Export funkcji
exports('GetOrganizationData', GetOrganizationData)
exports('GetOrganizationMembers', GetOrganizationMembers)
exports('GetOrganizationTransactions', GetOrganizationTransactions)
exports('GetOrganizationNotes', GetOrganizationNotes)
exports('GetOrganizationJobs', GetOrganizationJobs)

print('^2[ORG-TABLET-DB]^7 Funkcje bazy danych zostały załadowane')
