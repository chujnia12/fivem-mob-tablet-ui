
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
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [tradeType, setTradeType] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');

  // TODO: Fetch from database - crypto_portfolio, crypto_prices tables
  // TODO: Real-time price updates via API/websocket
  const cryptoData = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67342.50,
      change24h: 2.45,
      owned: 0.2847,
      value: 19173.82
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3842.15,
      change24h: -1.23,
      owned: 2.1,
      value: 8068.52
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      price: 1.0002,
      change24h: 0.01,
      owned: 15420.0,
      value: 15423.08
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 642.78,
      change24h: 4.12,
      owned: 5.8,
      value: 3728.12
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.4567,
      change24h: -3.45,
      owned: 8432.0,
      value: 3851.47
    },
    {
      symbol: 'DOT',
      name: 'Polkadot',
      price: 7.23,
      change24h: 1.87,
      owned: 234.5,
      value: 1695.44
    }
  ];

  const priceHistory = [
    { time: '00:00', BTC: 65200, ETH: 3756, ADA: 0.47 },
    { time: '04:00', BTC: 66100, ETH: 3812, ADA: 0.46 },
    { time: '08:00', BTC: 66800, ETH: 3834, ADA: 0.45 },
    { time: '12:00', BTC: 67200, ETH: 3867, ADA: 0.44 },
    { time: '16:00', BTC: 67100, ETH: 3821, ADA: 0.46 },
    { time: '20:00', BTC: 67342, ETH: 3842, ADA: 0.46 }
  ];

  const transactions = [
    {
      id: 'TX001',
      type: 'buy',
      symbol: 'BTC',
      amount: 0.05,
      price: 65800,
      total: 3290,
      timestamp: '2024-01-15 14:30'
    },
    {
      id: 'TX002',
      type: 'sell',
      symbol: 'ETH',
      amount: 0.5,
      price: 3950,
      total: 1975,
      timestamp: '2024-01-15 12:15'
    },
    {
      id: 'TX003',
      type: 'buy',
      symbol: 'ADA',
      amount: 1000,
      price: 0.48,
      total: 480,
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

      <div className="flex h-[calc(100%-5rem)]">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Portfolio Overview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-medium mb-4">Twoje Portfolio</h3>
            <div className="grid grid-cols-3 gap-4">
              {cryptoData.slice(0, 6).map((coin) => (
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
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <span className="text-yellow-400 font-bold text-xs">{coin.symbol}</span>
                      </div>
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
        </div>

        {/* Trading Panel */}
        <div className="w-96 bg-white/5 backdrop-blur-sm border-l border-white/10">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Trading */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Handel</h3>
                
                <div className="bg-white/5 rounded-xl p-4 space-y-4">
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
                      KUP
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

                    {selectedCoinData && (
                      <div className="bg-white/5 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Cena:</span>
                          <span className="text-white">${selectedCoinData.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Posiadasz:</span>
                          <span className="text-white">{selectedCoinData.owned} {selectedCoin}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Wartość:</span>
                          <span className="text-green-400">${selectedCoinData.value.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

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
              </div>

              {/* Recent Transactions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ostatnie Transakcje</h3>
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            tx.type === 'buy' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {tx.type === 'buy' ? 'KUP' : 'SPRZEDAJ'}
                          </div>
                          <span className="font-medium">{tx.symbol}</span>
                        </div>
                        <span className="text-white/80 font-medium">
                          ${tx.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-white/60">
                        {tx.amount} {tx.symbol} @ ${tx.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        {tx.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Statystyki</h3>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-sm text-white/60 mb-1">Całkowita wartość</div>
                    <div className="text-lg font-bold text-green-400">
                      ${totalPortfolioValue.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-sm text-white/60 mb-1">Dzienny P&L</div>
                    <div className="text-lg font-bold text-green-400">
                      +$1,247.32 (+2.1%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default KryptowalutyApp;
