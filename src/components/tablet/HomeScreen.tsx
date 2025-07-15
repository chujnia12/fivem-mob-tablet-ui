
import React from 'react';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  ShoppingBag, 
  Settings, 
  BarChart3,
  Grid3X3
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
  // Domyślnie dostępne aplikacje
  const defaultApps = [
    { id: 'finance', name: 'Finanse', icon: DollarSign, color: 'bg-green-600' },
    { id: 'members', name: 'Członkowie', icon: Users, color: 'bg-blue-600' },
    { id: 'transactions', name: 'Transakcje', icon: CreditCard, color: 'bg-purple-600' },
    { id: 'orders', name: 'Zamówienia', icon: ShoppingBag, color: 'bg-orange-600' },
    { id: 'stats', name: 'Statystyki', icon: BarChart3, color: 'bg-indigo-600' },
    { id: 'settings', name: 'Ustawienia', icon: Settings, color: 'bg-gray-600' },
    { id: 'apps', name: 'Apps', icon: Grid3X3, color: 'bg-cyan-600' },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Dark minimalist background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-purple-900/10"></div>
      
      {/* Apps Grid - iPad style */}
      <div className="relative z-10 p-12 h-full flex flex-col justify-center">
        <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto">
          {defaultApps.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id as AppType)}
              className="group flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white/20 transition-all duration-200 mb-3 border border-white/20">
                <app.icon size={28} className="text-white" />
              </div>
              <div className="text-white text-xs font-medium text-center opacity-90">
                {app.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
