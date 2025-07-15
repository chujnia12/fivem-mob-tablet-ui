
import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit3, Trash2, Users, Search, Pin, PinOff } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { ScrollArea } from '../../ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../../ui/dialog';

interface NotesAppProps {
  orgData: {
    name: string;
  };
  onHome: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isPublic: boolean;
  category: string;
}

const NotesApp: React.FC<NotesAppProps> = ({ orgData, onHome }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Plan na dzisiejszy wieczór',
      content: 'Spotkanie z kontaktami o 20:00. Lokalizacja: parking przy centrum handlowym. Przyniesienie towaru - cocaine 2kg.',
      author: 'Carlos Rodriguez',
      createdAt: '2025-01-15T18:30:00',
      updatedAt: '2025-01-15T19:15:00',
      isPinned: true,
      isPublic: true,
      category: 'operacje'
    },
    {
      id: '2',
      title: 'Nowe terytoria',
      content: 'Obszary do objęcia kontrolą:\n- Grove Street (słaba ochrona)\n- Mirror Park (duży potencjał)\n- Little Seoul (negocjacje z lokalami)',
      author: 'Mike Torres',
      createdAt: '2025-01-14T14:20:00',
      updatedAt: '2025-01-15T12:30:00',
      isPinned: false,
      isPublic: true,
      category: 'strategia'
    },
    {
      id: '3',
      title: 'Lista kontaktów',
      content: 'Ważne numery:\n- Dostawca: 555-0123\n- Prawnik: 555-0456\n- Mechanik: 555-0789\n- Lekarz: 555-0321',
      author: 'Anna Martinez',
      createdAt: '2025-01-13T09:45:00',
      updatedAt: '2025-01-13T09:45:00',
      isPinned: true,
      isPublic: true,
      category: 'kontakty'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'ogólne',
    isPublic: true
  });

  const categories = ['all', 'operacje', 'strategia', 'kontakty', 'finanse', 'ogólne'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Pinned notes first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by updated date
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      author: 'Ty', // In real app, this would be current user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      isPublic: newNote.isPublic,
      category: newNote.category
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', category: 'ogólne', isPublic: true });
    setIsCreating(false);
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;

    setNotes(prev => prev.map(note => 
      note.id === editingNote.id 
        ? { ...editingNote, updatedAt: new Date().toISOString() }
        : note
    ));
    setEditingNote(null);
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, isPinned: !note.isPinned }
        : note
    ));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <div className="flex items-center gap-3">
            <Edit3 className="text-blue-400" size={24} />
            <h1 className="text-xl font-medium">Notatki Organizacji</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
            <Users className="text-green-400" size={16} />
            <span className="text-green-400 text-sm">Widoczne dla wszystkich</span>
          </div>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <Plus size={16} className="mr-2" />
                Nowa notatka
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-white/20 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Nowa notatka</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/80">Tytuł</label>
                  <Input
                    placeholder="Wprowadź tytuł notatki..."
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/80">Kategoria</label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded-md text-white"
                  >
                    <option value="ogólne">Ogólne</option>
                    <option value="operacje">Operacje</option>
                    <option value="strategia">Strategia</option>
                    <option value="kontakty">Kontakty</option>
                    <option value="finanse">Finanse</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/80">Treść</label>
                  <Textarea
                    placeholder="Wprowadź treść notatki..."
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-1 min-h-32"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Anuluj
                </Button>
                <Button 
                  onClick={handleCreateNote}
                  disabled={!newNote.title.trim() || !newNote.content.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Zapisz
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6 space-y-6 h-[calc(100%-5rem)]">
        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <Input
                placeholder="Szukaj notatek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${selectedCategory === category 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-white/20 text-white/80 hover:bg-white/10 bg-transparent'} rounded-xl capitalize`}
              >
                {category === 'all' ? 'Wszystkie' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Notes List */}
        <ScrollArea className="h-[calc(100%-10rem)] [&>div>div]:!block">
          <div className="space-y-4 pr-4">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-white">{note.title}</h3>
                    {note.isPinned && (
                      <Pin size={16} className="text-yellow-400" />
                    )}
                    <div className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 capitalize">
                      {note.category}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTogglePin(note.id)}
                      className="text-white/60 hover:text-yellow-400 hover:bg-white/10"
                    >
                      {note.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                    </Button>
                    
                    <Dialog open={editingNote?.id === note.id} onOpenChange={(open) => !open && setEditingNote(null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingNote(note)}
                          className="text-white/60 hover:text-blue-400 hover:bg-white/10"
                        >
                          <Edit3 size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-white/20 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Edytuj notatkę</DialogTitle>
                        </DialogHeader>
                        {editingNote && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-white/80">Tytuł</label>
                              <Input
                                value={editingNote.title}
                                onChange={(e) => setEditingNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                                className="bg-white/10 border-white/20 text-white mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-white/80">Kategoria</label>
                              <select
                                value={editingNote.category}
                                onChange={(e) => setEditingNote(prev => prev ? { ...prev, category: e.target.value } : null)}
                                className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded-md text-white"
                              >
                                <option value="ogólne">Ogólne</option>
                                <option value="operacje">Operacje</option>
                                <option value="strategia">Strategia</option>
                                <option value="kontakty">Kontakty</option>
                                <option value="finanse">Finanse</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm text-white/80">Treść</label>
                              <Textarea
                                value={editingNote.content}
                                onChange={(e) => setEditingNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                                className="bg-white/10 border-white/20 text-white mt-1 min-h-32"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingNote(null)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Anuluj
                          </Button>
                          <Button 
                            onClick={handleUpdateNote}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Zapisz
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-white/60 hover:text-red-400 hover:bg-white/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <p className="text-white/80 mb-4 whitespace-pre-wrap">{note.content}</p>

                <div className="flex items-center justify-between text-sm text-white/60">
                  <div className="flex items-center gap-4">
                    <span>Autor: {note.author}</span>
                    <span>•</span>
                    <span>Utworzona: {formatDate(note.createdAt)}</span>
                    {note.updatedAt !== note.createdAt && (
                      <>
                        <span>•</span>
                        <span>Zaktualizowana: {formatDate(note.updatedAt)}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-green-400" />
                    <span className="text-green-400">Publiczna</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotes.length === 0 && (
              <div className="text-center py-12">
                <Edit3 className="mx-auto text-white/40 mb-4" size={48} />
                <p className="text-white/60 text-lg mb-2">Brak notatek</p>
                <p className="text-white/40">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Nie znaleziono notatek pasujących do kryteriów wyszukiwania'
                    : 'Utwórz pierwszą notatkę dla swojej organizacji'
                  }
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default NotesApp;
