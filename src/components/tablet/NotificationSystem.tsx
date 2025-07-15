import React, { useState, useEffect } from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Info, Skull } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Kontrakt ukończony',
      message: 'Otrzymano 5.2 LCOIN za eliminację rywala',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Nowe zlecenie',
      message: 'Dostępny napad na bank - nagroda 15.8 VCASH',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Niski stan portfela',
      message: 'Saldo SANCOIN spadło poniżej 10 monet',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      read: true
    },
    {
      id: '4',
      type: 'error',
      title: 'Misja nieudana',
      message: 'Kontrakt "Sabotaż Rywala" zakończony niepowodzeniem',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: false
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  // Symulacja nowych powiadomień
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% szansy co 10 sekund
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['success', 'info', 'warning'][Math.floor(Math.random() * 3)] as any,
          title: [
            'Nowe zlecenie dostępne',
            'Członek dołączył do organizacji',
            'Transakcja krypto potwierdzona',
            'Aktualizacja terytoriów'
          ][Math.floor(Math.random() * 4)],
          message: 'Nowe powiadomienie otrzymane',
          timestamp: new Date(),
          read: false
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        
        // Pokaż toast dla ważnych powiadomień
        if (newNotification.type === 'success' || newNotification.type === 'error') {
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.type === 'error' ? 'destructive' : 'default',
          });
          
          // Odtwórz dźwięk dzwoneczka
          try {
            const audio = new Audio();
            audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuU2O/HeB4F';
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignoruj błędy odtwarzania
          } catch (e) {}
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [toast]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      case 'error': return Skull;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'warning': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'info': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'error': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Teraz';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return timestamp.toLocaleDateString('pl-PL');
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 hover:bg-black/60 transition-all duration-200 shadow-2xl"
      >
        <Bell size={20} className="text-white" />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute top-full right-0 mt-3 w-96 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium text-lg">Powiadomienia</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            {unreadCount > 0 && (
              <p className="text-white/60 text-sm mt-1">{unreadCount} nieprzeczytanych</p>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-white/60">
                <Bell size={32} className="mx-auto mb-3 opacity-50" />
                <p>Brak powiadomień</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:bg-white/5 ${
                        notification.read ? 'opacity-60' : 'shadow-lg'
                      } ${getNotificationColor(notification.type)}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={18} className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium text-sm">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-white/40 hover:text-white/80 p-1 hover:bg-white/10 rounded"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          <p className="text-white/80 text-sm mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <span className="text-white/40 text-xs">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10 bg-gradient-to-r from-gray-900/40 to-black/40">
              <div className="flex gap-2">
                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="flex-1 text-xs text-white/60 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                >
                  Oznacz jako przeczytane
                </button>
                <button
                  onClick={() => setNotifications([])}
                  className="flex-1 text-xs text-white/60 hover:text-red-400 transition-colors py-2 px-3 rounded-lg hover:bg-red-500/10"
                >
                  Wyczyść wszystkie
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
