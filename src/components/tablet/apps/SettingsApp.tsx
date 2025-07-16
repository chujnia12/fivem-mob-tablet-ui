
import React, { useState } from 'react';
import { ArrowLeft, Shield, Users, DollarSign, Bell, Settings, Lock, Crown, User, Plus, Coins, Car, Package } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';

interface SettingsAppProps {
  orgData: {
    name: string;
    rank: number;
    id: number;
    balance: number;
    crypto_balance: number;
    member_slots: number;
    garage_slots: number;
    stash_slots: number;
  };
  onHome: () => void;
  onPurchase?: (item: string, price: number) => boolean;
}

const SettingsApp: React.FC<SettingsAppProps> = ({ orgData, onHome, onPurchase }) => {
  const [selectedCategory, setSelectedCategory] = useState('organization');
  const [selectedRank, setSelectedRank] = useState('CZŁONEK');

  // TODO: Fetch from orgmdt-uprawnienia table based on rank
  const ranks = ['CZŁONEK', 'STARSZY CZŁONEK', 'ZASTĘPCA', 'SZEF'];
  
  const permissions = [
    { id: 'manage_members', name: 'Zarządzanie członkami', enabled: true, description: 'Zatrudnianie i zwalnianie członków' },
    { id: 'manage_finance', name: 'Dostęp do finansów', enabled: false, description: 'Wpłaty i wypłaty z konta organizacji' },
    { id: 'manage_ranks', name: 'Zarządzanie rangami', enabled: true, description: 'Przyznawanie i odbieranie rang' },
    { id: 'view_logs', name: 'Dostęp do logów', enabled: false, description: 'Przeglądanie historii działań' },
    { id: 'manage_vehicles', name: 'Zarządzanie pojazdami', enabled: true, description: 'Wypożyczanie i zarządzanie flotą' },
    { id: 'manage_weapons', name: 'Dostęp do broni', enabled: false, description: 'Wydawanie i kontrola arsenału' },
    { id: 'manage_territory', name: 'Kontrola terytoriów', enabled: true, description: 'Zarządzanie obszarami wpływów' },
    { id: 'admin_access', name: 'Dostęp administracyjny', enabled: false, description: 'Pełne uprawnienia systemowe' }
  ];

  const organizationSettings = [
    { id: 'auto_recruit', name: 'Automatyczne rekrutacje', enabled: false, description: 'Automatyczne przyjmowanie nowych członków' },
    { id: 'rank_limits', name: 'Limity rang', enabled: true, description: 'Ograniczenia liczby członków na rangę' },
    { id: 'activity_tracking', name: 'Śledzenie aktywności', enabled: true, description: 'Monitorowanie aktywności członków' },
    { id: 'penalty_system', name: 'System kar', enabled: true, description: 'Automatyczne kary za nieobecność' },
    { id: 'promotion_system', name: 'System awansów', enabled: false, description: 'Automatyczne awanse za aktywność' }
  ];

  const financeSettings = [
    { id: 'withdrawal_limits', name: 'Limity wypłat', enabled: true, description: 'Dzienne limity wypłat dla członków' },
    { id: 'auto_taxes', name: 'Automatyczne podatki', enabled: true, description: 'Pobieranie podatków od działalności' },
    { id: 'expense_tracking', name: 'Śledzenie wydatków', enabled: true, description: 'Szczegółowa analiza finansowa' },
    { id: 'salary_automation', name: 'Automatyczne pensje', enabled: false, description: 'Wypłacanie pensji członkom' }
  ];

  const categories = [
    { id: 'organization', name: 'Organizacja', icon: Users, color: 'text-blue-400' },
    { id: 'permissions', name: 'Uprawnienia', icon: Shield, color: 'text-red-400' },
    { id: 'finance', name: 'Finanse', icon: DollarSign, color: 'text-green-400' },
    { id: 'notifications', name: 'Powiadomienia', icon: Bell, color: 'text-yellow-400' },
    { id: 'security', name: 'Bezpieczeństwo', icon: Lock, color: 'text-purple-400' },
    { id: 'system', name: 'System', icon: Settings, color: 'text-gray-400' }
  ];

  const organizationUpgrades = [
    {
      id: 'member_slot',
      name: 'Slot dla członka',
      description: 'Zwiększ limit członków organizacji o 1',
      price: 25.0,
      icon: User,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    },
    {
      id: 'garage_upgrade',
      name: 'Rozbudowa garażu',
      description: 'Zwiększ pojemność garażu o 1 pojazd',
      price: 100.0,
      icon: Car,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20'
    },
    {
      id: 'stash_upgrade',
      name: 'Rozbudowa szafki',
      description: 'Zwiększ pojemność szafki o 100kg',
      price: 75.0,
      icon: Package,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20'
    }
  ];

  const handlePurchaseUpgrade = (upgrade: any) => {
    if (onPurchase && onPurchase(upgrade.id, upgrade.price)) {
      console.log('SQL Update for upgrade:', upgrade.id);
      // Lokalne aktualizacje będą obsłużone przez parent component
    } else {
      alert('Niewystarczające środki COIN!');
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'SZEF': return Crown;
      case 'ZASTĘPCA': return Shield;
      case 'STARSZY CZŁONEK': return Settings;
      default: return User;
    }
  };

  const renderSettings = () => {
    switch (selectedCategory) {
      case 'organization':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-blue-400" size={24} />
              <h2 className="text-xl font-medium">Ustawienia Organizacji</h2>
            </div>

            {/* Organization Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{orgData.member_slots || 20}</div>
                    <div className="text-sm text-white/60">Sloty członków</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Car size={20} className="text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{orgData.garage_slots || 10}</div>
                    <div className="text-sm text-white/60">Sloty garażu</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Package size={20} className="text-purple-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{orgData.stash_slots || 500}kg</div>
                    <div className="text-sm text-white/60">Pojemność szafki</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Upgrades */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Coins size={20} className="text-yellow-400" />
                Rozbudowa Organizacji
              </h3>
              
              <div className="space-y-4">
                {organizationUpgrades.map((upgrade) => (
                  <div key={upgrade.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${upgrade.bgColor} rounded-lg flex items-center justify-center`}>
                        <upgrade.icon size={20} className={upgrade.color} />
                      </div>
                      <div>
                        <h5 className="font-medium text-white">{upgrade.name}</h5>
                        <p className="text-sm text-white/60">{upgrade.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-400">{upgrade.price} COIN</p>
                      </div>
                      <Button
                        onClick={() => handlePurchaseUpgrade(upgrade)}
                        disabled={orgData.crypto_balance < upgrade.price}
                        className={`${
                          orgData.crypto_balance >= upgrade.price
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-gray-600/20 border-gray-500/30 text-gray-500 cursor-not-allowed'
                        } rounded-xl flex items-center gap-2`}
                      >
                        <Coins size={16} />
                        Kup
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Existing Organization Settings */}
            <div className="space-y-4">
              {organizationSettings.map((setting) => (
                <div key={setting.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-white">{setting.name}</h3>
                        <div className={`px-2 py-1 rounded-lg text-xs ${
                          setting.enabled ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {setting.enabled ? 'Włączone' : 'Wyłączone'}
                        </div>
                      </div>
                      <p className="text-white/60 text-sm">{setting.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={setting.enabled ? "default" : "outline"}
                      className={`ml-4 ${setting.enabled 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'border-white/20 text-white/80 hover:bg-white/10 bg-transparent'} rounded-xl`}
                    >
                      {setting.enabled ? 'Wyłącz' : 'Włącz'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'permissions':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-red-400" size={24} />
              <h2 className="text-xl font-medium">Uprawnienia dla Rang</h2>
            </div>
            
            {/* Rank Selection */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">Wybierz rangę do edycji:</h3>
              <div className="flex gap-2 flex-wrap">
                {ranks.map((rank) => {
                  const RankIcon = getRankIcon(rank);
                  return (
                    <Button
                      key={rank}
                      size="sm"
                      variant={selectedRank === rank ? "default" : "outline"}
                      onClick={() => setSelectedRank(rank)}
                      className={`${selectedRank === rank 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'border-white/20 text-white/80 hover:bg-white/10 bg-transparent'} rounded-xl flex items-center gap-2`}
                    >
                      <RankIcon size={14} />
                      {rank}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-4">
              <h3 className="text-lg font-medium mb-2">Uprawnienia dla: {selectedRank}</h3>
              <p className="text-white/60 text-sm mb-4">
                TODO: Sync with orgmdt-uprawnienia table for rank: {selectedRank}
              </p>
            </div>

            {permissions.map((permission) => (
              <div key={permission.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-white">{permission.name}</h3>
                      <div className={`px-2 py-1 rounded-lg text-xs ${
                        permission.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {permission.enabled ? 'Aktywne' : 'Nieaktywne'}
                      </div>
                    </div>
                    <p className="text-white/60 text-sm">{permission.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={permission.enabled ? "default" : "outline"}
                    className={`ml-4 ${permission.enabled 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'border-white/20 text-white/80 hover:bg-white/10 bg-transparent'} rounded-xl`}
                  >
                    {permission.enabled ? 'Wyłącz' : 'Włącz'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="text-green-400" size={24} />
              <h2 className="text-xl font-medium">Ustawienia Finansowe</h2>
            </div>
            {financeSettings.map((setting) => (
              <div key={setting.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-white">{setting.name}</h3>
                      <div className={`px-2 py-1 rounded-lg text-xs ${
                        setting.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {setting.enabled ? 'Aktywne' : 'Nieaktywne'}
                      </div>
                    </div>
                    <p className="text-white/60 text-sm">{setting.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={setting.enabled ? "default" : "outline"}
                    className={`ml-4 ${setting.enabled 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'border-white/20 text-white/80 hover:bg-white/10 bg-transparent'} rounded-xl`}
                  >
                    {setting.enabled ? 'Wyłącz' : 'Włącz'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-center py-20 text-white/60">
            <Settings size={48} className="mx-auto mb-4 opacity-50" />
            <p>Wybierz kategorię ustawień z lewej strony</p>
          </div>
        );
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
            <Settings className="text-gray-400" size={24} />
            <h1 className="text-xl font-medium">Ustawienia Organizacji</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
            <span className="text-white/60 text-sm">Saldo COIN: </span>
            <span className="text-yellow-400 font-bold">{orgData.crypto_balance.toFixed(2)}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
            <span className="text-white/60 text-sm">Organizacja: </span>
            <span className="text-white font-medium">{orgData.name}</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-5rem)]">
        {/* Categories Sidebar */}
        <div className="w-64 bg-white/5 backdrop-blur-sm border-r border-white/10">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Kategorie</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <category.icon size={18} className={category.color} />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6">
          <ScrollArea className="h-full rounded-2xl">
            <div className="pr-4">
              {renderSettings()}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
