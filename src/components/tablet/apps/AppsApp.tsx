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
  Play,
  MapPin
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
      category: 'Biznes',
      rating: 4.8,
      size: '12.5 MB',
      screenshots: 3
    },
    {
      id: 'kryptowaluty' as AppType,
      name: 'Kryptowaluty',
      description: 'Handel kryptowalutami',
      icon: Bitcoin,
      price: 3.2,
      category: 'Finanse',
      rating: 4.6,
      size: '8.2 MB',
      screenshots: 4
    },
    {
      id: 'napady' as AppType,
      name: 'Napady',
      description: 'Planowanie i wykonywanie napadów',
      icon: Crosshair,
      price: 4.8,
      category: 'Akcja',
      rating: 4.9,
      size: '15.7 MB',
      screenshots: 5
    },
    {
      id: 'tracker' as AppType,
      name: 'Tracker',
      description: 'Śledź lokalizacje pojazdów do kradzieży',
      icon: MapPin,
      price: 6.5,
      category: 'Narzędzia',
      rating: 4.7,
      size: '11.3 MB',
      screenshots: 4
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
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-500/30 text-blue-400 text-sm font-medium backdrop-blur-sm"
          >
            Otwórz
          </button>
        );
      
      case 'purchased':
        return (
          <button
            onClick={() => handleDownload(app.id)}
            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors border border-green-500/30 text-green-400 text-sm font-medium backdrop-blur-sm"
          >
            Pobierz
          </button>
        );
      
      case 'downloading':
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center px-4 py-2 bg-white/5 rounded-lg border border-white/20 mb-2">
              <Loader size={16} className="animate-spin text-blue-400 mr-2" />
              <span className="text-sm font-medium text-white/90">{progress}%</span>
            </div>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <button
            onClick={() => handlePurchase(app.id, app.price)}
            disabled={orgData.crypto_balance < app.price}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium backdrop-blur-sm border ${
              orgData.crypto_balance >= app.price
                ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/30'
                : 'bg-white/5 text-white/40 cursor-not-allowed border-white/10'
            }`}
          >
            {orgData.crypto_balance >= app.price ? `${app.price} COIN` : 'Brak środków'}
          </button>
        );
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-white/10 px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onHome}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-blue-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">App Store</h1>
            <p className="text-xs text-white/60">Odkryj i pobierz aplikacje</p>
          </div>
          <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/10 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-xs text-white/60">Saldo</p>
              <p className="text-sm font-bold text-orange-400">{orgData.crypto_balance.toFixed(2)} COIN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="flex-1 px-6 py-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          {availableApps.map((app) => (
            <div
              key={app.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 hover:border-white/20"
            >
              {/* App Icon and Basic Info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                  <app.icon size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white mb-1 truncate">{app.name}</h3>
                  <p className="text-xs text-white/60 mb-1">{app.category}</p>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <div className="flex items-center">
                      <Star size={10} className="text-yellow-400 fill-current mr-1" />
                      <span>{app.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{app.size}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-white/70 mb-4 line-clamp-2">{app.description}</p>

              {/* Screenshots Indicator */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: app.screenshots }).map((_, i) => (
                  <div key={i} className="w-8 h-6 bg-white/10 rounded border border-white/20"></div>
                ))}
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-bold text-orange-400">
                    {getAppStatus(app.id) === 'available' ? `${app.price} COIN` : 'Zakupiono'}
                  </p>
                </div>
                {renderActionButton(app)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppsApp;
