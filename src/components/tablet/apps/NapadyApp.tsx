
import React, { useState } from 'react';
import { ArrowLeft, Skull, TrendingUp, Clock, Star, MapPin, Users, Shield, Target, Crosshair, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';

interface NapadyAppProps {
  orgData: {
    name: string;
  };
  onHome: () => void;
}

const NapadyApp: React.FC<NapadyAppProps> = ({ orgData, onHome }) => {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [acceptedContracts, setAcceptedContracts] = useState<string[]>([]);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  
  // TODO: Fetch from database - crypto_wallet table
  const [userCrypto, setUserCrypto] = useState({
    LCOIN: 5.34,
    VCASH: 12.7,
    SANCOIN: 23.4,
    total: 15.75 // Łączna wartość w USD
  });

  // TODO: Fetch from database - crypto_contracts table
  const [contracts, setContracts] = useState([
    {
      id: 'HIT001',
      title: 'Eliminacja Rival Gang Leader',
      target: 'Carlos "El Jefe" Rodriguez',
      location: 'Downtown Los Santos',
      difficulty: 'Legendary',
      reward: { amount: 8.5, currency: 'LCOIN', icon: '🏛️' },
      timeLimit: '24h',
      description: 'Zlikwiduj lidera konkurencyjnej organizacji. Wysoki poziom ochrony.',
      requirements: ['Minimum 2.0 LCOIN', 'Ranga: ZASTĘPCA+', 'Doświadczenie w eliminacjach'],
      riskLevel: 'Bardzo wysokie',
      success_rate: '35%',
      participants: 2,
      max_participants: 4,
      status: 'available'
    },
    {
      id: 'HIT002',
      title: 'Napad na Bank Centralny',
      target: 'Fleeca Bank - Main Vault',
      location: 'Vinewood',
      difficulty: 'Epic',
      reward: { amount: 15.2, currency: 'VCASH', icon: '🌴' },
      timeLimit: '48h',
      description: 'Skoordynowany napad na główny skarbiec banku. Wymagana precyzja.',
      requirements: ['Minimum 5.0 VCASH', 'Ranga: STARSZY CZŁONEK+', 'Zespół 4 osób'],
      riskLevel: 'Wysokie',
      success_rate: '60%',
      participants: 1,
      max_participants: 4,
      status: 'available'
    },
    {
      id: 'HIT003',
      title: 'Sabotaż Rywala',
      target: 'Biker Gang Warehouse',
      location: 'Sandy Shores',
      difficulty: 'Rare',
      reward: { amount: 25.7, currency: 'SANCOIN', icon: '🏔️' },
      timeLimit: '72h',
      description: 'Zniszcz magazyn konkurencyjnej grupy i ukradnij ich zapasy.',
      requirements: ['Minimum 8.0 SANCOIN', 'Ranga: CZŁONEK+', 'Doświadczenie w sabotażu'],
      riskLevel: 'Średnie',
      success_rate: '75%',
      participants: 3,
      max_participants: 3,
      status: 'in_progress'
    },
    {
      id: 'HIT004',
      title: 'Porwanie VIP',
      target: 'Biznesmen - Marcus Sterling',
      location: 'Rockford Hills',
      difficulty: 'Epic',
      reward: { amount: 6.0, currency: 'LCOIN', icon: '🏛️' },
      timeLimit: '18h',
      description: 'Porwaj wpływowego biznesmena dla okupu. Operacja kidnappingu.',
      requirements: ['Minimum 1.5 LCOIN', 'Ranga: ZASTĘPCA+', 'Doświadczenie w porwaniach'],
      riskLevel: 'Bardzo wysokie',
      success_rate: '45%',
      participants: 0,
      max_participants: 3,
      status: 'available'
    },
    {
      id: 'HIT005',
      title: 'Kradzież Kryptowalut',
      target: 'Crypto Exchange Server',
      location: 'Mirror Park',
      difficulty: 'Legendary',
      reward: { amount: 45.8, currency: 'VCASH', icon: '🌴' },
      timeLimit: '6h',
      description: 'Włamania do serwerów giełdy kryptowalut i kradzież środków.',
      requirements: ['Minimum 20.0 VCASH', 'Ranga: SZEF', 'Ekspert od hackingu'],
      riskLevel: 'Ekstremalne',
      success_rate: '20%',
      participants: 0,
      max_participants: 2,
      status: 'available'
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Common': return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
      case 'Rare': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'Epic': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'Legendary': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Niskie': return 'text-green-400';
      case 'Średnie': return 'text-yellow-400';
      case 'Wysokie': return 'text-orange-400';
      case 'Bardzo wysokie': return 'text-red-400';
      case 'Ekstremalne': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'in_progress': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'completed': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'accepted': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const canAfford = (reward: typeof contracts[0]['reward']) => {
    const userAmount = userCrypto[reward.currency as keyof typeof userCrypto];
    const requiredAmount = reward.amount * 0.1; // 10% zaliczka
    return typeof userAmount === 'number' && userAmount >= requiredAmount;
  };

  const handleAcceptContract = async (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract || !canAfford(contract.reward)) return;

    setIsAccepting(contractId);
    
    // Simulate accepting contract
    setTimeout(() => {
      // Deduct deposit
      const deposit = contract.reward.amount * 0.1;
      setUserCrypto(prev => ({
        ...prev,
        [contract.reward.currency]: prev[contract.reward.currency as keyof typeof prev] - deposit
      }));

      // Update contract status
      setContracts(prev => prev.map(c => 
        c.id === contractId 
          ? { ...c, status: 'accepted', participants: c.participants + 1 }
          : c
      ));

      setAcceptedContracts(prev => [...prev, contractId]);
      setIsAccepting(null);
    }, 2000);
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
            <Skull className="text-pink-400" size={24} />
            <h1 className="text-xl font-medium">Kontrakty Krypto</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <span className="text-yellow-400 font-medium">{userCrypto.LCOIN.toFixed(2)} LCOIN</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌴</span>
              <span className="text-green-400 font-medium">{userCrypto.VCASH.toFixed(2)} VCASH</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏔️</span>
              <span className="text-blue-400 font-medium">{userCrypto.SANCOIN.toFixed(1)} SANCOIN</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-5rem)]">
        {/* Contracts List */}
        <div className="flex-1 p-6">
          <ScrollArea className="h-full [&>div>div]:!block">
            <div className="space-y-4 pr-4">
              {contracts.map((contract) => (
                <div key={contract.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-white">{contract.title}</h3>
                        <div className={`px-3 py-1 rounded-xl text-xs font-medium border ${getDifficultyColor(contract.difficulty)}`}>
                          {contract.difficulty}
                        </div>
                        <div className={`px-3 py-1 rounded-xl text-xs font-medium border ${getStatusColor(contract.status)}`}>
                          {contract.status === 'available' ? 'DOSTĘPNE' : 
                           contract.status === 'in_progress' ? 'W TRAKCIE' : 
                           contract.status === 'accepted' ? 'PRZYJĘTE' : 'UKOŃCZONE'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Target size={14} className="text-red-400" />
                          <span className="text-white/80">{contract.target}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-blue-400" />
                          <span className="text-white/80">{contract.location}</span>
                        </div>
                      </div>

                      <p className="text-white/70 mb-4">{contract.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{contract.reward.icon}</span>
                            <span className="text-yellow-400 font-bold text-lg">
                              {contract.reward.amount} {contract.reward.currency}
                            </span>
                          </div>
                          <div className="text-white/60 text-sm">Nagroda za kontrakt</div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Users size={16} className="text-blue-400" />
                            <span className="text-white font-medium">
                              {contract.participants}/{contract.max_participants}
                            </span>
                          </div>
                          <div className="text-white/60 text-sm">Uczestnicy</div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield size={16} className={getRiskColor(contract.riskLevel)} />
                            <span className={`font-medium ${getRiskColor(contract.riskLevel)}`}>
                              {contract.riskLevel}
                            </span>
                          </div>
                          <div className="text-white/60 text-sm">Poziom ryzyka</div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Star size={16} className="text-green-400" />
                            <span className="text-green-400 font-medium">
                              {contract.success_rate}
                            </span>
                          </div>
                          <div className="text-white/60 text-sm">Wskaźnik sukcesu</div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3 mb-4">
                        <h4 className="text-sm font-medium text-white mb-2">Wymagania:</h4>
                        <ul className="space-y-1">
                          {contract.requirements.map((req, index) => (
                            <li key={index} className="text-white/70 text-sm flex items-center gap-2">
                              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-orange-400" />
                          <span className="text-orange-400">Limit: {contract.timeLimit}</span>
                        </div>
                        
                        {contract.status === 'available' && (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              className="border-white/20 text-white/80 hover:bg-white/10 bg-transparent rounded-xl"
                            >
                              SZCZEGÓŁY
                            </Button>
                            <Button 
                              className={`rounded-xl ${
                                canAfford(contract.reward)
                                  ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                                  : 'bg-gray-600 hover:bg-gray-700 text-gray-300 cursor-not-allowed'
                              }`}
                              disabled={!canAfford(contract.reward) || isAccepting === contract.id}
                              onClick={() => handleAcceptContract(contract.id)}
                            >
                              {isAccepting === contract.id ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  PRZYJMUJĘ...
                                </div>
                              ) : (
                                <>
                                  <Crosshair size={16} className="mr-2" />
                                  PRZYJMIJ ({(contract.reward.amount * 0.1).toFixed(2)} {contract.reward.currency})
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                        
                        {contract.status === 'accepted' && (
                          <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                              <CheckCircle size={16} className="text-purple-400" />
                              <span className="text-purple-400 text-sm">PRZYJĘTY</span>
                            </div>
                            <Button 
                              variant="outline" 
                              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 bg-transparent rounded-xl"
                            >
                              WYKONAJ
                            </Button>
                          </div>
                        )}
                        
                        {contract.status === 'in_progress' && (
                          <Button 
                            variant="outline" 
                            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 bg-transparent rounded-xl"
                          >
                            KONTYNUUJ
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Stats Panel */}
        <div className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/10">
          <ScrollArea className="h-full [&>div>div]:!block">
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-medium mb-4">Statystyki Kontraktów</h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {contracts.filter(c => c.status === 'available').length}
                  </div>
                  <div className="text-white/60 text-sm">Dostępne kontrakty</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {contracts.filter(c => c.status === 'accepted').length}
                  </div>
                  <div className="text-white/60 text-sm">Przyjęte kontrakty</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {contracts.filter(c => c.status === 'in_progress').length}
                  </div>
                  <div className="text-white/60 text-sm">Aktywne kontrakty</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {contracts.length}
                  </div>
                  <div className="text-white/60 text-sm">Łączna liczba</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Poziomy trudności</h4>
                {['Rare', 'Epic', 'Legendary'].map((difficulty) => {
                  const count = contracts.filter(c => c.difficulty === difficulty).length;
                  return (
                    <div key={difficulty} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className={`text-sm font-medium ${getDifficultyColor(difficulty).split(' ')[0]}`}>
                        {difficulty}
                      </span>
                      <span className="text-white/80 font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Twoje saldo krypto</h4>
                <div className="space-y-2">
                  <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏛️</span>
                      <span className="text-sm">LCOIN</span>
                    </div>
                    <span className="text-yellow-400 font-medium">{userCrypto.LCOIN.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌴</span>
                      <span className="text-sm">VCASH</span>
                    </div>
                    <span className="text-green-400 font-medium">{userCrypto.VCASH.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏔️</span>
                      <span className="text-sm">SANCOIN</span>
                    </div>
                    <span className="text-blue-400 font-medium">{userCrypto.SANCOIN.toFixed(1)}</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 bg-transparent rounded-xl mt-3"
                  >
                    DOŁADUJ KONTO
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Ostrzeżenie</h4>
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Skull className="text-red-400" size={16} />
                    <span className="text-red-400 font-medium text-sm">Wysoko ryzykowne</span>
                  </div>
                  <p className="text-red-400/80 text-xs">
                    Kontrakty krypto są nielegalne i niosą wysokie ryzyko. 
                    Uczestnictwo odbywa się na własną odpowiedzialność.
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default NapadyApp;
