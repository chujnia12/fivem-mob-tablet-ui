
import React, { useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface FinanceAppProps {
  orgData: {
    name: string;
    balance: number;
  };
  onHome: () => void;
}

const FinanceApp: React.FC<FinanceAppProps> = ({ orgData, onHome }) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');

  const quickActions = [
    { name: 'ZATRUDNIJ', icon: Plus, color: 'bg-red-600' },
    { name: 'ODŚWIEŻ', icon: TrendingUp, color: 'bg-gray-600' },
    { name: 'TRANSAKCJE', icon: DollarSign, color: 'bg-purple-600' },
    { name: 'CZŁONKOWIE', icon: TrendingDown, color: 'bg-blue-600' },
  ];

  const recentActivity = [
    { type: 'deposit', amount: 2, title: 'Brak tytułu', person: 'Rudolph Rudi', time: '1 dni temu' },
  ];

  const stats = [
    { label: 'CZŁONKÓW', value: '3', color: 'text-red-400' },
    { label: 'ONLINE', value: '2', color: 'text-green-400' },
    { label: 'TRANSAKCJI', value: '16', color: 'text-blue-400' },
    { label: 'AKTYWNOŚĆ', value: '0%', color: 'text-orange-400' },
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
          <h1 className="text-2xl font-bold">Panel Zarządzania Organizacją</h1>
        </div>
        <div className="text-sm text-gray-400">
          Zarządzaj swoją organizacją w jednym miejscu
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-6 h-[calc(100%-5rem)]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="bg-gray-900 border border-red-500 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Saldo Organizacji</h3>
                <p className="text-gray-400 text-sm">Dostępne środki</p>
              </div>
            </div>
            <div className="text-4xl font-bold mb-6">${orgData.balance.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus size={16} className="mr-2" />
                WPŁATA
              </Button>
              <Button variant="destructive">
                <Minus size={16} className="mr-2" />
                WYPŁATA
              </Button>
            </div>
          </div>

          {/* Active Members */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Aktywni Członkowie</h3>
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">2 ONLINE</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  B
                </div>
                <span>Braian Brown</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  R
                </div>
                <span>Rudolph Rudi</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              ZOBACZ WSZYSTKICH →
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gray-900 border border-red-500 rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-red-400">⚡</span>
              Szybkie Akcje
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.name}
                  variant="outline"
                  className="h-16 flex flex-col items-center gap-1 hover:bg-gray-800"
                >
                  <action.icon size={20} />
                  <span className="text-xs">{action.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900 border border-orange-500 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-orange-400">🕒</span>
              <h3 className="font-semibold">Ostatnia Aktywność</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                      <Plus size={12} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Wpłata - {activity.amount} zł</div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              ZOBACZ WSZYSTKIE →
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-gray-900 rounded-lg p-3 text-center">
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceApp;
