
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
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedTransactionType, setSelectedTransactionType] = useState('all');

  const quickActions = [
    { name: 'WPŁATA', icon: Plus, color: 'bg-green-600' },
    { name: 'WYPŁATA', icon: Minus, color: 'bg-red-600' },
    { name: 'PRZELEWY', icon: DollarSign, color: 'bg-purple-600' },
    { name: 'RAPORT', icon: TrendingUp, color: 'bg-blue-600' },
  ];

  // TODO: Sync with addon_account_data table
  const accounts = [
    { type: 'Kasa główna', balance: orgData.balance, color: 'text-green-400' },
    { type: 'Fundusz awaryjny', balance: 150000, color: 'text-blue-400' },
    { type: 'Inwestycje', balance: 75000, color: 'text-purple-400' },
    { type: 'Wydatki bieżące', balance: -25000, color: 'text-red-400' },
  ];

  // TODO: Sync with orgmdt-finanse table
  const recentActivity = [
    { type: 'deposit', amount: 2, title: 'Brak tytułu', person: 'Rudolph Rudi', time: '1 dni temu', status: 'completed' },
    { type: 'withdraw', amount: 5000, title: 'Zakup broni', person: 'Braian Brown', time: '2 dni temu', status: 'completed' },
    { type: 'deposit', amount: 15000, title: 'Sprzedaż narkotyków', person: 'josee carterr', time: '3 dni temu', status: 'pending' },
    { type: 'withdraw', amount: 3000, title: 'Opłata za ochronę', person: 'Rudolph Rudi', time: '4 dni temu', status: 'completed' },
  ];

  const stats = [
    { label: 'CZŁONKÓW', value: '3', color: 'text-red-400', change: '+0' },
    { label: 'ONLINE', value: '2', color: 'text-green-400', change: '+1' },
    { label: 'TRANSAKCJI', value: '16', color: 'text-blue-400', change: '+4' },
    { label: 'AKTYWNOŚĆ', value: '85%', color: 'text-orange-400', change: '+15%' },
  ];

  const monthlyData = [
    { month: 'Sty', income: 45000, expenses: 23000 },
    { month: 'Lut', income: 52000, expenses: 28000 },
    { month: 'Mar', income: 38000, expenses: 31000 },
    { month: 'Kwi', income: 61000, expenses: 25000 },
    { month: 'Maj', income: 48000, expenses: 33000 },
    { month: 'Cze', income: 55000, expenses: 29000 },
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

      <div className="p-8 space-y-6 h-[calc(100%-5rem)] overflow-y-auto">
        {/* Multiple Account Balances */}
        <div className="grid grid-cols-2 gap-6">
          {accounts.map((account, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-white/60 text-sm mb-2">{account.type}</div>
              <div className={`text-2xl font-light ${account.color}`}>
                ${Math.abs(account.balance).toLocaleString()}
              </div>
              {account.balance < 0 && <div className="text-red-400 text-xs mt-1">Zadłużenie</div>}
            </div>
          ))}
        </div>

        {/* Quick Actions - minimalist */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-medium mb-4">Szybkie Akcje</h3>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button key={index} className={`${action.color} hover:opacity-80 border border-white/20 rounded-xl h-16 flex-col gap-2`}>
                <action.icon size={20} />
                <span className="text-xs">{action.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-medium mb-4">Statystyki Organizacji</h3>
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-white/60 text-xs">{stat.label}</div>
                <div className="text-green-400 text-xs">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Przychody vs Wydatki</h3>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm"
            >
              <option value="week">Tydzień</option>
              <option value="month">Miesiąc</option>
              <option value="year">Rok</option>
            </select>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-1">
                  <div 
                    className="bg-green-400 rounded-t"
                    style={{ height: `${(data.income / 1000)}px` }}
                  ></div>
                  <div 
                    className="bg-red-400 rounded-t"
                    style={{ height: `${(data.expenses / 1000)}px` }}
                  ></div>
                </div>
                <div className="text-xs text-white/60">{data.month}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span className="text-xs text-white/60">Przychody</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-xs text-white/60">Wydatki</span>
            </div>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-medium mb-4">Nowa Transakcja</h3>
          <div className="grid grid-cols-3 gap-4">
            <Input 
              placeholder="Kwota" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/10 border-white/20"
            />
            <Input 
              placeholder="Tytuł transakcji" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/10 border-white/20"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              Dodaj transakcję
            </Button>
          </div>
        </div>

        {/* Recent Transactions - Enhanced */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Ostatnie Transakcje</h3>
            <div className="flex gap-2">
              <select 
                value={selectedTransactionType}
                onChange={(e) => setSelectedTransactionType(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">Wszystkie</option>
                <option value="deposit">Wpłaty</option>
                <option value="withdraw">Wypłaty</option>
              </select>
              <Button variant="ghost" className="text-white/60 hover:text-white text-sm">
                Zobacz wszystkie
              </Button>
            </div>
          </div>
          {/* TODO: Sync with orgmdt-finanse table */}
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'deposit' ? 'bg-green-400/20' : 'bg-red-400/20'
                  }`}>
                    {activity.type === 'deposit' ? 
                      <Plus size={14} className="text-green-400" /> : 
                      <Minus size={14} className="text-red-400" />
                    }
                  </div>
                  <div>
                    <div className="font-medium">{activity.type === 'deposit' ? 'Wpłata' : 'Wypłata'}</div>
                    <div className="text-white/60 text-sm">{activity.title}</div>
                    <div className="text-white/40 text-xs">{activity.person}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${activity.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                    {activity.type === 'deposit' ? '+' : '-'}{activity.amount} zł
                  </div>
                  <div className="text-white/60 text-sm">{activity.time}</div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    activity.status === 'completed' ? 'bg-green-400/20 text-green-400' : 'bg-orange-400/20 text-orange-400'
                  }`}>
                    {activity.status === 'completed' ? 'Ukończono' : 'Oczekuje'}
                  </div>
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
