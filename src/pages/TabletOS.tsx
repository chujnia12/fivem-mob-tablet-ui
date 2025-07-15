
import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2 } from 'lucide-react';
import HomeScreen from '../components/tablet/HomeScreen';
import NotificationSystem from '../components/tablet/NotificationSystem';
import AppsApp from '../components/tablet/apps/AppsApp';
import FinanceApp from '../components/tablet/apps/FinanceApp';
import MembersApp from '../components/tablet/apps/MembersApp';
import NapadyApp from '../components/tablet/apps/NapadyApp';
import NotesApp from '../components/tablet/apps/NotesApp';
import SettingsApp from '../components/tablet/apps/SettingsApp';
import StatsApp from '../components/tablet/apps/StatsApp';
import TransactionsApp from '../components/tablet/apps/TransactionsApp';
import ZleceniaApp from '../components/tablet/apps/ZleceniaApp';
import OrdersApp from '../components/tablet/apps/OrdersApp';
import KryptowalutyApp from '../components/tablet/apps/KryptowalutyApp';
import TrackerApp from '../components/tablet/apps/TrackerApp';

export type AppType = 'apps' | 'finance' | 'members' | 'napady' | 'notes' | 'settings' | 'stats' | 'transactions' | 'zlecenia' | 'orders' | 'kryptowaluty' | 'tracker';

interface OrgData {
  name: string;
  rank: number;
  id: number;
  balance: number;
  crypto_balance: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

const TabletOS = () => {
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [orgData, setOrgData] = useState<OrgData>({
    name: "Los Santos Mafia",
    rank: 1,
    id: 12345,
    balance: 1500000,
    crypto_balance: 25.47
  });
  const [installedApps, setInstalledApps] = useState<AppType[]>([
    'apps', 'finance', 'members', 'napady', 'notes', 'settings', 
    'stats', 'transactions', 'zlecenia', 'orders', 'kryptowaluty'
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nowy napad dostępny',
      message: 'Bank w centrum miasta - 500,000$',
      time: new Date(Date.now() - 300000).toISOString(),
      type: 'info' as const,
      read: false
    }
  ]);

  const purchaseApp = (appId: AppType, price: number): boolean => {
    if (orgData.crypto_balance >= price) {
      setOrgData(prev => ({
        ...prev,
        crypto_balance: prev.crypto_balance - price
      }));
      setInstalledApps(prev => [...prev, appId]);
      
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: 'Aplikacja zakupiona',
        message: `Pomyślnie zakupiono aplikację`,
        time: new Date().toISOString(),
        type: 'success' as const,
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      return true;
    }
    return false;
  };

  const handlePurchase = (price: number): boolean => {
    if (orgData.crypto_balance >= price) {
      setOrgData(prev => ({
        ...prev,
        crypto_balance: prev.crypto_balance - price
      }));
      return true;
    }
    return false;
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderApp = () => {
    const commonProps = {
      orgData,
      onHome: () => setCurrentApp(null)
    };

    switch (currentApp) {
      case 'apps':
        return <AppsApp {...commonProps} installedApps={installedApps} onPurchase={purchaseApp} onInstall={(app) => setInstalledApps(prev => [...prev, app])} onOpenApp={setCurrentApp} purchasedApps={installedApps} />;
      case 'finance':
        return <FinanceApp {...commonProps} />;
      case 'members':
        return <MembersApp {...commonProps} />;
      case 'napady':
        return <NapadyApp {...commonProps} />;
      case 'notes':
        return <NotesApp {...commonProps} />;
      case 'settings':
        return <SettingsApp {...commonProps} />;
      case 'stats':
        return <StatsApp {...commonProps} />;
      case 'transactions':
        return <TransactionsApp {...commonProps} />;
      case 'zlecenia':
        return <ZleceniaApp {...commonProps} />;
      case 'orders':
        return <OrdersApp {...commonProps} />;
      case 'kryptowaluty':
        return <KryptowalutyApp {...commonProps} />;
      case 'tracker':
        return <TrackerApp {...commonProps} onPurchase={handlePurchase} />;
      default:
        return (
          <HomeScreen 
            orgData={orgData}
            onOpenApp={setCurrentApp}
            installedApps={installedApps}
          />
        );
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl aspect-[4/3] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-4 text-white/80">
            <span className="text-sm font-medium">{formatDate(currentTime)}</span>
          </div>
          
          <div className="flex items-center gap-4 text-white/80">
            <span className="text-sm font-medium">{formatTime(currentTime)}</span>
            <div className="flex items-center gap-2">
              <Wifi size={16} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full h-full pt-12">
          {renderApp()}
        </div>

        {/* Notification System */}
        <NotificationSystem 
          notifications={notifications.map(n => ({
            id: n.id,
            type: n.type as 'success' | 'warning' | 'info' | 'error',
            title: n.title,
            message: n.message,
            timestamp: new Date(n.time),
            read: n.read
          }))}
          onNotificationRead={(id) => {
            setNotifications(prev => 
              prev.map(notif => 
                notif.id === id ? { ...notif, read: true } : notif
              )
            );
          }}
        />
      </div>
    </div>
  );
};

export default TabletOS;
