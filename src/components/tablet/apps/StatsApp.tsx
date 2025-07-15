
import React, { useState } from 'react';
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Activity, Calendar, ChevronDown, Crown, Shield, User } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StatsAppProps {
  orgData: {
    name: string;
  };
  onHome: () => void;
}

const StatsApp: React.FC<StatsAppProps> = ({ orgData, onHome }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  // TODO: Fetch from database - organization statistics
  const periods = [
    { value: '24h', label: 'Ostatnie 24h' },
    { value: '7d', label: 'Ostatnie 7 dni' },
    { value: '30d', label: 'Ostatnie 30 dni' },
    { value: '3m', label: 'Ostatnie 3 miesiące' }
  ];

  const revenueData = [
    { name: 'Pon', value: 45000 },
    { name: 'Wt', value: 52000 },
    { name: 'Śr', value: 48000 },
    { name: 'Czw', value: 61000 },
    { name: 'Pt', value: 55000 },
    { name: 'Sob', value: 67000 },
    { name: 'Nie', value: 59000 }
  ];

  const memberActivityData = [
    { rank: 'SZEF', active: 2, total: 2 },
    { rank: 'ZASTĘPCA', active: 3, total: 4 },
    { rank: 'STARSZY CZŁONEK', active: 8, total: 12 },
    { rank: 'CZŁONEK', active: 15, total: 25 }
  ];

  const territoryData = [
    { name: 'Grove Street', value: 35, color: '#10B981' },
    { name: 'Ballas Territory', value: 28, color: '#8B5CF6' },
    { name: 'East Los Santos', value: 22, color: '#F59E0B' },
    { name: 'Other Areas', value: 15, color: '#6B7280' }
  ];

  const operationsData = [
    { name: 'Kradziże', completed: 23, failed: 3, revenue: 145000 },
    { name: 'Napady', completed: 12, failed: 1, revenue: 89000 },
    { name: 'Handel', completed: 45, failed: 2, revenue: 234000 },
    { name: 'Ochrona', completed: 18, failed: 0, revenue: 67000 }
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
          <div className="flex items-center gap-3">
            <BarChart3 className="text-indigo-400" size={24} />
            <h1 className="text-xl font-medium">Statystyki Organizacji</h1>
          </div>
        </div>
        
        {/* Period Selector */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-xl flex items-center gap-2"
          >
            {periods.find(p => p.value === selectedPeriod)?.label}
            <ChevronDown size={16} />
          </Button>
          
          {showPeriodDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-white/20 rounded-xl shadow-xl z-10 min-w-[180px]">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => {
                    setSelectedPeriod(period.value);
                    setShowPeriodDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl"
                >
                  {period.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-5rem)]">
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="text-green-400" size={24} />
                <TrendingUp className="text-green-400" size={16} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">$487,423</div>
              <div className="text-green-400 text-sm">+12.5% vs poprzedni okres</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-blue-400" size={24} />
                <TrendingUp className="text-green-400" size={16} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">43</div>
              <div className="text-green-400 text-sm">+3 nowych członków</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <Activity className="text-purple-400" size={24} />
                <TrendingDown className="text-red-400" size={16} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">87%</div>
              <div className="text-red-400 text-sm">-3% aktywność</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="text-orange-400" size={24} />
                <TrendingUp className="text-green-400" size={16} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">98</div>
              <div className="text-green-400 text-sm">+15 operacji</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-medium mb-4">Przychody</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Territory Control */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-medium mb-4">Kontrola Terytoriów</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={territoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {territoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {territoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-white/80">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Member Activity & Operations */}
          <div className="grid grid-cols-2 gap-6">
            {/* Member Activity by Rank */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-medium mb-4">Aktywność Członków</h3>
              <div className="space-y-4">
                {memberActivityData.map((item, index) => {
                  const percentage = (item.active / item.total) * 100;
                  const getRankIcon = (rank: string) => {
                    switch (rank) {
                      case 'SZEF': return Crown;
                      case 'ZASTĘPCA': return Shield;
                      default: return User;
                    }
                  };
                  const Icon = getRankIcon(item.rank);
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className="text-white/60" />
                          <span className="text-sm font-medium">{item.rank}</span>
                        </div>
                        <span className="text-sm text-white/80">
                          {item.active}/{item.total} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operations Summary */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-medium mb-4">Podsumowanie Operacji</h3>
              <div className="space-y-4">
                {operationsData.map((operation, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{operation.name}</h4>
                      <span className="text-green-400 font-medium">
                        ${operation.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="text-green-400">✓ {operation.completed}</span>
                      <span className="text-red-400">✗ {operation.failed}</span>
                      <span>
                        Skuteczność: {((operation.completed / (operation.completed + operation.failed)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatsApp;
