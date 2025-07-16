
-- Aplikacja notatek - server
RegisterNetEvent('org-tablet:server:notes:getNotes', function()
    local source = source
    local org = GetPlayerOrganization(source)
    
    if org then
        local notes = MySQL.query.await('SELECT * FROM org_notes WHERE organization = ? ORDER BY is_pinned DESC, updated_at DESC', {org})
        TriggerClientEvent('org-tablet:client:notes:receiveNotes', source, notes)
    end
end)

RegisterNetEvent('org-tablet:server:notes:saveNote', function(noteData)
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    local org = GetPlayerOrganization(source)
    
    if org then
        if noteData.id then
            -- Aktualizuj istniejącą notatkę
            MySQL.update('UPDATE org_notes SET title = ?, content = ?, is_pinned = ?, updated_at = NOW() WHERE id = ? AND organization = ?', {
                noteData.title, noteData.content, noteData.is_pinned or 0, noteData.id, org
            })
        else
            -- Utwórz nową notatkę
            MySQL.insert('INSERT INTO org_notes (organization, identifier, title, content, is_pinned) VALUES (?, ?, ?, ?, ?)', {
                org, xPlayer.identifier, noteData.title, noteData.content, noteData.is_pinned or 0
            })
        end
        
        TriggerClientEvent('org-tablet:client:notes:success', source, 'Notatka została zapisana')
        TriggerServerEvent('org-tablet:server:notes:getNotes')
    end
end)

RegisterNetEvent('org-tablet:server:notes:deleteNote', function(noteId)
    local source = source
    local org = GetPlayerOrganization(source)
    
    if org then
        MySQL.update('DELETE FROM org_notes WHERE id = ? AND organization = ?', {noteId, org})
        TriggerClientEvent('org-tablet:client:notes:success', source, 'Notatka została usunięta')
        TriggerServerEvent('org-tablet:server:notes:getNotes')
    end
end)
