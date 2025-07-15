
import React, { useState } from 'react';
import { ArrowLeft, Grid3X3, Download, Star, Search, Filter, Smartphone, Users, DollarSign, Shield } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';

interface AppsAppProps {
  orgData: {
    name: string;
  };
  onHome: () => void;
}

const AppsApp: React.FC<AppsAppProps> = ({ orgData, onHome }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: Fetch from database - available_apps table
  const availableApps = [
    {
      id: 'secure-comm',
      name: 'SecureComm',
      description: 'Szyfrowana komunikacja między członkami organizacji',
      category: 'communication',
      rating: 4.8,
      downloads: 15420,
      price: 0,
      installed: false,
      icon: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      developer: 'CrimeTech Solutions',
      size: '12.4 MB'
    },
    {
      id: 'territory-map',
      name: 'Territory Mapper',
      description: 'Mapa terytoriów z oznaczeniem wpływów organizacji',
      category: 'tools',
      rating: 4.6,
      downloads: 8930,
      price: 2500,
      installed: true,
      icon: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69ed03?w=100&h=100&fit=crop',
      developer: 'Underground Maps',
      size: '28.7 MB'
    },
    {
      id: 'crypto-wallet',
      name: 'CryptoVault Pro',
      description: 'Zaawansowany portfel kryptowalut z funkcjami prania',
      category: 'finance',
      rating: 4.9,
      downloads: 23450,
      price: 5000,
      installed: false,
      icon: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop',
      developer: 'Anonymous Finance',
      size: '45.2 MB'
    },
    {
      id: 'member-tracker',
      name: 'Gang Tracker',
      description: 'Śledzenie lokalizacji i aktywności członków',
      category: 'management',
      rating: 4.2,
      downloads: 6780,
      price: 1500,
      installed: true,
      icon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
      developer: 'Surveillance Systems',
      size: '19.8 MB'
    },
    {
      id: 'heist-planner',
      name: 'Heist Planner Pro',
      description: 'Planowanie i koordynacja skomplikowanych operacji',
      category: 'tools',
      rating: 4.7,
      downloads: 12340,
      price: 7500,
      installed: false,
      icon: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
      developer: 'Criminal Masterminds',
      size: '67.3 MB'
    },
    {
      id: 'police-scanner',
      name: 'Police Scanner Plus',
      description: 'Monitorowanie częstotliwości policyjnych i służb',
      category: 'security',
      rating: 4.4,
      downloads: 18670,
      price: 3000,
      installed: false,
      icon: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=100&h=100&fit=crop',
      developer: 'Radio Interceptors',
      size: '23.1 MB'
    },
    {
      id: 'money-laundry',
      name: 'Clean Cash',
      description: 'Automatyczne pranie pieniędzy przez legalne biznesy',
      category: 'finance',
      rating: 4.3,
      downloads: 9450,
      price: 10000,
      installed: true,
      icon: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=100&fit=crop',
      developer: 'Laundry Solutions Inc.',
      size: '34.6 MB'
    },
    {
      id: 'anonymous-chat',
      name: 'GhostChat',
      description: 'Anonimowa komunikacja z autodestruct wiadomości',
      category: 'communication',
      rating: 4.9,
      downloads: 34560,
      price: 0,
      installed: false,
      icon: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=100&h=100&fit=crop',
      developer: 'Phantom Communications',
      size: '8.2 MB'
    }
  ];

  const categories = [
    { id: 'all', name: 'Wszystkie', icon: Grid3X3 },
    { id: 'communication', name: 'Komunikacja', icon: Smartphone },
    { id: 'finance', name: 'Finanse', icon: DollarSign },
    { id: 'management', name: 'Zarządzanie', icon: Users },
    { id: 'tools', name: 'Narzędzia', icon: Grid3X3 },
    { id: 'security', name: 'Bezpieczeństwo', icon: Shield }
  ];

  const filteredApps = availableApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const installedCount = availableApps.filter(app => app.installed).length;

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
            <Grid3X3 className="text-cyan-400" size={24} />
            <h1 className="text-xl font-medium">Sklep z Aplikacjami</h1>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
          <span className="text-white/60 text-sm">Zainstalowane: </span>
          <span className="text-cyan-400 font-medium">{installedCount}</span>
        </div>
      </div>

      <div className="flex h-[calc(100%-5rem)]">
        {/* Categories Sidebar */}
        <div className="w-64 bg-white/5 backdrop-blur-sm border-r border-white/10">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Kategorie</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <category.icon size={18} className="text-cyan-400" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Search */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <Input
                placeholder="Szukaj aplikacji..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
              />
            </div>
          </div>

          {/* Apps Grid */}
          <ScrollArea className="h-[calc(100%-8rem)] rounded-2xl">
            <div className="grid grid-cols-2 gap-4 pr-4">
              {filteredApps.map((app) => (
                <div key={app.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={app.icon}
                      alt={app.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white">{app.name}</h3>
                        {app.installed && (
                          <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg font-medium">
                            ZAINSTALOWANA
                          </div>
                        )}
                      </div>
                      <p className="text-white/60 text-sm mb-2">{app.developer}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-current" />
                          <span className="text-white/80">{app.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download size={12} className="text-white/60" />
                          <span className="text-white/60">{app.downloads.toLocaleString()}</span>
                        </div>
                        <div className="text-white/60">{app.size}</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {app.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">
                      {app.price === 0 ? (
                        <span className="text-green-400">DARMOWA</span>
                      ) : (
                        <span className="text-yellow-400">${app.price.toLocaleString()}</span>
                      )}
                    </div>

                    {app.installed ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl"
                        >
                          USUŃ
                        </Button>
                        <Button
                          size="sm"
                          className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl"
                        >
                          OTWÓRZ
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl"
                      >
                        {app.price === 0 ? 'POBIERZ' : 'KUP'}
                      </Button>
                    )}
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
              <h3 className="text-lg font-medium mb-4">Statystyki Sklepu</h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {availableApps.length}
                  </div>
                  <div className="text-white/60 text-sm">Dostępne aplikacje</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {installedCount}
                  </div>
                  <div className="text-white/60 text-sm">Zainstalowane</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    ${availableApps.filter(app => app.installed && app.price > 0).reduce((sum, app) => sum + app.price, 0).toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Wydano na aplikacje</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {availableApps.filter(app => app.price === 0).length}
                  </div>
                  <div className="text-white/60 text-sm">Darmowe aplikacje</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Popularne kategorie</h4>
                {categories.slice(1).map((category) => {
                  const count = availableApps.filter(app => app.category === category.id).length;
                  return (
                    <div key={category.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <category.icon size={16} className="text-cyan-400" />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-white/80 font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Najlepiej oceniane</h4>
                {availableApps
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 3)
                  .map((app) => (
                    <div key={app.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{app.name}</div>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-current" />
                          <span className="text-white/60 text-xs">{app.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AppsApp;
