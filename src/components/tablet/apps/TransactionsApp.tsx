
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
          <h1 className="text-2xl font-bold">Historia Transakcji</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-600">
            <RefreshCw size={16} className="mr-2" />
            ODŚWIEŻ
          </Button>
          <Button variant="destructive">
            <Trash2 size={16} className="mr-2" />
            WYCZYŚĆ
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 p-4 border-b border-red-500 bg-gray-800 text-sm font-semibold">
            <div>LP.</div>
            <div>TYP</div>
            <div>KWOTA</div>
            <div>TYTUŁ</div>
            <div>OSOBA</div>
            <div>DATA</div>
            <div>STATUS</div>
          </div>

          {/* Table Body */}
          <div className="max-h-96 overflow-y-auto">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="grid grid-cols-7 gap-4 p-4 border-b border-gray-700 hover:bg-gray-800 transition-colors">
                <div className="text-red-400">{transaction.id}</div>
                <div className="flex items-center">
                  {transaction.type === 'deposit' ? (
                    <span className="text-green-400">↑ Wpłata</span>
                  ) : (
                    <span className="text-red-400">↓ Wypłata</span>
                  )}
                </div>
                <div className="font-semibold">{transaction.amount} zł</div>
                <div className="text-gray-300">{transaction.title}</div>
                <div>{transaction.person}</div>
                <div className="text-gray-400">{transaction.date}</div>
                <div className="text-gray-400">{transaction.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsApp;
