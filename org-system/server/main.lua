
ESX = exports['es_extended']:getSharedObject()

-- Sprawdzanie członkostwa w organizacji
function GetPlayerOrganization(source)
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer then return nil end
    
    local result = MySQL.scalar.await('SELECT organization FROM org_members WHERE identifier = ?', {
        xPlayer.identifier
    })
    
    return result
end

-- Pobieranie danych organizacji gracza
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

-- Sprawdzanie uprawnień
function HasPermission(source, permission)
    local orgData = GetPlayerOrgData(source)
    if not orgData then return false end
    
    -- Boss ma wszystkie uprawnienia
    if orgData.org_grade >= 5 then return true end
    
    local gradePerms = Config.Grades[orgData.org_grade].permissions or {}
    for _, perm in pairs(gradePerms) do
        if perm == permission then
            return true
        end
    end
    
    return false
end

-- Tworzenie organizacji (admin)
ESX.RegisterCommand('createorg', 'admin', function(xPlayer, args, showError)
    local orgName = args.name
    local orgLabel = args.label or orgName
    local balance = args.balance or 50000
    local memberSlots = args.slots or 25
    
    if orgName then
        MySQL.insert('INSERT INTO org_organizations (name, label, balance, member_slots) VALUES (?, ?, ?, ?)', {
            orgName, orgLabel, balance, memberSlots
        }, function(insertId)
            if insertId then
                xPlayer.showNotification('Organizacja ' .. orgLabel .. ' została utworzona')
                
                -- Dodaj podstawowe kryptowaluty
                for symbol, _ in pairs(Config.Crypto) do
                    MySQL.insert('INSERT INTO org_crypto_portfolio (organization, crypto_symbol, amount_owned, wallet_address) VALUES (?, ?, ?, ?)', {
                        orgName, symbol, 0.0, GenerateWalletAddress()
                    })
                end
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

-- Dodawanie gracza do organizacji
ESX.RegisterCommand('addtoorg', 'admin', function(xPlayer, args, showError)
    local targetId = args.id
    local orgName = args.organization
    local grade = args.grade or 1
    
    local xTarget = ESX.GetPlayerFromId(targetId)
    if xTarget then
        -- Pobierz numer telefonu z bazy danych
        local phoneNumber = MySQL.scalar.await('SELECT phone_number FROM phone_phones WHERE citizenid = ?', {
            xTarget.identifier
        }) or 'Brak'
        
        MySQL.insert('INSERT INTO org_members (organization, identifier, firstname, lastname, org_grade, phone_number) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE org_grade = VALUES(org_grade)', {
            orgName, xTarget.identifier, xTarget.get('firstName'), xTarget.get('lastName'), grade, phoneNumber
        }, function(insertId)
            if insertId then
                xPlayer.showNotification('Gracz został dodany do organizacji')
                xTarget.showNotification('Zostałeś dodany do organizacji: ' .. orgName)
                
                -- Aktualizuj statystyki organizacji
                UpdateOrgStats(orgName, 'members_added', 1)
            end
        end)
    end
end, false, {help = 'Dodaj gracza do organizacji', validate = true, arguments = {
    {name = 'id', help = 'ID gracza', type = 'number'},
    {name = 'organization', help = 'Nazwa organizacji', type = 'string'},
    {name = 'grade', help = 'Stopień (opcjonalne)', type = 'number'}
}})

-- Funkcja aktualizacji statystyk
function UpdateOrgStats(orgName, statType, value)
    local stats = MySQL.single.await('SELECT stats FROM org_organizations WHERE name = ?', {orgName})
    
    local currentStats = {}
    if stats and stats.stats then
        currentStats = json.decode(stats.stats)
    end
    
    currentStats[statType] = (currentStats[statType] or 0) + value
    
    MySQL.update('UPDATE org_organizations SET stats = ? WHERE name = ?', {
        json.encode(currentStats), orgName
    })
end

-- Generowanie adresu portfela
function GenerateWalletAddress()
    local chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    local address = ''
    for i = 1, 34 do
        local rand = math.random(#chars)
        address = address .. chars:sub(rand, rand)
    end
    return address
end

-- Export funkcji
exports('GetPlayerOrganization', GetPlayerOrganization)
exports('GetPlayerOrgData', GetPlayerOrgData)
exports('HasPermission', HasPermission)
exports('UpdateOrgStats', UpdateOrgStats)

print('^2[ORG-SYSTEM]^7 System organizacji został załadowany')
