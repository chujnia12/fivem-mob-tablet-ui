
import React, { useState } from 'react';
import { X } from 'lucide-react';
import HomeScreen from '../components/tablet/HomeScreen';
import FinanceApp from '../components/tablet/apps/FinanceApp';
import MembersApp from '../components/tablet/apps/MembersApp';
import TransactionsApp from '../components/tablet/apps/TransactionsApp';
import OrdersApp from '../components/tablet/apps/OrdersApp';
import SettingsApp from '../components/tablet/apps/SettingsApp';
import StatsApp from '../components/tablet/apps/StatsApp';

export type AppType = 'home' | 'finance' | 'members' | 'transactions' | 'orders' | 'settings' | 'stats';

const TabletOS = () => {
  const [currentApp, setCurrentApp] = useState<AppType>('home');
  const [orgData] = useState({
    name: 'Ballas',
    rank: 3,
    id: 2,
    balance: 12329713
  });

  const openApp = (app: AppType) => {
    setCurrentApp(app);
  };

  const goHome = () => {
    setCurrentApp('home');
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
      default:
        return <HomeScreen orgData={orgData} onOpenApp={openApp} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="relative">
        {/* Tablet Frame */}
        <div className="w-[1024px] h-[768px] bg-black rounded-[3rem] p-6 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-slate-900 rounded-[2rem] overflow-hidden relative">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 py-2 bg-black/50 text-white text-sm">
              <div className="flex items-center gap-2">
                <div className="text-red-500 font-semibold">Organizacja</div>
                <div className="text-white font-bold">{orgData.name}</div>
              </div>
              <div className="flex items-center gap-4">
                <div>Ranga: {orgData.rank}</div>
                <div>ID: {orgData.id}</div>
                <div className="text-green-500">●</div>
              </div>
            </div>
            
            {/* App Content */}
            <div className="h-[calc(100%-2rem)]">
              {renderCurrentApp()}
            </div>
          </div>
        </div>
        
        {/* Home Button */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <button
            onClick={goHome}
            className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabletOS;
