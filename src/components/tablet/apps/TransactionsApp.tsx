
import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Trash2, Filter, Download, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface TransactionsAppProps {
  orgData: {
    name: string;
    balance: number;
  };
  onHome: () => void;
}

const TransactionsApp: React.FC<TransactionsAppProps> = ({ orgData, onHome }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // TODO: Sync with orgmdt-finanse table
  const transactions = [
    { id: 1, type: 'deposit', amount: 2, title: 'Brak tytułu', person: 'Rudolph Rudi', date: '14.07.2025', time: '18:06', category: 'other', status: 'completed' },
    { id: 2, type: 'withdraw', amount: 500, title: 'Zamówienie broni', person: 'Rudolph Rudi', date: '14.07.2025', time: '21:41', category: 'weapons', status: 'completed' },
    { id: 3, type: 'withdraw', amount: 3000, title: 'Zakup narkotyków', person: 'Braian Brown', date: '15.07.2025', time: '15:22', category: 'drugs', status: 'completed' },
    { id: 4, type: 'deposit', amount: 45000, title: 'Sprzedaż narkotyków', person: 'josee carterr', date: '15.07.2025', time: '15:22', category: 'drugs', status: 'completed' },
    { id: 5, type: 'withdraw', amount: 12000, title: 'Opłata za ochronę', person: 'Mike Torres', date: '15.07.2025', time: '15:23', category: 'protection', status: 'pending' },
    { id: 6, type: 'deposit', amount: 24000, title: 'Wpłata z casino', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:24', category: 'gambling', status: 'completed' },
    { id: 7, type: 'withdraw', amount: 3500, title: 'Łapówka dla policji', person: 'Braian Brown', date: '15.07.2025', time: '15:30', category: 'bribery', status: 'completed' },
    { id: 8, type: 'deposit', amount: 8500, title: 'Haracze z terenu', person: 'josee carterr', date: '16.07.2025', time: '10:15', category: 'protection', status: 'completed' },
    { id: 9, type: 'withdraw', amount: 15000, title: 'Nowe pojazdy', person: 'Rudolph Rudi', date: '16.07.2025', time: '14:20', category: 'vehicles', status: 'pending' },
    { id: 10, type: 'deposit', amount: 6700, title: 'Przemyt towarów', person: 'Mike Torres', date: '16.07.2025', time: '16:45', category: 'smuggling', status: 'completed' },
    { id: 11, type: 'withdraw', amount: 2200, title: 'Utrzymanie bazy', person: 'Braian Brown', date: '17.07.2025', time: '09:30', category: 'maintenance', status: 'completed' },
    { id: 12, type: 'deposit', amount: 18000, title: 'Kradzież banku', person: 'josee carterr', date: '17.07.2025', time: '20:15', category: 'heist', status: 'completed' },
  ];

  const categories = [
    { id: 'all', name: 'Wszystkie', color: 'text-gray-400' },
    { id: 'weapons', name: 'Broń', color: 'text-red-400' },
    { id: 'drugs', name: 'Narkotyki', color: 'text-green-400' },
    { id: 'protection', name: 'Ochrona', color: 'text-blue-400' },
    { id: 'gambling', name: 'Hazard', color: 'text-purple-400' },
    { id: 'bribery', name: 'Łapówki', color: 'text-orange-400' },
    { id: 'vehicles', name: 'Pojazdy', color: 'text-cyan-400' },
    { id: 'smuggling', name: 'Przemyt', color: 'text-yellow-400' },
    { id: 'heist', name: 'Napady', color: 'text-pink-400' },
    { id: 'maintenance', name: 'Utrzymanie', color: 'text-gray-400' },
    { id: 'other', name: 'Inne', color: 'text-gray-400' },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesCategory = selectedPeriod === 'all' || transaction.category === selectedPeriod;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'amount':
        compareValue = a.amount - b.amount;
        break;
      case 'date':
        compareValue = new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime();
        break;
      case 'person':
        compareValue = a.person.localeCompare(b.person);
        break;
      default:
        compareValue = 0;
    }
    
    return sortOrder === 'desc' ? -compareValue : compareValue;
  });

  const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);
  const netFlow = totalDeposits - totalWithdrawals;

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
          <h1 className="text-xl font-medium">Historia Transakcji</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="text-white/60 hover:text-white border border-white/20 rounded-xl">
            <Download size={16} className="mr-2" />
            Eksportuj
          </Button>
          <Button variant="ghost" className="text-white/60 hover:text-white border border-white/20 rounded-xl">
            <RefreshCw size={16} className="mr-2" />
            Odśwież
          </Button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Financial Summary */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-400" size={24} />
              <div className="text-white/60 text-sm">Wpłaty</div>
            </div>
            <div className="text-2xl font-bold text-green-400">+${totalDeposits.toLocaleString()}</div>
            <div className="text-white/40 text-xs">{transactions.filter(t => t.type === 'deposit').length} transakcji</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="text-red-400" size={24} />
              <div className="text-white/60 text-sm">Wypłaty</div>
            </div>
            <div className="text-2xl font-bold text-red-400">-${totalWithdrawals.toLocaleString()}</div>
            <div className="text-white/40 text-xs">{transactions.filter(t => t.type === 'withdraw').length} transakcji</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className={netFlow >= 0 ? "text-green-400" : "text-red-400"} size={24} />
              <div className="text-white/60 text-sm">Bilans</div>
            </div>
            <div className={`text-2xl font-bold ${netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {netFlow >= 0 ? '+' : ''}${netFlow.toLocaleString()}
            </div>
            <div className="text-white/40 text-xs">Za ostatni okres</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-blue-400" size={24} />
              <div className="text-white/60 text-sm">Saldo aktualne</div>
            </div>
            <div className="text-2xl font-bold text-blue-400">${orgData.balance?.toLocaleString() || '0'}</div>
            <div className="text-white/40 text-xs">Stan konta</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="grid grid-cols-5 gap-4">
            <div className="relative">
              <Input
                placeholder="Szukaj transakcji..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl"
              />
            </div>
            
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white"
            >
              <option value="all">Wszystkie typy</option>
              <option value="deposit">Wpłaty</option>
              <option value="withdraw">Wypłaty</option>
            </select>
            
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white"
            >
              <option value="date">Sortuj: Data</option>
              <option value="amount">Sortuj: Kwota</option>
              <option value="person">Sortuj: Osoba</option>
            </select>
            
            <Button 
              variant="outline" 
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="border-white/20 text-white/80"
            >
              {sortOrder === 'desc' ? '↓' : '↑'} {sortOrder === 'desc' ? 'Malejąco' : 'Rosnąco'}
            </Button>
          </div>
        </div>

        {/* Enhanced Transaction Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-8 gap-4 p-4 border-b border-white/10 bg-white/5 text-sm font-medium text-white/80">
            <div>Typ</div>
            <div>Kwota</div>
            <div>Tytuł</div>
            <div>Kategoria</div>
            <div>Osoba</div>
            <div>Data</div>
            <div>Status</div>
            <div>Akcje</div>
          </div>

          {/* Table Body */}
          <div className="max-h-96 overflow-y-auto">
            {/* TODO: Sync with orgmdt-finanse table - fetch transactions by job */}
            {sortedTransactions.map((transaction) => {
              const category = categories.find(c => c.id === transaction.category);
              return (
                <div key={transaction.id} className="grid grid-cols-8 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center">
                    {transaction.type === 'deposit' ? (
                      <span className="text-green-400 text-sm font-medium">Wpłata</span>
                    ) : (
                      <span className="text-red-400 text-sm font-medium">Wypłata</span>
                    )}
                  </div>
                  <div className={`font-medium ${transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </div>
                  <div className="text-white/80">{transaction.title}</div>
                  <div className={`text-sm ${category?.color || 'text-gray-400'}`}>
                    {category?.name || 'Inne'}
                  </div>
                  <div className="text-white/60">{transaction.person}</div>
                  <div className="text-white/60 text-sm">
                    {transaction.date}<br/>
                    <span className="text-white/40">{transaction.time}</span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.status === 'completed' 
                        ? 'bg-green-400/20 text-green-400' 
                        : 'bg-orange-400/20 text-orange-400'
                    }`}>
                      {transaction.status === 'completed' ? 'Ukończono' : 'Oczekuje'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="text-white/60 hover:text-white p-1">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {sortedTransactions.length === 0 && (
            <div className="text-center py-8 text-white/60">
              Brak transakcji spełniających kryteria wyszukiwania
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsApp;
