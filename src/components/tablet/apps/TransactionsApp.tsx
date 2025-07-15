
import React from 'react';
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';

interface TransactionsAppProps {
  orgData: {
    name: string;
  };
  onHome: () => void;
}

const TransactionsApp: React.FC<TransactionsAppProps> = ({ orgData, onHome }) => {
  const transactions = [
    { id: 1, type: 'deposit', amount: 2, title: 'Brak tytułu', person: 'Rudolph Rudi', date: '14.07.2025', time: '18:06' },
    { id: 2, type: 'withdraw', amount: 500, title: 'Zamówienie', person: 'Rudolph Rudi', date: '14.07.2025', time: '21:41' },
    { id: 3, type: 'withdraw', amount: 3000, title: 'Zamówienie', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:22' },
    { id: 4, type: 'withdraw', amount: 45000, title: 'Zamówienie', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:22' },
    { id: 5, type: 'withdraw', amount: 12000, title: 'Zamówienie', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:23' },
    { id: 6, type: 'withdraw', amount: 24000, title: 'Zamówienie', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:24' },
    { id: 7, type: 'withdraw', amount: 3500, title: 'Zamówienie', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:30' },
    { id: 8, type: 'withdraw', amount: 3500, title: 'Zamówienie', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:30' },
    { id: 9, type: 'withdraw', amount: 3500, title: 'Zamówienie', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:30' },
    { id: 10, type: 'withdraw', amount: 3500, title: 'Zamówienie', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:30' },
    { id: 11, type: 'withdraw', amount: 3500, title: 'Zamówienie', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:30' },
    { id: 12, type: 'withdraw', amount: 3000, title: 'Zamówienie', person: 'Rudolph Rudi', date: '15.07.2025', time: '15:30' },
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
          <h1 className="text-xl font-medium">Transakcje</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="text-white/60 hover:text-white border border-white/20 rounded-xl">
            <RefreshCw size={16} className="mr-2" />
            Odśwież
          </Button>
        </div>
      </div>

      {/* Table - minimalist */}
      <div className="p-8">
        {/* TODO: Sync with orgmdt-finanse table - fetch transactions by job */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 bg-white/5 text-sm font-medium text-white/80">
            <div>Typ</div>
            <div>Kwota</div>
            <div>Tytuł</div>
            <div>Osoba</div>
            <div>Data</div>
            <div>Czas</div>
          </div>

          {/* Table Body */}
          <div className="max-h-96 overflow-y-auto">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="grid grid-cols-6 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="flex items-center">
                  {transaction.type === 'deposit' ? (
                    <span className="text-green-400 text-sm">Wpłata</span>
                  ) : (
                    <span className="text-red-400 text-sm">Wypłata</span>
                  )}
                </div>
                <div className="font-medium">{transaction.amount} zł</div>
                <div className="text-white/60">{transaction.title}</div>
                <div className="text-white/60">{transaction.person}</div>
                <div className="text-white/60 text-sm">{transaction.date}</div>
                <div className="text-white/60 text-sm">{transaction.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsApp;
