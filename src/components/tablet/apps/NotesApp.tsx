
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, Edit3, Trash2, Save, X } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  org_id: number;
}

interface NotesAppProps {
  orgData: {
    name: string;
    rank: number;
    id: number;
    balance: number;
    crypto_balance: number;
  };
  onHome: () => void;
}

const NotesApp: React.FC<NotesAppProps> = ({ orgData, onHome }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // TODO: Replace with actual database calls
  useEffect(() => {
    // Simulate loading notes from database
    const mockNotes: Note[] = [
      {
        id: '1',
        title: 'Spotkanie zespołu',
        content: 'Omówić nowe zadania i cele na następny tydzień.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        org_id: orgData.id
      },
      {
        id: '2',
        title: 'Lista zakupów',
        content: 'Broń, amunicja, pojazdy, sprzęt elektroniczny.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        org_id: orgData.id
      }
    ];
    setNotes(mockNotes);
  }, [orgData.id]);

  const handleCreateNote = () => {
    setIsCreating(true);
    setEditTitle('');
    setEditContent('');
    setSelectedNote(null);
  };

  const handleSaveNote = () => {
    if (!editTitle.trim() && !editContent.trim()) return;

    const now = new Date().toISOString();
    
    if (selectedNote) {
      // Update existing note
      const updatedNote: Note = {
        ...selectedNote,
        title: editTitle || 'Bez tytułu',
        content: editContent,
        updated_at: now
      };
      
      setNotes(prev => prev.map(note => 
        note.id === selectedNote.id ? updatedNote : note
      ));
      setSelectedNote(updatedNote);
      
      // TODO: Update in database
      console.log('SQL Update:', {
        query: 'UPDATE org_notes SET title = ?, content = ?, updated_at = ? WHERE id = ? AND org_id = ?',
        params: [updatedNote.title, updatedNote.content, updatedNote.updated_at, updatedNote.id, orgData.id]
      });
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: editTitle || 'Bez tytułu',
        content: editContent,
        created_at: now,
        updated_at: now,
        org_id: orgData.id
      };
      
      setNotes(prev => [newNote, ...prev]);
      setSelectedNote(newNote);
      
      // TODO: Insert into database
      console.log('SQL Insert:', {
        query: 'INSERT INTO org_notes (id, title, content, created_at, updated_at, org_id) VALUES (?, ?, ?, ?, ?, ?)',
        params: [newNote.id, newNote.title, newNote.content, newNote.created_at, newNote.updated_at, newNote.org_id]
      });
    }
    
    setIsCreating(false);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
    
    // TODO: Delete from database
    console.log('SQL Delete:', {
      query: 'DELETE FROM org_notes WHERE id = ? AND org_id = ?',
      params: [noteId, orgData.id]
    });
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsCreating(false);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full bg-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onHome}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Notatki</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj notatek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleCreateNote}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Edit3 size={32} className="mx-auto mb-2 opacity-50" />
              <p>Brak notatek</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? 'bg-blue-100 border-l-4 border-blue-500'
                      : 'hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatDate(note.updated_at)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote || isCreating ? (
          <>
            {/* Editor Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 size={20} className="text-gray-600" />
                <span className="text-sm text-gray-600">
                  {selectedNote ? 'Edytuj notatkę' : 'Nowa notatka'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedNote(null);
                    setIsCreating(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={handleSaveNote}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Save size={16} />
                  Zapisz
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-4 flex flex-col">
              <input
                type="text"
                placeholder="Tytuł notatki..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-2xl font-bold text-gray-900 mb-4 p-2 border-none outline-none focus:bg-gray-50 rounded"
              />
              <textarea
                placeholder="Napisz swoją notatkę..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="flex-1 p-2 border-none outline-none resize-none focus:bg-gray-50 rounded text-gray-700 leading-relaxed"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Edit3 size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Wybierz notatkę do edycji</p>
              <p className="text-sm">lub utwórz nową notatkę</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;
