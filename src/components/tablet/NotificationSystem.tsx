
import React, { useState, useEffect, useRef } from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Info, Skull, Eye } from 'lucide-react';

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
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [inAppNotification, setInAppNotification] = useState<Notification | null>(null);
  const inAppTimeoutRef = useRef<NodeJS.Timeout>();

  // iPhone-style notification sound
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const createComplexBellTone = () => {
        const now = audioContext.currentTime;
        
        // Main bell tone
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        osc1.frequency.setValueAtTime(800, now);
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        // Higher harmonic
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.setValueAtTime(1200, now);
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.15, now + 0.01);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        // Second chime
        const osc3 = audioContext.createOscillator();
        const gain3 = audioContext.createGain();
        osc3.connect(gain3);
        gain3.connect(audioContext.destination);
        osc3.frequency.setValueAtTime(1000, now + 0.15);
        osc3.type = 'sine';
        gain3.gain.setValueAtTime(0, now + 0.15);
        gain3.gain.linearRampToValueAtTime(0.2, now + 0.16);
        gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc1.start(now);
        osc1.stop(now + 0.4);
        osc2.start(now);
        osc2.stop(now + 0.3);
        osc3.start(now + 0.15);
        osc3.stop(now + 0.5);
      };
      
      createComplexBellTone();
      
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
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
        
        // Show in-app notification for 4 seconds
        setInAppNotification(newNotification);
        playNotificationSound();
        
        if (inAppTimeoutRef.current) {
          clearTimeout(inAppTimeoutRef.current);
        }
        
        inAppTimeoutRef.current = setTimeout(() => {
          setInAppNotification(null);
        }, 4000);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      if (inAppTimeoutRef.current) {
        clearTimeout(inAppTimeoutRef.current);
      }
    };
  }, []);

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
  const latestNotification = notifications[0];

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
    <>
      {/* In-app notification banner */}
      {inAppNotification && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-[10000] animate-fade-in">
          <div className={`p-3 rounded-xl border backdrop-blur-md shadow-2xl max-w-sm ${getNotificationColor(inAppNotification.type)}`}>
            <div className="flex items-start gap-3">
              {React.createElement(getNotificationIcon(inAppNotification.type), { size: 16, className: "mt-0.5 flex-shrink-0" })}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm mb-1">
                  {inAppNotification.title}
                </h4>
                <p className="text-white/80 text-xs leading-relaxed">
                  {inAppNotification.message}
                </p>
              </div>
              <button
                onClick={() => setInAppNotification(null)}
                className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Notification Bell */}
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowAllNotifications(false);
          }}
          className="relative p-1 hover:bg-white/10 rounded transition-all duration-200 text-white"
        >
          <Bell size={16} className="text-white/80" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px] animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="fixed top-16 right-6 w-80 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-[10001]">
            <div className="p-3 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-sm">
                  {showAllNotifications ? 'Wszystkie powiadomienia' : 'Najnowsze powiadomienie'}
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              {unreadCount > 0 && !showAllNotifications && (
                <p className="text-white/60 text-xs mt-1">{unreadCount} nieprzeczytanych</p>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-white/60">
                  <Bell size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Brak powiadomień</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {showAllNotifications ? notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-white/5 relative ${
                          notification.read ? 'opacity-60' : 'shadow-lg'
                        } ${getNotificationColor(notification.type)}`}
                        onClick={() => {
                          markAsRead(notification.id);
                          removeNotification(notification.id);
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <Icon size={14} className="mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-white font-medium text-xs">
                                {notification.title}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="text-white/40 hover:text-white/80 p-0.5 hover:bg-white/10 rounded"
                              >
                                <X size={10} />
                              </button>
                            </div>
                            <p className="text-white/80 text-xs mb-1 leading-relaxed">
                              {notification.message}
                            </p>
                            <span className="text-white/40 text-[10px]">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                    );
                  }) : latestNotification && (
                    <div className="p-2">
                      <div
                        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-white/5 relative ${
                          latestNotification.read ? 'opacity-60' : 'shadow-lg'
                        } ${getNotificationColor(latestNotification.type)}`}
                        onClick={() => {
                          markAsRead(latestNotification.id);
                          removeNotification(latestNotification.id);
                        }}
                      >
                        <div className="flex items-start gap-2">
                          {React.createElement(getNotificationIcon(latestNotification.type), { size: 14, className: "mt-0.5 flex-shrink-0" })}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-white font-medium text-xs">
                                {latestNotification.title}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(latestNotification.id);
                                }}
                                className="text-white/40 hover:text-white/80 p-0.5 hover:bg-white/10 rounded"
                              >
                                <X size={10} />
                              </button>
                            </div>
                            <p className="text-white/80 text-xs mb-1 leading-relaxed">
                              {latestNotification.message}
                            </p>
                            <span className="text-white/40 text-[10px]">
                              {formatTime(latestNotification.timestamp)}
                            </span>
                          </div>
                        </div>
                        {!latestNotification.read && (
                          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                      
                      {notifications.length > 1 && (
                        <button
                          onClick={() => setShowAllNotifications(true)}
                          className="w-full mt-2 p-2 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Eye size={12} />
                          Pokaż wszystkie ({notifications.length})
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-2 border-t border-white/10 bg-gradient-to-r from-gray-900/40 to-black/40">
                <div className="flex gap-1">
                  {showAllNotifications && (
                    <button
                      onClick={() => setShowAllNotifications(false)}
                      className="flex-1 text-[10px] text-white/60 hover:text-white transition-colors py-1.5 px-2 rounded hover:bg-white/10"
                    >
                      Pokaż najnowsze
                    </button>
                  )}
                  <button
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="flex-1 text-[10px] text-white/60 hover:text-white transition-colors py-1.5 px-2 rounded hover:bg-white/10"
                  >
                    Oznacz jako przeczytane
                  </button>
                  <button
                    onClick={() => setNotifications([])}
                    className="flex-1 text-[10px] text-white/60 hover:text-red-400 transition-colors py-1.5 px-2 rounded hover:bg-red-500/10"
                  >
                    Wyczyść wszystkie
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationSystem;
