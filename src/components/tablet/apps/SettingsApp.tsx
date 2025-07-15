
import React, { useState } from 'react';
import { ArrowLeft, Shield, Users, DollarSign, Bell, Settings, Lock, Smartphone, Globe, Database, Key, Eye, UserCheck } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';

interface SettingsAppProps {
  orgData: {
    name: string;
    rank: number;
    id: number;
  };
  onHome: () => void;
}

const SettingsApp: React.FC<SettingsAppProps> = ({ orgData, onHome }) => {
  const [selectedCategory, setSelectedCategory] = useState('permissions');

  // TODO: Fetch from orgmdt-uprawnienia table
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
    { id: 'permissions', name: 'Uprawnienia', icon: Shield, color: 'text-red-400' },
    { id: 'organization', name: 'Organizacja', icon: Users, color: 'text-blue-400' },
    { id: 'finance', name: 'Finanse', icon: DollarSign, color: 'text-green-400' },
    { id: 'notifications', name: 'Powiadomienia', icon: Bell, color: 'text-yellow-400' },
    { id: 'security', name: 'Bezpieczeństwo', icon: Lock, color: 'text-purple-400' },
    { id: 'system', name: 'System', icon: Settings, color: 'text-gray-400' }
  ];

  const renderSettings = () => {
    switch (selectedCategory) {
      case 'permissions':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-red-400" size={24} />
              <h2 className="text-xl font-medium">Uprawnienia Członków</h2>
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
      
      case 'organization':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-blue-400" size={24} />
              <h2 className="text-xl font-medium">Ustawienia Organizacji</h2>
            </div>
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
        <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
          <span className="text-white/60 text-sm">Organizacja: </span>
          <span className="text-white font-medium">{orgData.name}</span>
        </div>
      </div>

      <div className="flex h-[calc(100%-5rem)]">
        {/* Categories Sidebar */}
        <div className="w-64 bg-white/5 backdrop-blur-sm border-r border-white/10 p-4">
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
