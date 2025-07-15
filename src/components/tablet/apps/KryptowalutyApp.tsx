
import React, { useState } from 'react';
import { ArrowLeft, Bitcoin, TrendingUp, TrendingDown, RefreshCw, DollarSign, CreditCard, ArrowUpDown, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '../../ui/dialog';

interface KryptowalutyAppProps {
  orgData: {
    name: string;
    crypto_balance: number;
  };
  onHome: () => void;
}

const KryptowalutyApp: React.FC<KryptowalutyAppProps> = ({ orgData, onHome }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('LCOIN');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferWallet, setTransferWallet] = useState('');
  const [transferCrypto, setTransferCrypto] = useState('LCOIN');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // TODO: Replace with database fetch from tablet_crypto_portfolio and tablet_crypto_prices
  const [wallets, setWallets] = useState([]);

  // TODO: Replace with database fetch from tablet_crypto_transactions
  const [transactions, setTransactions] = useState([]);

  const totalBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance * wallet.price_usd), 0);

  const handlePurchase = () => {
    if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) return;

    const amount = parseFloat(purchaseAmount);
    const wallet = wallets.find(w => w.currency === selectedCrypto);
    if (!wallet) return;

    // TODO: Send to backend/database - INSERT INTO tablet_crypto_transactions
    setWallets(prev => prev.map(w => 
      w.currency === selectedCrypto 
        ? { ...w, balance: w.balance + amount }
        : w
    ));

    const newTransaction = {
      id: `tx_${Date.now()}`,
      type: 'purchase' as const,
      amount: amount,
      currency: selectedCrypto,
      date: new Date().toISOString(),
      status: 'completed' as const,
      from: 'Karta bankowa',
      to: wallet.address
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setPurchaseAmount('');
    setIsPurchasing(false);
  };

  const handleTransfer = () => {
    if (!transferAmount || !transferWallet || parseFloat(transferAmount) <= 0) return;

    const amount = parseFloat(transferAmount);
    const wallet = wallets.find(w => w.currency === transferCrypto);
    if (!wallet || wallet.balance < amount) return;

    // TODO: Send to backend/database - INSERT INTO tablet_crypto_transactions
    setWallets(prev => prev.map(w => 
      w.currency === transferCrypto 
        ? { ...w, balance: w.balance - amount }
        : w
    ));

    const newTransaction = {
      id: `tx_${Date.now()}`,
      type: 'transfer' as const,
      amount: amount,
      currency: transferCrypto,
      date: new Date().toISOString(),
      status: 'completed' as const,
      from: wallet.address,
      to: transferWallet
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setTransferAmount('');
    setTransferWallet('');
    setIsTransferring(false);
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <CreditCard size={16} className="text-green-400" />;
      case 'transfer': return <ArrowUpDown size={16} className="text-blue-400" />;
      case 'receive': return <TrendingUp size={16} className="text-purple-400" />;
      default: return <Bitcoin size={16} className="text-yellow-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-green-400';
      case 'receive': return 'text-green-400';
      case 'transfer': return 'text-red-400';
      default: return 'text-white';
    }
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
          <div className="flex items-center gap-3">
            <Bitcoin className="text-yellow-400" size={24} />
            <h1 className="text-xl font-medium">Portfel Kryptowalut</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white border border-white/20 rounded-xl hover:bg-white/10"
          >
            <RefreshCw size={16} className="mr-2" />
            Odśwież
          </Button>

          <Dialog open={isPurchasing} onOpenChange={setIsPurchasing}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                <CreditCard size={16} className="mr-2" />
                Kup Krypto
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Kup Kryptowalutę</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/80">Kryptowaluta</label>
                  <select
                    value={selectedCrypto}
                    onChange={(e) => setSelectedCrypto(e.target.value)}
                    className="w-full mt-1 p-2 bg-gray-800 border border-white/20 rounded-md text-white [&>option]:bg-gray-800 [&>option]:text-white"
                  >
                    {wallets.map(wallet => (
                      <option key={wallet.currency} value={wallet.currency}>
                        {wallet.icon} {wallet.name} ({wallet.currency})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/80">Ilość</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-1"
                  />
                </div>
                {purchaseAmount && (
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-sm text-white/80">Koszt zakupu:</div>
                    <div className="text-xl font-bold text-green-400">
                      {formatCurrency(parseFloat(purchaseAmount) * (wallets.find(w => w.currency === selectedCrypto)?.price_usd || 0))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsPurchasing(false)}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Anuluj
                </Button>
                <Button 
                  onClick={handlePurchase}
                  disabled={!purchaseAmount || parseFloat(purchaseAmount) <= 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Kup teraz
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isTransferring} onOpenChange={setIsTransferring}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <ArrowUpDown size={16} className="mr-2" />
                Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Transfer Kryptowaluty</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/80">Kryptowaluta</label>
                  <select
                    value={transferCrypto}
                    onChange={(e) => setTransferCrypto(e.target.value)}
                    className="w-full mt-1 p-2 bg-gray-800 border border-white/20 rounded-md text-white [&>option]:bg-gray-800 [&>option]:text-white"
                  >
                    {wallets.map(wallet => (
                      <option key={wallet.currency} value={wallet.currency}>
                        {wallet.icon} {wallet.name} - {wallet.balance.toFixed(4)} {wallet.currency}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/80">Adres portfela odbiorcy</label>
                  <Input
                    placeholder="Wprowadź adres portfela..."
                    value={transferWallet}
                    onChange={(e) => setTransferWallet(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/80">Ilość</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsTransferring(false)}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Anuluj
                </Button>
                <Button 
                  onClick={handleTransfer}
                  disabled={!transferAmount || !transferWallet || parseFloat(transferAmount) <= 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Wyślij
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6 space-y-6 h-[calc(100%-5rem)]">
        {/* Total Balance */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Bitcoin size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Łączne saldo</p>
                <p className="text-white/60 text-xs">Wszystkie portfele</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white/60 hover:bg-white/10"
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </Button>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {showBalance ? formatCurrency(totalBalance) : '••••••'}
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp size={16} className="text-green-400 mr-1" />
            <span className="text-green-400">+8.3% dzisiaj</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-12rem)]">
          {/* Wallets */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Twoje portfele</h3>
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                {wallets.length === 0 ? (
                  <div className="text-center py-8">
                    <Bitcoin size={48} className="text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">Brak portfeli kryptowalut</p>
                    <p className="text-white/40 text-sm">Dane zostaną załadowane z bazy danych</p>
                  </div>
                ) : (
                  wallets.map((wallet) => (
                    <div key={wallet.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{wallet.icon}</span>
                          <div>
                            <h4 className="text-white font-medium">{wallet.name}</h4>
                            <p className="text-white/60 text-sm">{wallet.currency}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${
                          wallet.change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {wallet.change_24h >= 0 ? 
                            <TrendingUp size={14} /> : 
                            <TrendingDown size={14} />
                          }
                          {Math.abs(wallet.change_24h)}%
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-white/60 text-sm">Saldo:</span>
                          <span className="text-white font-medium">
                            {showBalance ? `${wallet.balance.toFixed(4)} ${wallet.currency}` : '••••••'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60 text-sm">Wartość USD:</span>
                          <span className="text-green-400 font-medium">
                            {showBalance ? formatCurrency(wallet.balance * wallet.price_usd) : '••••••'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60 text-sm">Cena:</span>
                          <span className="text-white/80">{formatCurrency(wallet.price_usd)}</span>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-white/60 text-xs mb-1">Adres portfela:</div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-white/80 text-sm font-mono break-all flex-1">{wallet.address}</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(wallet.address)}
                            className="text-white/60 hover:text-white hover:bg-white/10 p-1 h-auto min-w-0"
                          >
                            {copiedAddress === wallet.address ? 
                              <Check size={14} className="text-green-400" /> : 
                              <Copy size={14} />
                            }
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Transactions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ostatnie transakcje</h3>
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard size={48} className="text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">Brak transakcji</p>
                    <p className="text-white/40 text-sm">Dane zostaną załadowane z bazy danych</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <div className="text-white font-medium capitalize">
                              {transaction.type === 'purchase' ? 'Zakup' :
                               transaction.type === 'transfer' ? 'Transfer' : 'Otrzymano'}
                            </div>
                            <div className="text-white/60 text-sm">
                              {new Date(transaction.date).toLocaleDateString('pl-PL', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className={`text-right font-medium ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'transfer' ? '-' : '+'}
                          {transaction.amount.toFixed(4)} {transaction.currency}
                        </div>
                      </div>
                      
                      <div className="text-xs text-white/50 space-y-1">
                        <div>Z: {transaction.from}</div>
                        <div>Do: {transaction.to}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default KryptowalutyApp;
