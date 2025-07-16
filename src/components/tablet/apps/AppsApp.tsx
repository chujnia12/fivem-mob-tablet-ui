
import React, { useState } from 'react';
import { ArrowLeft, Download, Check, Loader2 } from 'lucide-react';
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
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'kryptowaluty',
      name: 'Kryptowaluty',
      description: 'Handel i zarządzanie kryptowalutami',
      price: 100,
      icon: '💰',
      category: 'Finanse',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'napady',
      name: 'Napady',
      description: 'Planowanie i organizacja napadów',
      price: 200,
      icon: '🎭',
      category: 'Operacje',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'tracker',
      name: 'Tracker',
      description: 'Śledzenie pojazdów w mieście',
      price: 75,
      icon: '🚗',
      category: 'Narzędzia',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const cryptoOptions = [
    { id: 'LCOIN', name: 'Liberty Coin', icon: '🏛️', price: 2847.50, color: 'text-yellow-400' },
    { id: 'VCASH', name: 'Vice Cash', icon: '🌴', price: 1542.15, color: 'text-green-400' },
    { id: 'SANCOIN', name: 'San Andreas Coin', icon: '🏔️', price: 567.89, color: 'text-blue-400' },
    { id: 'NCCOIN', name: 'North Coast Coin', icon: '🌊', price: 234.56, color: 'text-cyan-400' },
    { id: 'BULLCOIN', name: 'Bull Coin', icon: '🐂', price: 89.34, color: 'text-orange-400' }
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
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <Button disabled className="w-full bg-blue-600">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Pobieranie...
            </Button>
          </div>
        );
      case 'installed':
        return (
          <Button 
            onClick={() => onOpenApp(app.id)} 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
            className={`w-full ${orgData.crypto_balance >= app.price 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-600 cursor-not-allowed text-gray-400'}`}
          >
            Kup za {app.price} COIN
          </Button>
        );
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onHome}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              App Store
            </h1>
            <p className="text-sm text-gray-400">Sklep z aplikacjami organizacji</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Saldo COIN</div>
          <div className="text-xl font-bold text-yellow-400">{orgData.crypto_balance?.toFixed(2) || '0.00'}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Featured Apps Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Polecane aplikacje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableApps.map((app) => (
              <Card key={app.id} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {app.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white mb-1">{app.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                          {app.category}
                        </Badge>
                      </div>
                    </div>
                    {installedApps.includes(app.id) && (
                      <Badge className="bg-green-600 text-white">
                        <Check className="h-3 w-3 mr-1" />
                        Zainstalowana
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-300 text-sm leading-relaxed">
                    {app.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Cena</div>
                      <div className="text-lg font-bold text-yellow-400">{app.price} COIN</div>
                    </div>
                    <div className="flex-1 ml-4">
                      {renderAppButton(app)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Crypto Market Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Rynek kryptowalut</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptoOptions.map((crypto) => (
              <Card key={crypto.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{crypto.icon}</div>
                      <div>
                        <div className="font-medium text-white">{crypto.name}</div>
                        <div className="text-xs text-gray-400">{crypto.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${crypto.color}`}>${crypto.price.toFixed(2)}</div>
                      <div className="text-xs text-green-400">+2.5%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Installed Apps */}
        {installedApps.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Zainstalowane aplikacje</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {installedApps.map((appId) => {
                const app = availableApps.find(a => a.id === appId);
                if (!app) return null;
                
                return (
                  <Card 
                    key={appId}
                    className="bg-gray-800/30 border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-all duration-200 group"
                    onClick={() => onOpenApp(appId)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                        {app.icon}
                      </div>
                      <div className="text-sm font-medium text-white">{app.name}</div>
                    </CardContent>
                  </Card>
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
