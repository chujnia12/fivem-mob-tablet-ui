
import React, { useState } from 'react';
import { 
  Calculator, 
  FileText, 
  Users, 
  CreditCard, 
  Settings, 
  BarChart3, 
  Briefcase, 
  Bitcoin, 
  Crosshair, 
  ShoppingBag,
  StickyNote
} from 'lucide-react';
import { AppType } from '../../pages/TabletOS';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../ui/context-menu';

interface HomeScreenProps {
  orgData: {
    name: string;
    rank: number;
    id: number;
    balance: number;
    crypto_balance: number;
  };
  onOpenApp: (app: AppType) => void;
  installedApps: AppType[];
  onUninstallApp?: (app: AppType) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ orgData, onOpenApp, installedApps, onUninstallApp }) => {
  const apps = [
    {
      id: 'finance' as AppType,
      name: 'Finanse',
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      isDefault: true
    },
    {
      id: 'members' as AppType,
      name: 'Członkowie',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      isDefault: true
    },
    {
      id: 'transactions' as AppType,
      name: 'Transakcje',
      icon: FileText,
      color: 'from-yellow-500 to-yellow-600',
      isDefault: true
    },
    {
      id: 'orders' as AppType,
      name: 'Zamówienia',
      icon: ShoppingBag,
      color: 'from-purple-500 to-purple-600',
      isDefault: true
    },
    {
      id: 'stats' as AppType,
      name: 'Statystyki',
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      isDefault: true
    },
    {
      id: 'settings' as AppType,
      name: 'Ustawienia',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      isDefault: true
    },
    {
      id: 'apps' as AppType,
      name: 'Apps',
      icon: Calculator,
      color: 'from-cyan-500 to-cyan-600',
      isDefault: true
    },
    {
      id: 'notes' as AppType,
      name: 'Notatki',
      icon: StickyNote,
      color: 'from-amber-500 to-amber-600',
      isDefault: true
    },
    {
      id: 'zlecenia' as AppType,
      name: 'Zlecenia',
      icon: Briefcase,
      color: 'from-red-500 to-red-600',
      isDefault: false
    },
    {
      id: 'kryptowaluty' as AppType,
      name: 'Kryptowaluty',
      icon: Bitcoin,
      color: 'from-yellow-500 to-yellow-600',
      isDefault: false
    },
    {
      id: 'napady' as AppType,
      name: 'Napady',
      icon: Crosshair,
      color: 'from-pink-500 to-pink-600',
      isDefault: false
    }
  ];

  const availableApps = apps.filter(app => installedApps.includes(app.id));

  const handleUninstall = (appId: AppType) => {
    if (onUninstallApp) {
      onUninstallApp(appId);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black p-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-white/10 rounded"></div>
          ))}
        </div>
      </div>

      {/* App Grid */}
      <div className="relative z-10 h-full">
        <div className="grid grid-cols-4 gap-8 justify-items-center items-start pt-16">
          {availableApps.map((app) => (
            <div key={app.id} className="flex flex-col items-center group">
              <ContextMenu>
                <ContextMenuTrigger>
                  <button
                    onClick={() => onOpenApp(app.id)}
                    className={`w-20 h-20 mb-3 rounded-2xl bg-gradient-to-br ${app.color} shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center border border-white/10 hover:border-white/20`}
                  >
                    <app.icon size={32} className="text-white" />
                  </button>
                </ContextMenuTrigger>
                {!app.isDefault && (
                  <ContextMenuContent className="bg-black/90 backdrop-blur-sm border-white/20">
                    <ContextMenuItem 
                      onClick={() => handleUninstall(app.id)}
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      Usuń
                    </ContextMenuItem>
                  </ContextMenuContent>
                )}
              </ContextMenu>
              <span className="text-white text-sm text-center font-medium group-hover:text-blue-400 transition-colors duration-200">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
