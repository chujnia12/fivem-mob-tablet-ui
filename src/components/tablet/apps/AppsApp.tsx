
import React, { useState } from 'react';
import { ArrowLeft, Download, Star, Bitcoin, Check, ShoppingCart, Loader } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

interface AppsAppProps {
  orgData: {
    name: string;
    crypto_balance?: number;
  };
  onHome: () => void;
  onPurchase: (app: string, price: number) => boolean;
  installedApps: string[];
}

const AppsApp: React.FC<AppsAppProps> = ({ orgData, onHome, onPurchase, installedApps }) => {
  const { toast } = useToast();
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Fikcyjne kryptowaluty z GTA 5
  const userCrypto = orgData.crypto_balance || 15.75;

  // TODO: Fetch from database - available_apps table
  const availableApps = [
    {
      id: 'zlecenia',
      name: 'Zlecenia Pro',
      description: 'Zaawansowany system zarządzania zleceniami organizacji przestępczej',
      rating: 4.8,
      downloads: 15420,
      price: 2.5,
      icon: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      developer: 'CrimeTech Solutions',
      size: '12.4 MB'
    },
    {
      id: 'kryptowaluty',
      name: 'CryptoVault Pro',
      description: 'Zaawansowany portfel kryptowalut z funkcjami prania pieniędzy',
      rating: 4.9,
      downloads: 23450,
      price: 5.0,
      icon: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop',
      developer: 'Anonymous Finance',
      size: '45.2 MB'
    },
    {
      id: 'napady',
      name: 'Heist Planner Pro',
      description: 'Planowanie i koordynacja skomplikowanych operacji kryminalnych',
      rating: 4.7,
      downloads: 12340,
      price: 7.5,
      icon: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
      developer: 'Criminal Masterminds',
      size: '67.3 MB'
    }
  ];

  const handlePurchase = (app: typeof availableApps[0]) => {
    if (installedApps.includes(app.id)) {
      toast({
        title: "Aplikacja już zainstalowana",
        description: `${app.name} jest już zainstalowana na tym urządzeniu`,
      });
      return;
    }

    setSelectedApp(app);
    setShowPurchaseDialog(true);
  };

  const confirmPurchase = async () => {
    if (!selectedApp) return;

    const success = onPurchase(selectedApp.id, selectedApp.price);
    
    if (success) {
      setShowPurchaseDialog(false);
      setDownloading(selectedApp.id);
      
      // Simulate download process
      setTimeout(() => {
        setDownloading(null);
        toast({
          title: "Aplikacja zainstalowana",
          description: `${selectedApp.name} została pomyślnie zainstalowana`,
        });
      }, 3000);
      
      setSelectedApp(null);
    } else {
      toast({
        title: "Niewystarczające środki",
        description: `Potrzebujesz ${selectedApp.price} VCASH aby kupić ${selectedApp.name}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onHome}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-600 rounded-xl flex items-center justify-center">
              <Download className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-medium">Sklep z Aplikacjami</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              <Bitcoin className="text-yellow-400" size={16} />
              <span className="text-yellow-400 font-medium">{userCrypto.toFixed(2)} VCASH</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 h-[calc(100%-5rem)]">
        {/* Apps Grid */}
        <ScrollArea className="h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pr-4">
            {availableApps.map((app) => {
              const isInstalled = installedApps.includes(app.id);
              const isDownloading = downloading === app.id;
              
              return (
                <div key={app.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 transition-all duration-300 shadow-lg">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* App Icon */}
                    <div className="relative">
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        {isDownloading ? (
                          <Loader size={12} className="text-white animate-spin" />
                        ) : isInstalled ? (
                          <Check size={12} className="text-white" />
                        ) : (
                          <ShoppingCart size={12} className="text-white" />
                        )}
                      </div>
                    </div>

                    {/* App Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-lg mb-1">{app.name}</h3>
                        <p className="text-white/60 text-sm">{app.developer}</p>
                      </div>

                      <p className="text-white/80 text-sm leading-relaxed">
                        {app.description}
                      </p>

                      {/* App Stats */}
                      <div className="flex items-center justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-current" />
                          <span className="text-white/80 font-medium">{app.rating}</span>
                        </div>
                        <div className="w-px h-3 bg-white/20"></div>
                        <div className="flex items-center gap-1">
                          <Download size={12} className="text-white/60" />
                          <span className="text-white/60">{app.downloads.toLocaleString()}</span>
                        </div>
                        <div className="w-px h-3 bg-white/20"></div>
                        <div className="text-white/60">{app.size}</div>
                      </div>
                    </div>

                    {/* Price and Purchase */}
                    <div className="w-full space-y-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Bitcoin size={20} className="text-yellow-400" />
                          <span className="text-2xl font-bold text-yellow-400">{app.price}</span>
                          <span className="text-sm text-yellow-400/80">VCASH</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handlePurchase(app)}
                        disabled={isInstalled || isDownloading}
                        className={`w-full rounded-2xl font-bold py-6 text-lg transition-all duration-300 ${
                          isInstalled 
                            ? 'bg-green-600/50 hover:bg-green-600/70 text-green-200 cursor-not-allowed border border-green-500/30'
                            : isDownloading
                            ? 'bg-blue-600/50 hover:bg-blue-600/70 text-blue-200 cursor-not-allowed border border-blue-500/30'
                            : userCrypto < app.price
                            ? 'bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 cursor-not-allowed border border-gray-500/30'
                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg border border-cyan-500/30'
                        }`}
                      >
                        {isDownloading ? (
                          <div className="flex items-center gap-2">
                            <Loader size={20} className="animate-spin" />
                            POBIERANIE...
                          </div>
                        ) : isInstalled ? (
                          'ZAINSTALOWANE'
                        ) : (
                          'KUP TERAZ'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Potwierdź zakup</DialogTitle>
            <DialogDescription className="text-white/80">
              Czy na pewno chcesz kupić aplikację {selectedApp?.name}?
            </DialogDescription>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedApp.icon}
                  alt={selectedApp.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedApp.name}</h3>
                  <p className="text-white/60 text-sm">{selectedApp.developer}</p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Koszt:</span>
                  <div className="flex items-center gap-2">
                    <Bitcoin size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 font-bold">{selectedApp.price} VCASH</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white/80">Twoje saldo:</span>
                  <div className="flex items-center gap-2">
                    <Bitcoin size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 font-bold">{userCrypto.toFixed(2)} VCASH</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                  <span className="text-white/80">Po zakupie:</span>
                  <div className="flex items-center gap-2">
                    <Bitcoin size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 font-bold">{(userCrypto - selectedApp.price).toFixed(2)} VCASH</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPurchaseDialog(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Anuluj
            </Button>
            <Button
              onClick={confirmPurchase}
              disabled={!selectedApp || userCrypto < selectedApp.price}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
            >
              Kup za {selectedApp?.price} VCASH
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppsApp;
