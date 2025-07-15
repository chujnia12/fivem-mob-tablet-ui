
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
  StickyNote,
  MapPin
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
      isDefault: true
    },
    {
      id: 'members' as AppType,
      name: 'Członkowie',
      icon: Users,
      isDefault: true
    },
    {
      id: 'transactions' as AppType,
      name: 'Transakcje',
      icon: FileText,
      isDefault: true
    },
    {
      id: 'orders' as AppType,
      name: 'Zamówienia',
      icon: ShoppingBag,
      isDefault: true
    },
    {
      id: 'stats' as AppType,
      name: 'Statystyki',
      icon: BarChart3,
      isDefault: true
    },
    {
      id: 'settings' as AppType,
      name: 'Ustawienia',
      icon: Settings,
      isDefault: true
    },
    {
      id: 'apps' as AppType,
      name: 'Apps',
      icon: Calculator,
      isDefault: true
    },
    {
      id: 'notes' as AppType,
      name: 'Notatki',
      icon: StickyNote,
      isDefault: true
    },
    {
      id: 'zlecenia' as AppType,
      name: 'Zlecenia',
      icon: Briefcase,
      isDefault: false
    },
    {
      id: 'kryptowaluty' as AppType,
      name: 'Kryptowaluty',
      icon: Bitcoin,
      isDefault: false
    },
    {
      id: 'napady' as AppType,
      name: 'Napady',
      icon: Crosshair,
      isDefault: false
    },
    {
      id: 'tracker' as AppType,
      name: 'Tracker',
      icon: MapPin,
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

      {/* App Grid - Poprawiona siatka */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="grid grid-cols-6 gap-6 max-w-4xl mx-auto">
          {availableApps.map((app) => (
            <div key={app.id} className="flex flex-col items-center group">
              <ContextMenu>
                <ContextMenuTrigger>
                  <button
                    onClick={() => onOpenApp(app.id)}
                    className="w-16 h-16 mb-2 rounded-xl bg-white/5 backdrop-blur-sm shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center border border-white/10 hover:border-white/20 hover:bg-white/10"
                  >
                    <app.icon size={28} className="text-white" />
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
              <span className="text-white text-xs text-center font-medium group-hover:text-blue-400 transition-colors duration-200 max-w-16 truncate">
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
