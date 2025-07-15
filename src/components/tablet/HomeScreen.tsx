
import React from 'react';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  ShoppingBag, 
  Settings, 
  BarChart3,
  Clock,
  Battery,
  Wifi
} from 'lucide-react';
import { AppType } from '../../pages/TabletOS';

interface HomeScreenProps {
  orgData: {
    name: string;
    rank: number;
    id: number;
    balance: number;
  };
  onOpenApp: (app: AppType) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ orgData, onOpenApp }) => {
  const currentTime = new Date().toLocaleTimeString('pl-PL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const apps = [
    { id: 'finance', name: 'Finanse', icon: DollarSign, color: 'bg-green-600' },
    { id: 'members', name: 'Członkowie', icon: Users, color: 'bg-blue-600' },
    { id: 'transactions', name: 'Transakcje', icon: CreditCard, color: 'bg-purple-600' },
    { id: 'orders', name: 'Zamówienia', icon: ShoppingBag, color: 'bg-orange-600' },
    { id: 'stats', name: 'Statystyki', icon: BarChart3, color: 'bg-indigo-600' },
    { id: 'settings', name: 'Ustawienia', icon: Settings, color: 'bg-gray-600' },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 relative">
      {/* Wallpaper with city background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200')] bg-cover bg-center opacity-30"></div>
      
      {/* Top Status */}
      <div className="relative z-10 flex justify-between items-center px-8 py-4 text-white">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span className="text-lg font-semibold">{currentTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi size={16} />
          <Battery size={16} />
          <span className="text-green-400">100%</span>
        </div>
      </div>

      {/* Organization Info Widget */}
      <div className="relative z-10 mx-8 mt-8 bg-black/70 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Panel Zarządzania Organizacją</h2>
          <p className="text-gray-300 mb-4">Zarządzaj swoją organizacją w jednym miejscu</p>
          <div className="bg-red-600/20 border border-red-500 rounded-lg p-4">
            <div className="text-red-400 text-sm mb-1">Saldo Organizacji</div>
            <div className="text-3xl font-bold text-white">
              ${orgData.balance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="relative z-10 px-8 mt-8">
        <div className="grid grid-cols-3 gap-6">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id as AppType)}
              className="group"
            >
              <div className={`${app.color} w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 mx-auto mb-2`}>
                <app.icon size={32} className="text-white" />
              </div>
              <div className="text-white text-sm font-medium text-center">
                {app.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Dock */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-3">
        <div className="flex items-center gap-4 text-white text-sm">
          <div className="text-red-400">●</div>
          <span>Organizacja {orgData.name}</span>
          <div className="w-px h-4 bg-gray-600"></div>
          <span>Ranga: {orgData.rank}</span>
          <div className="w-px h-4 bg-gray-600"></div>
          <span>ID: {orgData.id}</span>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
