
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import HomeScreen from '../components/tablet/HomeScreen';
import FinanceApp from '../components/tablet/apps/FinanceApp';
import MembersApp from '../components/tablet/apps/MembersApp';
import TransactionsApp from '../components/tablet/apps/TransactionsApp';
import OrdersApp from '../components/tablet/apps/OrdersApp';
import SettingsApp from '../components/tablet/apps/SettingsApp';
import StatsApp from '../components/tablet/apps/StatsApp';
import ZleceniaApp from '../components/tablet/apps/ZleceniaApp';
import KryptowalutyApp from '../components/tablet/apps/KryptowalutyApp';
import AppsApp from '../components/tablet/apps/AppsApp';
import NapadyApp from '../components/tablet/apps/NapadyApp';
import NotificationSystem from '../components/tablet/NotificationSystem';

export type AppType = 'home' | 'finance' | 'members' | 'transactions' | 'orders' | 'settings' | 'stats' | 'zlecenia' | 'kryptowaluty' | 'apps' | 'napady';

const TabletOS = () => {
  const [currentApp, setCurrentApp] = useState<AppType>('home');
  const [installedApps, setInstalledApps] = useState<AppType[]>(['finance', 'members', 'transactions', 'orders', 'settings', 'stats', 'apps']);
  const [purchasedApps, setPurchasedApps] = useState<AppType[]>([]);
  
  // TODO: Replace with Lua/SQL integration
  const [orgData, setOrgData] = useState({
    name: 'Ballas',
    rank: 3,
    id: 2,
    balance: 12329713,
    crypto_balance: 15.75
  });

  const openApp = (app: AppType) => {
    setCurrentApp(app);
  };

  const goHome = () => {
    setCurrentApp('home');
  };

  const installApp = (app: AppType) => {
    if (!installedApps.includes(app)) {
      setInstalledApps(prev => [...prev, app]);
    }
  };

  const purchaseApp = (app: AppType, price: number) => {
    if (orgData.crypto_balance >= price && !purchasedApps.includes(app)) {
      setOrgData(prev => ({
        ...prev,
        crypto_balance: prev.crypto_balance - price
      }));
      setPurchasedApps(prev => [...prev, app]);
      return true;
    }
    return false;
  };

  const getRankName = (rankNumber: number) => {
    const ranks = {
      1: 'CZŁONEK',
      2: 'CZŁONEK',
      3: 'STARSZY CZŁONEK',
      4: 'STARSZY CZŁONEK',
      5: 'ZASTĘPCA',
      6: 'ZASTĘPCA',
      7: 'SZEF'
    };
    return ranks[rankNumber as keyof typeof ranks] || 'CZŁONEK';
  };

  const renderCurrentApp = () => {
    switch (currentApp) {
      case 'finance':
        return <FinanceApp orgData={orgData} onHome={goHome} />;
      case 'members':
        return <MembersApp orgData={orgData} onHome={goHome} />;
      case 'transactions':
        return <TransactionsApp orgData={orgData} onHome={goHome} />;
      case 'orders':
        return <OrdersApp orgData={orgData} onHome={goHome} />;
      case 'settings':
        return <SettingsApp orgData={orgData} onHome={goHome} />;
      case 'stats':
        return <StatsApp orgData={orgData} onHome={goHome} />;
      case 'zlecenia':
        return installedApps.includes('zlecenia') ? <ZleceniaApp orgData={orgData} onHome={goHome} /> : <div>App not installed</div>;
      case 'kryptowaluty':
        return installedApps.includes('kryptowaluty') ? <KryptowalutyApp orgData={orgData} onHome={goHome} /> : <div>App not installed</div>;
      case 'apps':
        return <AppsApp orgData={orgData} onHome={goHome} onPurchase={purchaseApp} onInstall={installApp} installedApps={installedApps} purchasedApps={purchasedApps} />;
      case 'napady':
        return installedApps.includes('napady') ? <NapadyApp orgData={orgData} onHome={goHome} /> : <div>App not installed</div>;
      default:
        return <HomeScreen orgData={orgData} onOpenApp={openApp} installedApps={installedApps} />;
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="relative">
        {/* Tablet Frame - Thinner borders */}
        <div className="w-[1024px] h-[768px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-2 shadow-2xl border border-gray-700">
          {/* Screen */}
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-[2rem] overflow-hidden relative border border-gray-800">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 py-3 text-white text-sm bg-black/20 backdrop-blur-sm border-b border-white/5 relative z-30">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="text-xs font-medium text-white/90">
                {new Date().toLocaleTimeString('pl-PL', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
              <div className="flex items-center gap-3">
                <NotificationSystem />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/80">100%</span>
                  <div className="w-6 h-3 border border-white/40 rounded-sm">
                    <div className="w-full h-full bg-green-500 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Back Button */}
            {currentApp !== 'home' && (
              <div className="absolute top-20 left-6 z-40">
                <button
                  onClick={goHome}
                  className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 hover:bg-black/60 transition-all duration-200 shadow-2xl text-white"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
            )}
            
            {/* App Content */}
            <div className="h-[calc(100%-3.5rem)] relative">
              {renderCurrentApp()}
            </div>

            {/* Organization Info Bar - Only on home screen */}
            {currentApp === 'home' && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30">
                <div className="bg-black/60 backdrop-blur-sm rounded-xl px-6 py-2 border border-white/20">
                  <div className="flex items-center gap-4 text-white text-sm">
                    <span className="text-white/60">Organizacja:</span>
                    <span className="font-medium">{orgData.name}</span>
                    <div className="w-px h-4 bg-white/20"></div>
                    <span className="text-blue-400 font-medium">{getRankName(orgData.rank)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Home Button */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
              <button
                onClick={goHome}
                className="w-36 h-1.5 bg-gradient-to-r from-white/60 via-white/90 to-white/60 rounded-full hover:from-white/80 hover:via-white hover:to-white/80 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl"
              >
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabletOS;
