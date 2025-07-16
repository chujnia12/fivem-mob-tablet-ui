
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
      category: 'Biznes'
    },
    {
      id: 'kryptowaluty',
      name: 'Kryptowaluty',
      description: 'Handel i zarządzanie kryptowalutami',
      price: 100,
      icon: '💰',
      category: 'Finanse'
    },
    {
      id: 'napady',
      name: 'Napady',
      description: 'Planowanie i organizacja napadów',
      price: 200,
      icon: '🎭',
      category: 'Operacje'
    },
    {
      id: 'tracker',
      name: 'Tracker',
      description: 'Śledzenie pojazdów w mieście',
      price: 75,
      icon: '🚗',
      category: 'Narzędzia'
    }
  ];

  const handlePurchase = (app: any) => {
    if (onPurchase(app.id, app.price)) {
      // Symulacja pobierania
      setDownloadingApps(prev => [...prev, app.id]);
      
      setTimeout(() => {
        setDownloadingApps(prev => prev.filter(id => id !== app.id));
        onInstall(app.id);
      }, 3000); // 3 sekundy pobierania
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
          <Button disabled className="w-full">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Pobieranie...
          </Button>
        );
      case 'installed':
        return (
          <Button 
            onClick={() => onOpenApp(app.id)} 
            className="w-full bg-green-600 hover:bg-green-700"
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
            className="w-full bg-blue-600 hover:bg-blue-700"
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
            className="w-full"
          >
            Kup za ${app.price}
          </Button>
        );
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onHome}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">App Store</h1>
        </div>
        <div className="text-sm text-gray-400">
          Saldo Krypto: ${orgData.crypto_balance?.toFixed(2) || '0.00'}
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableApps.map((app) => (
          <Card key={app.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{app.icon}</div>
                  <div>
                    <CardTitle className="text-lg text-white">{app.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {app.category}
                    </Badge>
                  </div>
                </div>
                {installedApps.includes(app.id) && (
                  <Badge className="bg-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    Zainstalowana
                  </Badge>
                )}
                {downloadingApps.includes(app.id) && (
                  <Badge className="bg-blue-600">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Pobieranie
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                {app.description}
              </CardDescription>
              
              {downloadingApps.includes(app.id) && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-100 animate-pulse"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              )}
              
              {renderAppButton(app)}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Installed Apps Section */}
      {installedApps.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Zainstalowane aplikacje</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {installedApps.map((appId) => {
              const app = availableApps.find(a => a.id === appId);
              if (!app) return null;
              
              return (
                <Card 
                  key={appId}
                  className="bg-gray-800/30 border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-all duration-200"
                  onClick={() => onOpenApp(appId)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{app.icon}</div>
                    <div className="text-sm font-medium text-white">{app.name}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppsApp;
