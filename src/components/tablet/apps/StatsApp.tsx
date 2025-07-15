
import React from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { Button } from '../../ui/button';

interface StatsAppProps {
  orgData: {
    name: string;
    balance: number;
  };
  onHome: () => void;
}

const StatsApp: React.FC<StatsAppProps> = ({ orgData, onHome }) => {
  const stats = [
    {
      title: 'Członkowie Online',
      value: '2',
      total: '3',
      percentage: 67,
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      title: 'Transakcje Dzisiaj',
      value: '16',
      total: '∞',
      percentage: 100,
      icon: DollarSign,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      title: 'Aktywność',
      value: '0%',
      total: '100%',
      percentage: 0,
      icon: Activity,
      color: 'text-red-400',
      bgColor: 'bg-red-400/20'
    },
    {
      title: 'Wzrost Kapitału',
      value: '+2.1%',
      total: '∞',
      percentage: 85,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    }
  ];

  const recentActivity = [
    { action: 'Wpłata środków', user: 'Rudolph Rudi', amount: '+2 zł', time: '2 godz. temu' },
    { action: 'Zamówienie broni', user: 'Braian Brown', amount: '-5000 zł', time: '4 godz. temu' },
    { action: 'Rekrutacja', user: 'josee carterr', amount: 'Nowy członek', time: '1 dzień temu' },
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
          <h1 className="text-2xl font-bold">Statystyki Organizacji</h1>
        </div>
        <div className="text-sm text-gray-400">
          Aktualne saldo: ${orgData.balance.toLocaleString()}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className={`${stat.bgColor} border border-gray-700 rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={24} className={stat.color} />
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <div className="text-sm text-gray-300 mb-2">{stat.title}</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                  style={{ width: `${stat.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-2 gap-6">
          {/* Activity Chart */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Aktywność w czasie</h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {[65, 45, 80, 35, 90, 55, 75].map((height, index) => (
                <div key={index} className="flex-1 bg-blue-600 rounded-t" style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Pn</span>
              <span>Wt</span>
              <span>Śr</span>
              <span>Cz</span>
              <span>Pt</span>
              <span>Sb</span>
              <span>Nd</span>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Przegląd finansowy</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Przychody miesięczne</span>
                <span className="text-green-400 font-bold">+$45,230</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Wydatki miesięczne</span>
                <span className="text-red-400 font-bold">-$23,100</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Zysk netto</span>
                <span className="text-blue-400 font-bold">+$22,130</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                <div className="h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Ostatnia aktywność</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-gray-400">{activity.user}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{activity.amount}</div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsApp;
