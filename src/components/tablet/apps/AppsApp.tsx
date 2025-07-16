
import React, { useState } from 'react';
import { ArrowLeft, Download, Check, Loader2, Star } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
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
      screenshots: ['📊', '📈', '📋']
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
      screenshots: ['💹', '📊', '💰']
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
      screenshots: ['🗺️', '🎯', '🎭']
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
      screenshots: ['🗺️', '🚗', '📍']
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
          <div className="space-y-2">
            <div className="w-full bg-white/10 rounded-full h-1">
              <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <Button disabled className="w-full bg-blue-500/20 text-blue-400 border-blue-500/30 text-sm font-medium rounded-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Pobieranie...
            </Button>
          </div>
        );
      case 'installed':
        return (
          <Button 
            onClick={() => onOpenApp(app.id)} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full"
          >
            Otwórz
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Zainstaluj
          </Button>
        );
      default:
        return (
          <Button 
            onClick={() => handlePurchase(app)}
            disabled={orgData.crypto_balance < app.price}
            className={`w-full text-sm font-medium rounded-full ${orgData.crypto_balance >= app.price 
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
      <div className="flex items-center justify-between p-6 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onHome}
            className="text-white hover:bg-white/10 rounded-full w-8 h-8"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">App Store</h1>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
          <div className="text-sm text-white/60">Saldo</div>
          <div className="text-lg font-semibold text-white">{orgData.crypto_balance?.toFixed(2)} COIN</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Today Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Dzisiaj</h2>
          
          {/* Featured App Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{availableApps[0].icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{availableApps[0].name}</h3>
                <p className="text-white/60">{availableApps[0].description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-white/80">{availableApps[0].rating}</span>
                  </div>
                  <span className="text-sm text-white/60">{availableApps[0].downloads} pobrań</span>
                  <Badge className="bg-white/10 text-white/80 text-xs">
                    {availableApps[0].category}
                  </Badge>
                </div>
              </div>
              <div className="w-24">
                {renderAppButton(availableApps[0])}
              </div>
            </div>
            
            {/* Screenshots */}
            <div className="flex gap-3 overflow-x-auto">
              {availableApps[0].screenshots.map((screenshot, index) => (
                <div key={index} className="flex-shrink-0 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/20">
                  {screenshot}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Apps Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Aplikacje</h2>
          <div className="space-y-4">
            {availableApps.map((app) => (
              <div key={app.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-4">
                  {/* App Icon */}
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/20 flex-shrink-0">
                    {app.icon}
                  </div>
                  
                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">{app.name}</h3>
                    <p className="text-white/60 text-sm mb-2 line-clamp-2">{app.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-white/80">{app.rating}</span>
                      </div>
                      <span className="text-xs text-white/60">{app.downloads}</span>
                      <Badge className="bg-white/10 text-white/80 text-xs px-2 py-1">
                        {app.category}
                      </Badge>
                      {installedApps.includes(app.id) && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs px-2 py-1 border border-green-500/30">
                          <Check className="h-3 w-3 mr-1" />
                          Zainstalowana
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="w-20 flex-shrink-0">
                    {renderAppButton(app)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installed Apps Section */}
        {installedApps.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Zainstalowane</h2>
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
