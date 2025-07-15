
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
    <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header - minimalist */}
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
          <h1 className="text-xl font-medium">Finanse</h1>
        </div>
      </div>

      <div className="p-8 space-y-8 h-[calc(100%-5rem)]">
        {/* Balance Card - minimalist */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="text-center">
            <div className="text-white/60 text-sm mb-2">Saldo Organizacji</div>
            <div className="text-4xl font-light mb-8">${orgData.balance.toLocaleString()}</div>
            {/* TODO: Sync with addon_account_data table */}
            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl h-12">
                <Plus size={16} className="mr-2" />
                Wpłata
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl h-12">
                <Minus size={16} className="mr-2" />
                Wypłata
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Transactions - minimalist */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Ostatnie Transakcje</h3>
            <Button variant="ghost" className="text-white/60 hover:text-white text-sm">
              Zobacz wszystkie
            </Button>
          </div>
          {/* TODO: Sync with orgmdt-finanse table */}
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <Plus size={14} />
                  </div>
                  <div>
                    <div className="font-medium">Wpłata</div>
                    <div className="text-white/60 text-sm">{activity.person}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-400">+{activity.amount} zł</div>
                  <div className="text-white/60 text-sm">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceApp;
