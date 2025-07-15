
import React from 'react';
import { ArrowLeft, Shield, Users, DollarSign, Bell } from 'lucide-react';
import { Button } from '../../ui/button';

interface SettingsAppProps {
  orgData: {
    name: string;
    rank: number;
    id: number;
  };
  onHome: () => void;
}

const SettingsApp: React.FC<SettingsAppProps> = ({ orgData, onHome }) => {
  const settingsCategories = [
    {
      title: 'Uprawnienia',
      icon: Shield,
      color: 'text-red-400',
      items: [
        'Zarządzanie członkami',
        'Dostęp do finansów',
        'Zarządzanie rangami',
        'Ustawienia organizacji'
      ]
    },
    {
      title: 'Członkowie',
      icon: Users,
      color: 'text-blue-400',
      items: [
        'Automatyczne zaproszenia',
        'Limity rang',
        'Aktywność członków',
        'System kar'
      ]
    },
    {
      title: 'Finanse',
      icon: DollarSign,
      color: 'text-green-400',
      items: [
        'Limity wypłat',
        'Automatyczne podatki',
        'Historia transakcji',
        'Powiadomienia finansowe'
      ]
    },
    {
      title: 'Powiadomienia',
      icon: Bell,
      color: 'text-yellow-400',
      items: [
        'Alerty bezpieczeństwa',
        'Powiadomienia o transakcjach',
        'Status członków',
        'Wiadomości systemowe'
      ]
    }
  ];

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onHome}
            className="text-white hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Ustawienia</h1>
        </div>
        <div className="text-sm text-gray-400">
          Organizacja: {orgData.name} | Ranga: {orgData.rank}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {settingsCategories.map((category) => (
            <div key={category.title} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <category.icon size={24} className={category.color} />
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
              
              <div className="space-y-3">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                    <span>{item}</span>
                    <span className="text-gray-400">→</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
