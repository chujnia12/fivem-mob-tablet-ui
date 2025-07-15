
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, Activity, Target, Award, Clock, MapPin, Shield, Zap } from 'lucide-react';
import { Button } from '../../ui/button';

interface StatsAppProps {
  orgData: {
    name: string;
    balance: number;
  };
  onHome: () => void;
}

const StatsApp: React.FC<StatsAppProps> = ({ orgData, onHome }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('overview');

  const stats = [
    {
      title: 'Członkowie Online',
      value: '2',
      total: '4',
      percentage: 50,
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
      change: '+1'
    },
    {
      title: 'Transakcje Dzisiaj',
      value: '16',
      total: '∞',
      percentage: 85,
      icon: DollarSign,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      change: '+4'
    },
    {
      title: 'Aktywność Organizacji',
      value: '87%',
      total: '100%',
      percentage: 87,
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      change: '+12%'
    },
    {
      title: 'Wzrost Kapitału',
      value: '+15.2%',
      total: '∞',
      percentage: 75,
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/20',
      change: '+3.1%'
    }
  ];

  const advancedStats = [
    { title: 'Wykonane Misje', value: '24', icon: Target, color: 'text-cyan-400' },
    { title: 'Zdobyte Nagrody', value: '12', icon: Award, color: 'text-yellow-400' },
    { title: 'Średni Czas Online', value: '4.2h', icon: Clock, color: 'text-pink-400' },
    { title: 'Kontrolowane Tereny', value: '7', icon: MapPin, color: 'text-indigo-400' },
    { title: 'Poziom Bezpieczeństwa', value: '85%', icon: Shield, color: 'text-emerald-400' },
    { title: 'Wskaźnik Sukcesu', value: '92%', icon: Zap, color: 'text-red-400' },
  ];

  const memberPerformance = [
    { name: 'Rudolph Rudi', role: 'Boss', activity: 95, earnings: 45000, missions: 12 },
    { name: 'Braian Brown', role: 'Underboss', activity: 88, earnings: 32000, missions: 8 },
    { name: 'josee carterr', role: 'Soldier', activity: 76, earnings: 18000, missions: 6 },
    { name: 'Mike Torres', role: 'Associate', activity: 65, earnings: 12000, missions: 4 },
  ];

  const weeklyData = [
    { day: 'Pn', income: 15000, members: 3, missions: 2 },
    { day: 'Wt', income: 23000, members: 4, missions: 3 },
    { day: 'Śr', income: 18000, members: 3, missions: 4 },
    { day: 'Cz', income: 31000, members: 4, missions: 5 },
    { day: 'Pt', income: 28000, members: 4, missions: 3 },
    { day: 'Sb', income: 42000, members: 4, missions: 6 },
    { day: 'Nd', income: 35000, members: 3, missions: 4 },
  ];

  const territoryControl = [
    { area: 'Downtown', control: 85, income: 15000, status: 'secured' },
    { area: 'Industrial', control: 92, income: 22000, status: 'secured' },
    { area: 'Harbor', control: 78, income: 18000, status: 'contested' },
    { area: 'Suburbs', control: 65, income: 12000, status: 'contested' },
    { area: 'Airport', control: 45, income: 8000, status: 'hostile' },
  ];

  const recentActivity = [
    { action: 'Napad na bank zakończony', user: 'Rudolph Rudi', amount: '+45000 zł', time: '30 min. temu', type: 'success' },
    { action: 'Nowy członek przyjęty', user: 'Mike Torres', amount: 'Rekrutacja', time: '2 godz. temu', type: 'info' },
    { action: 'Zakup nowej broni', user: 'Braian Brown', amount: '-15000 zł', time: '4 godz. temu', type: 'expense' },
    { action: 'Przejęcie terenu', user: 'josee carterr', amount: 'Harbor District', time: '6 godz. temu', type: 'success' },
    { action: 'Wpłata z ochrony', user: 'Mike Torres', amount: '+8500 zł', time: '8 godz. temu', type: 'income' },
  ];

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
          <h1 className="text-xl font-medium">Statystyki i Analityka</h1>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white"
          >
            <option value="day">Dziś</option>
            <option value="week">Tydzień</option>
            <option value="month">Miesiąc</option>
            <option value="year">Rok</option>
          </select>
          <div className="text-sm text-white/60 flex items-center">
            Aktualne saldo: <span className="text-green-400 font-bold ml-1">${orgData.balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6 h-[calc(100%-5rem)] overflow-y-auto">
        {/* Main Stats */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={28} className={stat.color} />
                <div className="text-right">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-green-400 text-xs">{stat.change}</div>
                </div>
              </div>
              <div className="text-white/80 text-sm mb-3">{stat.title}</div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                  style={{ width: `${stat.percentage}%` }}
                ></div>
              </div>
              <div className="text-white/40 text-xs mt-1">{stat.percentage}% z {stat.total}</div>
            </div>
          ))}
        </div>

        {/* Advanced Statistics */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-medium mb-4">Zaawansowane Metryki</h3>
          <div className="grid grid-cols-6 gap-4">
            {advancedStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/5 rounded-xl">
                <stat.icon size={24} className={`${stat.color} mx-auto mb-2`} />
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-white/60 text-xs">{stat.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-2 gap-6">
          {/* Enhanced Activity Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Aktywność Tygodniowa</h3>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm"
              >
                <option value="overview">Przegląd</option>
                <option value="income">Przychody</option>
                <option value="missions">Misje</option>
              </select>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-1">
                    <div 
                      className="bg-blue-400 rounded-t"
                      style={{ height: `${(data.income / 500)}px` }}
                      title={`Przychód: $${data.income}`}
                    ></div>
                    <div 
                      className="bg-green-400 rounded-t"
                      style={{ height: `${data.missions * 8}px` }}
                      title={`Misje: ${data.missions}`}
                    ></div>
                  </div>
                  <div className="text-xs text-white/60">{data.day}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span className="text-xs text-white/60">Przychody</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span className="text-xs text-white/60">Misje</span>
              </div>
            </div>
          </div>

          {/* Territory Control */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-medium mb-4">Kontrola Terytoriów</h3>
            <div className="space-y-3">
              {territoryControl.map((territory, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      territory.status === 'secured' ? 'bg-green-400' :
                      territory.status === 'contested' ? 'bg-orange-400' : 'bg-red-400'
                    }`}></div>
                    <div>
                      <div className="font-medium">{territory.area}</div>
                      <div className="text-white/60 text-sm">${territory.income}/dzień</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{territory.control}%</div>
                    <div className={`text-xs ${
                      territory.status === 'secured' ? 'text-green-400' :
                      territory.status === 'contested' ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {territory.status === 'secured' ? 'Zabezpieczone' :
                       territory.status === 'contested' ? 'Sporny' : 'Wrogi'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member Performance */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-medium mb-4">Wydajność Członków</h3>
          <div className="space-y-3">
            {memberPerformance.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-white/60 text-sm">{member.role}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-green-400 font-bold">{member.activity}%</div>
                    <div className="text-white/60 text-xs">Aktywność</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-bold">${member.earnings.toLocaleString()}</div>
                    <div className="text-white/60 text-xs">Zarobki</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-bold">{member.missions}</div>
                    <div className="text-white/60 text-xs">Misje</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity - Enhanced */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-medium mb-4">Ostatnia Aktywność</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'income' ? 'bg-blue-400' :
                    activity.type === 'expense' ? 'bg-red-400' : 'bg-purple-400'
                  }`}></div>
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-white/60 text-sm">{activity.user}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${
                    activity.type === 'success' || activity.type === 'income' ? 'text-green-400' :
                    activity.type === 'expense' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    {activity.amount}
                  </div>
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

export default StatsApp;
