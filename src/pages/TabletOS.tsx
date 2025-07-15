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
  
  // TODO: Replace with database integration
  // Fetch from addon_account_data table for balance
  // Fetch from jobs table for organization data
  const [orgData] = useState({
    name: 'Ballas',
    rank: 3,
    id: 2,
    balance: 12329713 // TODO: Sync with addon_account_data
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="relative">
        {/* Tablet Frame - iPad-like design */}
        <div className="w-[1024px] h-[768px] bg-gray-800 rounded-[3rem] p-3 shadow-2xl border border-gray-700">
          {/* Screen */}
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] overflow-hidden relative">
            {/* Status Bar - iPad style */}
            <div className="flex justify-between items-center px-6 py-3 text-white text-sm bg-black/10">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="text-xs font-medium">
                {new Date().toLocaleTimeString('pl-PL', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">100%</span>
                <div className="w-6 h-3 border border-white/50 rounded-sm">
                  <div className="w-full h-full bg-green-500 rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* App Content */}
            <div className="h-[calc(100%-3rem)]">
              {renderCurrentApp()}
            </div>
          </div>
        </div>
        
        {/* Home Button - iPad style */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={goHome}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-100 transition-all duration-200 border-2 border-gray-300"
          >
            <div className="w-4 h-4 bg-black rounded-full"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabletOS;