
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
  AlertCircle,
  Star,
  Users,
  Wifi,
  Play
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
  onOpenApp: (app: AppType) => void;
  installedApps: AppType[];
  purchasedApps: AppType[];
}

const AppsApp: React.FC<AppsAppProps> = ({ 
  orgData, 
  onHome, 
  onPurchase, 
  onInstall, 
  onOpenApp,
  installedApps, 
  purchasedApps 
}) => {
  const [downloadingApps, setDownloadingApps] = useState<string[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<{[key: string]: number}>({});

  const availableApps = [
    {
      id: 'zlecenia' as AppType,
      name: 'Zlecenia',
      description: 'Zarządzaj zleceniami organizacji',
      icon: Briefcase,
      price: 2.5,
      color: 'from-red-500 to-red-600',
      category: 'Biznes',
      rating: 4.8,
      size: '12.5 MB'
    },
    {
      id: 'kryptowaluty' as AppType,
      name: 'Kryptowaluty',
      description: 'Handel kryptowalutami',
      icon: Bitcoin,
      price: 3.2,
      color: 'from-yellow-500 to-yellow-600',
      category: 'Finanse',
      rating: 4.6,
      size: '8.2 MB'
    },
    {
      id: 'napady' as AppType,
      name: 'Napady',
      description: 'Planowanie i wykonywanie napadów',
      icon: Crosshair,
      price: 4.8,
      color: 'from-pink-500 to-pink-600',
      category: 'Akcja',
      rating: 4.9,
      size: '15.7 MB'
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
    setDownloadProgress(prev => ({ ...prev, [app]: 0 }));
    
    // Simulate download progress with animation
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setDownloadProgress(prev => ({ ...prev, [app]: i }));
    }
    
    onInstall(app);
    setDownloadingApps(prev => prev.filter(a => a !== app));
    setDownloadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[app];
      return newProgress;
    });
  };

  const getAppStatus = (appId: AppType) => {
    if (installedApps.includes(appId)) return 'installed';
    if (purchasedApps.includes(appId)) return 'purchased';
    if (downloadingApps.includes(appId)) return 'downloading';
    return 'available';
  };

  const renderActionButton = (app: typeof availableApps[0]) => {
    const status = getAppStatus(app.id);
    const progress = downloadProgress[app.id] || 0;
    
    switch (status) {
      case 'installed':
        return (
          <button
            onClick={() => onOpenApp(app.id)}
            className="flex items-center justify-center w-20 h-8 bg-blue-600/80 hover:bg-blue-600 rounded-full transition-colors border border-blue-500/30"
          >
            <Play size={14} className="text-white mr-1" />
            <span className="text-xs font-medium text-white">Otwórz</span>
          </button>
        );
      
      case 'purchased':
        return (
          <button
            onClick={() => handleDownload(app.id)}
            className="flex items-center justify-center w-20 h-8 bg-blue-600/80 hover:bg-blue-600 rounded-full transition-colors border border-blue-500/30"
          >
            <Download size={14} className="text-white mr-1" />
            <span className="text-xs font-medium text-white">Pobierz</span>
          </button>
        );
      
      case 'downloading':
        return (
          <div className="flex flex-col items-center justify-center w-20 h-12">
            <div className="flex items-center justify-center w-20 h-8 bg-white/10 rounded-full border border-white/20 mb-1">
              <div className="relative">
                <Loader size={14} className="animate-spin text-blue-400 mr-1" />
                <div className="absolute inset-0 animate-pulse bg-blue-400/20 rounded-full"></div>
              </div>
              <span className="text-xs font-medium text-white/90">{progress}%</span>
            </div>
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <button
            onClick={() => handlePurchase(app.id, app.price)}
            disabled={orgData.crypto_balance < app.price}
            className={`flex items-center justify-center w-20 h-8 rounded-full transition-colors border ${
              orgData.crypto_balance >= app.price
                ? 'bg-blue-600/80 hover:bg-blue-600 text-white border-blue-500/30'
                : 'bg-white/5 text-white/40 cursor-not-allowed border-white/10'
            }`}
          >
            <span className="text-xs font-medium">
              {orgData.crypto_balance >= app.price ? `${app.price} COIN` : 'Brak środków'}
            </span>
          </button>
        );
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onHome}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-blue-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">App Store</h1>
          </div>
          <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/10">
            <div className="text-center">
              <p className="text-xs text-white/60">Saldo</p>
              <p className="text-sm font-bold text-orange-400">{orgData.crypto_balance.toFixed(2)} COIN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-6 py-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-white/5">
        <h2 className="text-xl font-bold text-white mb-4">Polecane</h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 bg-gradient-to-br ${availableApps[2].color} rounded-3xl flex items-center justify-center shadow-2xl`}>
              <Crosshair size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Napady</h3>
              <p className="text-white/70 mb-3">Planowanie i wykonywanie napadów</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="text-sm text-white/80 ml-1">4.9</span>
                </div>
                <span className="text-white/40">•</span>
                <span className="text-sm text-white/80">Akcja</span>
                <span className="text-white/40">•</span>
                <span className="text-sm text-white/80">15.7 MB</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-400 mb-3">4.8 COIN</p>
              {renderActionButton(availableApps[2])}
            </div>
          </div>
        </div>
      </div>

      {/* Apps List */}
      <div className="flex-1 px-6 py-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-white mb-6">Wszystkie aplikacje</h2>
        <div className="space-y-4">
          {availableApps.map((app) => (
            <div
              key={app.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 hover:border-white/20"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <app.icon size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{app.name}</h3>
                  <p className="text-white/70 mb-3">{app.description}</p>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 fill-current mr-1" />
                      <span>{app.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{app.category}</span>
                    <span>•</span>
                    <span>{app.size}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-400 mb-3">
                    {getAppStatus(app.id) === 'available' ? `${app.price} COIN` : 'Zakupiono'}
                  </p>
                  {renderActionButton(app)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppsApp;
