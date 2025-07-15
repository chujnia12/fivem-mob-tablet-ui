
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Briefcase, 
  Bitcoin, 
  Crosshair, 
  ShoppingCart,
  CheckCircle,
  Loader,
  AlertCircle
} from 'lucide-react';
import { AppType } from '../../../pages/TabletOS';

interface AppsAppProps {
  orgData: {
    name: string;
    rank: number;
    id: number;
    balance: number;
    crypto_balance: number;
  };
  onHome: () => void;
  onPurchase: (app: AppType, price: number) => boolean;
  onInstall: (app: AppType) => void;
  installedApps: AppType[];
  purchasedApps: AppType[];
}

const AppsApp: React.FC<AppsAppProps> = ({ 
  orgData, 
  onHome, 
  onPurchase, 
  onInstall, 
  installedApps, 
  purchasedApps 
}) => {
  const [downloadingApps, setDownloadingApps] = useState<string[]>([]);

  const availableApps = [
    {
      id: 'zlecenia' as AppType,
      name: 'Zlecenia',
      description: 'Zarządzaj zleceniami organizacji',
      icon: Briefcase,
      price: 2.5,
      color: 'bg-red-600'
    },
    {
      id: 'kryptowaluty' as AppType,
      name: 'Kryptowaluty',
      description: 'Handel kryptowalutami',
      icon: Bitcoin,
      price: 3.2,
      color: 'bg-yellow-600'
    },
    {
      id: 'napady' as AppType,
      name: 'Napady',
      description: 'Planowanie i wykonywanie napadów',
      icon: Crosshair,
      price: 4.8,
      color: 'bg-pink-600'
    },
  ];

  const handlePurchase = (app: AppType, price: number) => {
    const success = onPurchase(app, price);
    if (!success) {
      alert('Niewystarczające środki!');
    }
  };

  const handleDownload = async (app: AppType) => {
    setDownloadingApps(prev => [...prev, app]);
    
    // Simulate download time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onInstall(app);
    setDownloadingApps(prev => prev.filter(a => a !== app));
  };

  const getAppStatus = (appId: AppType) => {
    if (installedApps.includes(appId)) return 'installed';
    if (purchasedApps.includes(appId)) return 'purchased';
    if (downloadingApps.includes(appId)) return 'downloading';
    return 'available';
  };

  const renderActionButton = (app: typeof availableApps[0]) => {
    const status = getAppStatus(app.id);
    
    switch (status) {
      case 'installed':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-xl text-green-400">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Zainstalowana</span>
          </div>
        );
      
      case 'purchased':
        return (
          <button
            onClick={() => handleDownload(app.id)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Pobierz</span>
          </button>
        );
      
      case 'downloading':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400">
            <Loader size={16} className="animate-spin" />
            <span className="text-sm font-medium">Pobieranie...</span>
          </div>
        );
      
      default:
        return (
          <button
            onClick={() => handlePurchase(app.id, app.price)}
            disabled={orgData.crypto_balance < app.price}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              orgData.crypto_balance >= app.price
                ? 'bg-orange-600/20 border border-orange-500/30 text-orange-400 hover:bg-orange-600/30'
                : 'bg-gray-600/20 border border-gray-500/30 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={16} />
            <span>Kup za {app.price} COIN</span>
            {orgData.crypto_balance < app.price && <AlertCircle size={14} />}
          </button>
        );
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Sklep z aplikacjami</h1>
              <p className="text-white/60">Rozszerz funkcjonalność swojego tabletu</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
              <div className="text-center">
                <p className="text-white/60 text-sm">Saldo krypto</p>
                <p className="text-yellow-400 font-bold text-xl">{orgData.crypto_balance.toFixed(2)} COIN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-6">
            {availableApps.map((app) => {
              const status = getAppStatus(app.id);
              return (
                <div
                  key={app.id}
                  className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-black/60 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center`}>
                        <app.icon size={28} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{app.name}</h3>
                        <p className="text-white/60 text-sm">{app.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-yellow-400 font-bold">
                            {status === 'available' ? `${app.price} COIN` : 'Zakupiono'}
                          </span>
                          {status === 'installed' && (
                            <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded-full">
                              Zainstalowana
                            </span>
                          )}
                          {status === 'purchased' && (
                            <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded-full">
                              Gotowa do pobrania
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {renderActionButton(app)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info section */}
          <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-blue-400 mb-3">Informacje o zakupach</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>• Aplikacje kupujesz za kryptowaluty COIN</p>
              <p>• Po zakupie możesz pobrać aplikację w dowolnym momencie</p>
              <p>• Zainstalowane aplikacje są dostępne na ekranie głównym</p>
              <p>• Zakupione aplikacje są przypisane do Twojej organizacji</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppsApp;
