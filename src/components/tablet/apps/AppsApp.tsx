
import React, { useState } from 'react';
import { ArrowLeft, Download, Check, Loader2, Star } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface AppsAppProps {
  orgData: any;
  onHome: () => void;
  onPurchase: (app: string, price: number) => boolean;
  onInstall: (app: string) => void;
  onOpenApp: (app: string) => void;
  installedApps: string[];
  purchasedApps: string[];
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

  const availableApps = [
    {
      id: 'zlecenia',
      name: 'Zlecenia',
      description: 'System zarządzania zleceniami organizacji',
      price: 50,
      icon: '📋',
      category: 'Biznes',
      rating: 4.8,
      downloads: '12K+',
      size: '24.5 MB'
    },
    {
      id: 'kryptowaluty',
      name: 'Kryptowaluty',
      description: 'Handel i zarządzanie kryptowalutami',
      price: 100,
      icon: '💰',
      category: 'Finanse',
      rating: 4.9,
      downloads: '8.5K+',
      size: '18.2 MB'
    },
    {
      id: 'napady',
      name: 'Napady',
      description: 'Planowanie i organizacja napadów',
      price: 200,
      icon: '🎭',
      category: 'Operacje',
      rating: 4.7,
      downloads: '5.2K+',
      size: '31.8 MB'
    },
    {
      id: 'tracker',
      name: 'Tracker',
      description: 'Śledzenie pojazdów w mieście',
      price: 75,
      icon: '🚗',
      category: 'Narzędzia',
      rating: 4.6,
      downloads: '3.1K+',
      size: '12.4 MB'
    }
  ];

  const handlePurchase = (app: any) => {
    if (onPurchase(app.id, app.price)) {
      setDownloadingApps(prev => [...prev, app.id]);
      
      setTimeout(() => {
        setDownloadingApps(prev => prev.filter(id => id !== app.id));
        onInstall(app.id);
      }, 3000);
    }
  };

  const getAppStatus = (app: any) => {
    if (downloadingApps.includes(app.id)) {
      return 'downloading';
    }
    if (installedApps.includes(app.id)) {
      return 'installed';
    }
    if (purchasedApps.includes(app.id)) {
      return 'purchased';
    }
    return 'available';
  };

  const renderAppButton = (app: any) => {
    const status = getAppStatus(app);
    
    switch (status) {
      case 'downloading':
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <Button disabled className="w-16 h-7 text-xs bg-white/10 text-white/60 border-white/20 rounded-full">
              <Loader2 className="h-3 w-3 animate-spin" />
            </Button>
          </div>
        );
      case 'installed':
        return (
          <Button 
            onClick={() => onOpenApp(app.id)} 
            className="w-16 h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full"
          >
            OTWÓRZ
          </Button>
        );
      case 'purchased':
        return (
          <Button 
            onClick={() => {
              setDownloadingApps(prev => [...prev, app.id]);
              setTimeout(() => {
                setDownloadingApps(prev => prev.filter(id => id !== app.id));
                onInstall(app.id);
              }, 2000);
            }}
            className="w-16 h-7 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          >
            <Download className="h-3 w-3 mr-1" />
            POBIERZ
          </Button>
        );
      default:
        return (
          <Button 
            onClick={() => handlePurchase(app)}
            disabled={orgData.crypto_balance < app.price}
            className={`w-16 h-7 text-xs rounded-full ${orgData.crypto_balance >= app.price 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/20'}`}
          >
            {app.price} COIN
          </Button>
        );
    }
  };

  return (
    <div className="h-full bg-black/95 backdrop-blur-xl text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onHome}
            className="text-blue-400 hover:bg-white/10 rounded-full w-8 h-8"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-white">App Store</h1>
          </div>
        </div>
        <div className="text-blue-400 text-sm font-medium">
          {orgData.crypto_balance?.toFixed(0)} COIN
        </div>
      </div>

      {/* Apps List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-6 py-4">
          <div className="space-y-0">
            {availableApps.map((app, index) => (
              <div key={app.id} className={`flex items-center py-3 ${index !== availableApps.length - 1 ? 'border-b border-white/10' : ''}`}>
                {/* App Icon */}
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mr-4 flex-shrink-0 border border-white/20">
                  {app.icon}
                </div>
                
                {/* App Info */}
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-medium text-white truncate">{app.name}</h3>
                    {installedApps.includes(app.id) && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs px-2 py-0 border border-green-500/30">
                        Zainstalowana
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-white/60 mb-2 line-clamp-1">{app.description}</p>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{app.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{app.category}</span>
                    <span>•</span>
                    <span>{app.size}</span>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="flex-shrink-0">
                  {renderAppButton(app)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installed Apps Section */}
        {installedApps.length > 0 && (
          <div className="px-6 py-4 border-t border-white/10">
            <h2 className="text-lg font-semibold mb-4 text-white">Zainstalowane</h2>
            <div className="grid grid-cols-4 gap-4">
              {installedApps.map((appId) => {
                const app = availableApps.find(a => a.id === appId);
                if (!app) return null;
                
                return (
                  <div 
                    key={appId}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200 text-center"
                    onClick={() => onOpenApp(appId)}
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 border border-white/20">
                      {app.icon}
                    </div>
                    <div className="text-sm font-medium text-white truncate">{app.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppsApp;
