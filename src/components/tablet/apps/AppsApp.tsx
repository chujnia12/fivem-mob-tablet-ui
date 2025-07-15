
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
  Users
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
      color: 'bg-red-600',
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
      color: 'bg-yellow-600',
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
      color: 'bg-pink-600',
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
          <div className="flex items-center justify-center w-20 h-8 bg-gray-100 rounded-full">
            <CheckCircle size={14} className="text-green-600 mr-1" />
            <span className="text-xs font-medium text-gray-700">Otwórz</span>
          </div>
        );
      
      case 'purchased':
        return (
          <button
            onClick={() => handleDownload(app.id)}
            className="flex items-center justify-center w-20 h-8 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          >
            <Download size={14} className="text-white mr-1" />
            <span className="text-xs font-medium text-white">Pobierz</span>
          </button>
        );
      
      case 'downloading':
        return (
          <div className="flex items-center justify-center w-20 h-8 bg-gray-100 rounded-full">
            <Loader size={14} className="animate-spin text-blue-600 mr-1" />
            <span className="text-xs font-medium text-gray-700">Pobieranie</span>
          </div>
        );
      
      default:
        return (
          <button
            onClick={() => handlePurchase(app.id, app.price)}
            disabled={orgData.crypto_balance < app.price}
            className={`flex items-center justify-center w-20 h-8 rounded-full transition-colors ${
              orgData.crypto_balance >= app.price
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onHome}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-blue-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">App Store</h1>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2">
            <div className="text-center">
              <p className="text-xs text-gray-500">Saldo</p>
              <p className="text-sm font-bold text-orange-600">{orgData.crypto_balance.toFixed(2)} COIN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-4 py-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Polecane</h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Crosshair size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Napady</h3>
              <p className="text-sm text-gray-600">Planowanie i wykonywanie napadów</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600 ml-1">4.9</span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600">Akcja</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">4.8 COIN</p>
              {renderActionButton(availableApps[2])}
            </div>
          </div>
        </div>
      </div>

      {/* Apps List */}
      <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Wszystkie aplikacje</h2>
        <div className="space-y-4">
          {availableApps.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <app.icon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{app.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{app.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Star size={12} className="text-yellow-500 fill-current mr-1" />
                      <span>{app.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{app.category}</span>
                    <span>•</span>
                    <span>{app.size}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600 mb-2">
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
