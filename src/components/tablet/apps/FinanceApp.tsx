
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, RefreshCw, Eye, EyeOff, CreditCard, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';

interface FinanceAppProps {
  orgData: {
    name: string;
    balance: number;
    crypto_balance: number;
  };
  onHome: () => void;
}

const FinanceApp: React.FC<FinanceAppProps> = ({ orgData, onHome }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Mock data - TODO: Replace with actual API calls
  const recentTransactions = [
    { id: 1, type: 'income', amount: 45000, description: 'Sprzedaż narkotyków', date: '2025-01-15', person: 'josee carterr' },
    { id: 2, type: 'expense', amount: 12000, description: 'Opłata za ochronę', date: '2025-01-15', person: 'Mike Torres' },
    { id: 3, type: 'income', amount: 24000, description: 'Wpłata z casino', date: '2025-01-15', person: 'Rudolph Rudi' },
    { id: 4, type: 'expense', amount: 3500, description: 'Łapówka dla policji', date: '2025-01-15', person: 'Braian Brown' },
    { id: 5, type: 'income', amount: 8500, description: 'Haracze z terenu', date: '2025-01-16', person: 'josee carterr' },
  ];

  const monthlyStats = {
    income: 125000,
    expenses: 45000,
    profit: 80000,
    growth: 12.5
  };

  const handleDeposit = () => {
    // TODO: Implement deposit logic
    console.log('Deposit:', depositAmount);
    setDepositAmount('');
  };

  const handleWithdraw = () => {
    // TODO: Implement withdraw logic
    console.log('Withdraw:', withdrawAmount);
    setWithdrawAmount('');
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
          <h1 className="text-xl font-medium">Finanse Organizacji</h1>
        </div>
        <Button variant="ghost" className="text-white/60 hover:text-white border border-white/20 rounded-xl hover:bg-white/10">
          <RefreshCw size={16} className="mr-2" />
          Odśwież
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-5rem)] [&>div>div]:!block">
        <div className="p-8 space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-3xl p-8 border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/30 rounded-2xl flex items-center justify-center">
                    <DollarSign size={24} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-400 text-sm font-medium">Saldo Główne</p>
                    <p className="text-white/60 text-xs">Gotówka organizacji</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-green-400 hover:bg-green-500/20"
                >
                  {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                </Button>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {showBalance ? `$${orgData.balance?.toLocaleString() || '0'}` : '••••••'}
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp size={16} className="text-green-400 mr-1" />
                <span className="text-green-400">+{monthlyStats.growth}% ten miesiąc</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500/30 rounded-2xl flex items-center justify-center">
                    <CreditCard size={24} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-orange-400 text-sm font-medium">Kryptowaluty</p>
                    <p className="text-white/60 text-xs">COIN Balance</p>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {showBalance ? `${orgData.crypto_balance?.toFixed(2) || '0.00'} COIN` : '••••••'}
              </div>
              <div className="flex items-center text-sm">
                <TrendingDown size={16} className="text-red-400 mr-1" />
                <span className="text-red-400">-2.3% ostatnia godzina</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-green-400" size={20} />
                <span className="text-white/80 text-sm">Przychody</span>
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">
                ${monthlyStats.income.toLocaleString()}
              </div>
              <div className="text-white/60 text-xs">Ten miesiąc</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="text-red-400" size={20} />
                <span className="text-white/80 text-sm">Wydatki</span>
              </div>
              <div className="text-2xl font-bold text-red-400 mb-1">
                ${monthlyStats.expenses.toLocaleString()}
              </div>
              <div className="text-white/60 text-xs">Ten miesiąc</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="text-blue-400" size={20} />
                <span className="text-white/80 text-sm">Zysk netto</span>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">
                ${monthlyStats.profit.toLocaleString()}
              </div>
              <div className="text-white/60 text-xs">Ten miesiąc</div>
            </div>
          </div>

          {/* Deposit/Withdraw */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <ArrowUpCircle className="text-green-400" size={20} />
                Wpłata
              </h3>
              <div className="flex gap-3">
                <Input
                  placeholder="Kwota"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Button 
                  onClick={handleDeposit}
                  disabled={!depositAmount}
                  className="bg-green-600 hover:bg-green-700 text-white border-0"
                >
                  Wpłać
                </Button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <ArrowDownCircle className="text-red-400" size={20} />
                Wypłata
              </h3>
              <div className="flex gap-3">
                <Input
                  placeholder="Kwota"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Button 
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount}
                  className="bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  Wypłać
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">Ostatnie transakcje</h3>
            </div>
            <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-500/50">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {transaction.type === 'income' ? 
                        <TrendingUp size={16} className="text-green-400" /> :
                        <TrendingDown size={16} className="text-red-400" />
                      }
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-white/60 text-sm">{transaction.person} • {transaction.date}</p>
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default FinanceApp;
