
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, Edit, Trash2, Save } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${orgData.id}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [orgData.id]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(`notes_${orgData.id}`, JSON.stringify(notes));
  }, [notes, orgData.id]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'Nowa notatka',
      content: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
  };

  const deleteNote = (noteId: number) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const saveNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.map(note =>
        note.id === selectedNote.id
          ? { ...note, title: editTitle, content: editContent, updated_at: new Date().toISOString() }
          : note
      );
      setNotes(updatedNotes);
      setSelectedNote({ ...selectedNote, title: editTitle, content: editContent });
      setIsEditing(false);
    }
  };

  const startEditing = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onHome}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-medium">Notatki</h1>
        </div>
        <Button 
          onClick={createNewNote}
          className="bg-blue-600 hover:bg-blue-700 text-white border-0"
        >
          <Plus size={16} className="mr-2" />
          Nowa notatka
        </Button>
      </div>

      <div className="flex h-[calc(100%-5rem)]">
        {/* Sidebar with notes list */}
        <div className="w-80 border-r border-white/10 bg-black/20">
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Szukaj notatek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Notes list */}
          <div className="overflow-y-auto custom-scrollbar" style={{ height: 'calc(100% - 5rem)' }}>
            {filteredNotes.length === 0 ? (
              <div className="p-4 text-center text-white/60">
                {searchTerm ? 'Brak notatek spełniających kryteria' : 'Brak notatek'}
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${
                    selectedNote?.id === note.id ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{note.title}</h3>
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">{note.content || 'Brak treści'}</p>
                      <p className="text-xs text-white/40 mt-2">
                        {new Date(note.updated_at).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <>
              {/* Note header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-xl font-medium bg-transparent border-0 p-0 text-white focus:ring-0 focus:outline-none"
                    />
                  ) : (
                    <h2 className="text-xl font-medium text-white">{selectedNote.title}</h2>
                  )}
                  <p className="text-sm text-white/60 mt-1">
                    Ostatnia edycja: {new Date(selectedNote.updated_at).toLocaleString('pl-PL')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <Button onClick={saveNote} className="bg-green-600 hover:bg-green-700 text-white border-0">
                      <Save size={16} className="mr-2" />
                      Zapisz
                    </Button>
                  ) : (
                    <Button onClick={() => startEditing(selectedNote)} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                      <Edit size={16} className="mr-2" />
                      Edytuj
                    </Button>
                  )}
                </div>
              </div>

              {/* Note content */}
              <div className="flex-1 p-6">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Wprowadź treść notatki..."
                    className="w-full h-full bg-transparent border-0 text-white placeholder:text-white/40 resize-none focus:ring-0 focus:outline-none custom-scrollbar"
                  />
                ) : (
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap text-white/90 font-sans">
                      {selectedNote.content || 'Brak treści'}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white/60">
                <h3 className="text-lg font-medium mb-2">Wybierz notatkę</h3>
                <p>Wybierz notatkę z listy lub utwórz nową</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
