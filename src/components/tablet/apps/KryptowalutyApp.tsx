
import React, { useState } from 'react';
import { ArrowLeft, Bitcoin, TrendingUp, TrendingDown, DollarSign, RefreshCw, Plus, Minus, Wallet, BarChart3 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface KryptowalutyAppProps {
  orgData: {
    name: string;
  };
  onHome: () => void;
}

const KryptowalutyApp: React.FC<KryptowalutyAppProps> = ({ orgData, onHome }) => {
  const [selectedCoin, setSelectedCoin] = useState('LCOIN');
  const [tradeType, setTradeType] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [activeTab, setActiveTab] = useState('portfolio');

  // TODO: Fetch from database - crypto_portfolio, crypto_prices tables
  // Fikcyjne kryptowaluty inspirowane GTA 5
  const cryptoData = [
    {
      symbol: 'LCOIN',
      name: 'Liberty Coin',
      price: 2847.50,
      change24h: 3.21,
      owned: 5.2847,
      value: 15043.82,
      icon: '🏛️'
    },
    {
      symbol: 'VCASH',
      name: 'Vice Cash',
      price: 1542.15,
      change24h: -2.14,
      owned: 8.1,
      value: 12491.42,
      icon: '🌴'
    },
    {
      symbol: 'SANCOIN',
      name: 'San Andreas Coin',
      price: 567.89,
      change24h: 5.67,
      owned: 15.2,
      value: 8631.93,
      icon: '🏔️'
    },
    {
      symbol: 'NCCOIN',
      name: 'North Carolina Coin',
      price: 234.56,
      change24h: -1.23,
      owned: 25.8,
      value: 6051.65,
      icon: '🏭'
    },
    {
      symbol: 'BULLCOIN',
      name: 'Bull Shark Coin',
      price: 89.34,
      change24h: 8.45,
      owned: 67.2,
      value: 6003.65,
      icon: '🦈'
    },
    {
      symbol: 'LSCOIN',
      name: 'Los Santos Coin',
      price: 45.67,
      change24h: -3.45,
      owned: 123.4,
      value: 5635.68,
      icon: '🌆'
    }
  ];

  const priceHistory = [
    { time: '00:00', LCOIN: 2650, VCASH: 1456, SANCOIN: 534 },
    { time: '04:00', LCOIN: 2720, VCASH: 1487, SANCOIN: 545 },
    { time: '08:00', LCOIN: 2780, VCASH: 1512, SANCOIN: 558 },
    { time: '12:00', LCOIN: 2820, VCASH: 1534, SANCOIN: 562 },
    { time: '16:00', LCOIN: 2830, VCASH: 1528, SANCOIN: 560 },
    { time: '20:00', LCOIN: 2847, VCASH: 1542, SANCOIN: 567 }
  ];

  const transactions = [
    {
      id: 'TX001',
      type: 'buy',
      symbol: 'LCOIN',
      amount: 0.5,
      price: 2750,
      total: 1375,
      timestamp: '2024-01-15 14:30'
    },
    {
      id: 'TX002',
      type: 'sell',
      symbol: 'VCASH',
      amount: 2.0,
      price: 1520,
      total: 3040,
      timestamp: '2024-01-15 12:15'
    },
    {
      id: 'TX003',
      type: 'buy',
      symbol: 'SANCOIN',
      amount: 5.0,
      price: 540,
      total: 2700,
      timestamp: '2024-01-15 10:45'
    }
  ];

  const totalPortfolioValue = cryptoData.reduce((sum, coin) => sum + coin.value, 0);
  const selectedCoinData = cryptoData.find(coin => coin.symbol === selectedCoin);

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
            <Bitcoin className="text-yellow-400" size={24} />
            <h1 className="text-xl font-medium">Kryptowaluty</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
            <span className="text-white/60 text-sm">Portfolio: </span>
            <span className="text-green-400 font-medium">${totalPortfolioValue.toLocaleString()}</span>
          </div>
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl">
            <RefreshCw size={16} className="mr-2" />
            ODŚWIEŻ
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'portfolio'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'wallet'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Wallet size={16} className="mr-2 inline" />
          Portfel
        </button>
        <button
          onClick={() => setActiveTab('trading')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'trading'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Handel
        </button>
      </div>

      <div className="flex h-[calc(100%-9rem)]">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {activeTab === 'portfolio' && (
            <>
              {/* Portfolio Overview */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-medium mb-4">Twoje Portfolio</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {cryptoData.map((coin) => (
                    <div 
                      key={coin.symbol}
                      onClick={() => setSelectedCoin(coin.symbol)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selectedCoin === coin.symbol 
                          ? 'bg-white/10 border-yellow-500/30' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">{coin.icon}</div>
                          <div>
                            <div className="font-medium text-sm">{coin.symbol}</div>
                            <div className="text-white/60 text-xs">{coin.name}</div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${
                          coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {coin.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {Math.abs(coin.change24h)}%
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="text-white/80">${coin.price.toLocaleString()}</div>
                        <div className="text-white/60">{coin.owned} {coin.symbol}</div>
                        <div className="text-green-400 font-medium">${coin.value.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Chart */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-medium mb-4">Wykres Cen - {selectedCoin}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey={selectedCoin} 
                      stroke="#EAB308" 
                      strokeWidth={2}
                      dot={{ fill: '#EAB308', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6">
              {/* Wallet Summary */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">Portfel Kryptowalut</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      ${totalPortfolioValue.toLocaleString()}
                    </div>
                    <div className="text-white/60 text-sm">Łączna wartość</div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {cryptoData.map((coin) => (
                    <div key={coin.symbol} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{coin.icon}</div>
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-white/60 text-sm">{coin.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{coin.owned} {coin.symbol}</div>
                        <div className="text-green-400 text-sm">${coin.value.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-medium mb-4">Historia Transakcji</h3>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          tx.type === 'buy' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.type === 'buy' ? 'KUPNO' : 'SPRZEDAŻ'}
                        </div>
                        <div>
                          <div className="font-medium">{tx.symbol}</div>
                          <div className="text-white/60 text-sm">{tx.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{tx.amount} {tx.symbol}</div>
                        <div className="text-white/60 text-sm">${tx.total.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trading' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-medium mb-4">Panel Handlowy</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trading Form */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={tradeType === 'buy' ? "default" : "outline"}
                      onClick={() => setTradeType('buy')}
                      className={`flex-1 ${tradeType === 'buy' 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'border-white/20 text-white/80 hover:bg-white/10 bg-transparent'} rounded-xl`}
                    >
                      <Plus size={14} className="mr-1" />
                      KUPUJ
                    </Button>
                    <Button
                      size="sm"
                      variant={tradeType === 'sell' ? "default" : "outline"}
                      onClick={() => setTradeType('sell')}
                      className={`flex-1 ${tradeType === 'sell' 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'border-white/20 text-white/80 hover:bg-white/10 bg-transparent'} rounded-xl`}
                    >
                      <Minus size={14} className="mr-1" />
                      SPRZEDAJ
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-white/60 mb-1 block">Kryptowaluta</label>
                      <select 
                        value={selectedCoin}
                        onChange={(e) => setSelectedCoin(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white"
                      >
                        {cryptoData.map(coin => (
                          <option key={coin.symbol} value={coin.symbol} className="bg-gray-900">
                            {coin.symbol} - {coin.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-white/60 mb-1 block">Ilość</label>
                      <Input
                        placeholder="0.00"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
                      />
                    </div>

                    <Button className={`w-full rounded-xl ${
                      tradeType === 'buy' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white`}>
                      <DollarSign size={16} className="mr-2" />
                      {tradeType === 'buy' ? 'KUPUJ' : 'SPRZEDAJ'}
                    </Button>
                  </div>
                </div>

                {/* Selected Coin Info */}
                {selectedCoinData && (
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{selectedCoinData.icon}</div>
                      <div>
                        <div className="font-medium text-lg">{selectedCoinData.name}</div>
                        <div className="text-white/60">{selectedCoinData.symbol}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60">Cena:</span>
                        <span className="text-white font-medium">${selectedCoinData.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Posiadasz:</span>
                        <span className="text-white font-medium">{selectedCoinData.owned} {selectedCoin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Wartość:</span>
                        <span className="text-green-400 font-medium">${selectedCoinData.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">24h zmiana:</span>
                        <span className={`font-medium ${
                          selectedCoinData.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {selectedCoinData.change24h >= 0 ? '+' : ''}{selectedCoinData.change24h}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KryptowalutyApp;
