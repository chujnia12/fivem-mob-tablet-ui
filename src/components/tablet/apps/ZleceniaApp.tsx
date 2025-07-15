
import React, { useState } from 'react';
import { ArrowLeft, FileText, Clock, DollarSign, Star, User, MapPin, Calendar, Filter, Search } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';

interface ZleceniaAppProps {
  orgData: {
    name: string;
  };
  onHome: () => void;
}

const ZleceniaApp: React.FC<ZleceniaAppProps> = ({ orgData, onHome }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: Fetch from database - zlecenia table
  const zlecenia = [
    {
      id: 'ZL001',
      title: 'Kradzież samochodu premium',
      description: 'Ukraść luksusowy pojazd z dzielnicy Vinewood',
      reward: 25000,
      difficulty: 'Średnia',
      location: 'Vinewood Hills',
      timeLimit: '2 dni',
      status: 'available',
      requirements: 'Minimum ranga: CZŁONEK',
      type: 'theft',
      estimatedTime: '45 min'
    },
    {
      id: 'ZL002',
      title: 'Napad na sklep jubilerski',
      description: 'Obrabować sklep jubilerski na Rodeo Drive',
      reward: 45000,
      difficulty: 'Wysoka',
      location: 'Rodeo Drive',
      timeLimit: '1 dzień',
      status: 'in_progress',
      requirements: 'Minimum ranga: STARSZY CZŁONEK',
      type: 'robbery',
      estimatedTime: '1.5h'
    },
    {
      id: 'ZL003',
      title: 'Transport nielegalnych towarów',
      description: 'Przewieź ładunek z portu do magazynu',
      reward: 15000,
      difficulty: 'Łatwa',
      location: 'Port Los Santos',
      timeLimit: '3 dni',
      status: 'available',
      requirements: 'Minimum ranga: CZŁONEK',
      type: 'transport',
      estimatedTime: '30 min'
    },
    {
      id: 'ZL004',
      title: 'Eliminacja rywala',
      description: 'Usuń konkurencyjnego dilera z naszego terenu',
      reward: 75000,
      difficulty: 'Bardzo wysoka',
      location: 'Grove Street',
      timeLimit: '12 godzin',
      status: 'completed',
      requirements: 'Minimum ranga: ZASTĘPCA',
      type: 'elimination',
      estimatedTime: '2h'
    },
    {
      id: 'ZL005',
      title: 'Ochrona ważnego spotkania',
      description: 'Zapewnij bezpieczeństwo podczas negocjacji',
      reward: 30000,
      difficulty: 'Średnia',
      location: 'Maze Bank Tower',
      timeLimit: '6 godzin',
      status: 'available',
      requirements: 'Minimum ranga: STARSZY CZŁONEK',
      type: 'protection',
      estimatedTime: '3h'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'in_progress': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'completed': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Dostępne';
      case 'in_progress': return 'W trakcie';
      case 'completed': return 'Ukończone';
      default: return 'Nieznany';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Łatwa': return 'text-green-400';
      case 'Średnia': return 'text-yellow-400';
      case 'Wysoka': return 'text-orange-400';
      case 'Bardzo wysoka': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredZlecenia = zlecenia.filter(zlecenie => {
    const matchesSearch = zlecenie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zlecenie.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || zlecenie.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

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
            <FileText className="text-red-400" size={24} />
            <h1 className="text-xl font-medium">Zlecenia Organizacji</h1>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
          <span className="text-white/60 text-sm">Aktywne zlecenia: </span>
          <span className="text-white font-medium">{zlecenia.filter(z => z.status === 'available').length}</span>
        </div>
      </div>

      <div className="flex h-[calc(100%-5rem)]">
        <div className="flex-1 p-6 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <Input
                  placeholder="Szukaj zleceń..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {[
                { id: 'all', name: 'Wszystkie' },
                { id: 'available', name: 'Dostępne' },
                { id: 'in_progress', name: 'W trakcie' },
                { id: 'completed', name: 'Ukończone' }
              ].map((filter) => (
                <Button
                  key={filter.id}
                  size="sm"
                  variant={selectedFilter === filter.id ? "default" : "outline"}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`${selectedFilter === filter.id 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'border-white/20 text-white/80 hover:bg-white/10 bg-transparent'} rounded-xl`}
                >
                  {filter.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Zlecenia List */}
          <ScrollArea className="h-[calc(100%-8rem)] rounded-2xl">
            <div className="space-y-4 pr-4">
              {filteredZlecenia.map((zlecenie) => (
                <div key={zlecenie.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-white">{zlecenie.title}</h3>
                        <div className={`px-3 py-1 rounded-xl text-xs font-medium border ${getStatusColor(zlecenie.status)}`}>
                          {getStatusText(zlecenie.status)}
                        </div>
                      </div>
                      <p className="text-white/70 mb-3">{zlecenie.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign size={14} className="text-green-400" />
                          <span className="text-green-400 font-medium">${zlecenie.reward.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Star size={14} className={getDifficultyColor(zlecenie.difficulty)} />
                          <span className={getDifficultyColor(zlecenie.difficulty)}>{zlecenie.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="text-blue-400" />
                          <span className="text-white/80">{zlecenie.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-orange-400" />
                          <span className="text-white/80">{zlecenie.estimatedTime}</span>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <User size={14} className="text-purple-400" />
                          <span className="text-purple-400 font-medium">Wymagania:</span>
                        </div>
                        <p className="text-white/70 text-sm">{zlecenie.requirements}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-red-400" />
                          <span className="text-red-400">Limit czasu: {zlecenie.timeLimit}</span>
                        </div>
                        
                        {zlecenie.status === 'available' && (
                          <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                            PRZYJMIJ ZLECENIE
                          </Button>
                        )}
                        
                        {zlecenie.status === 'in_progress' && (
                          <Button variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 rounded-xl">
                            KONTYNUUJ
                          </Button>
                        )}
                        
                        {zlecenie.status === 'completed' && (
                          <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-xl">
                            SZCZEGÓŁY
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Stats Panel */}
        <div className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/10">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-medium mb-4">Statystyki Zleceń</h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {zlecenia.filter(z => z.status === 'available').length}
                  </div>
                  <div className="text-white/60 text-sm">Dostępne zlecenia</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {zlecenia.filter(z => z.status === 'in_progress').length}
                  </div>
                  <div className="text-white/60 text-sm">W trakcie realizacji</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {zlecenia.filter(z => z.status === 'completed').length}
                  </div>
                  <div className="text-white/60 text-sm">Ukończone</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    ${zlecenia.filter(z => z.status === 'completed').reduce((sum, z) => sum + z.reward, 0).toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Łączne zarobki</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Typy zleceń</h4>
                {['theft', 'robbery', 'transport', 'elimination', 'protection'].map((type) => {
                  const count = zlecenia.filter(z => z.type === type).length;
                  const typeNames = {
                    theft: 'Kradzieże',
                    robbery: 'Napady',
                    transport: 'Transport',
                    elimination: 'Eliminacje',
                    protection: 'Ochrona'
                  };
                  
                  return (
                    <div key={type} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-sm">{typeNames[type as keyof typeof typeNames]}</span>
                      <span className="text-white/80 font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ZleceniaApp;
