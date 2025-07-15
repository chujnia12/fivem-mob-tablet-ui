
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Car, DollarSign, Clock, Navigation, Zap } from 'lucide-react';

interface TrackerAppProps {
  orgData: {
    name: string;
    rank: number;
    id: number;
    balance: number;
    crypto_balance: number;
  };
  onHome: () => void;
  onPurchase: (price: number) => boolean;
}

interface Vehicle {
  id: string;
  model: string;
  location: string;
  value: number;
  difficulty: 'Łatwy' | 'Średni' | 'Trudny';
  timeLeft: number;
  area: string;
}

const TrackerApp: React.FC<TrackerAppProps> = ({ orgData, onHome, onPurchase }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [trackedVehicles, setTrackedVehicles] = useState<string[]>([]);

  const availableVehicles: Vehicle[] = [
    {
      id: '1',
      model: 'BMW X5',
      location: 'Centrum handlowe',
      value: 85000,
      difficulty: 'Średni',
      timeLeft: 45,
      area: 'Centrum miasta'
    },
    {
      id: '2',
      model: 'Mercedes G-Class',
      location: 'Dzielnica biznesowa',
      value: 120000,
      difficulty: 'Trudny',
      timeLeft: 23,
      area: 'Dzielnica finansowa'
    },
    {
      id: '3',
      model: 'Audi A4',
      location: 'Parking przy restauracji',
      value: 45000,
      difficulty: 'Łatwy',
      timeLeft: 67,
      area: 'Stare miasto'
    },
    {
      id: '4',
      model: 'Porsche Cayenne',
      location: 'Hotel luksusowy',
      value: 95000,
      difficulty: 'Trudny',
      timeLeft: 12,
      area: 'Dzielnica hotelowa'
    }
  ];

  useEffect(() => {
    setVehicles(availableVehicles);
  }, []);

  const handleTrackVehicle = (vehicle: Vehicle) => {
    const price = 2.5; // Koszt namierzania pojazdu
    
    if (onPurchase(price)) {
      setTrackedVehicles(prev => [...prev, vehicle.id]);
      setSelectedVehicle(vehicle);
      
      // Symulacja wysłania SMS-a z obszarem pojazdu
      console.log(`SMS wysłany: Pojazd ${vehicle.model} namierzony w obszarze: ${vehicle.area}`);
      alert(`SMS wysłany na telefon!\nNamierzono pojazd: ${vehicle.model}\nObszar: ${vehicle.area}`);
    } else {
      alert('Niewystarczające środki!');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Łatwy': return 'text-green-400';
      case 'Średni': return 'text-yellow-400';
      case 'Trudny': return 'text-red-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-white/10 px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onHome}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-blue-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Tracker Pojazdów</h1>
            <p className="text-xs text-white/60">Znajdź pojazdy do kradzieży</p>
          </div>
          <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/10 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-xs text-white/60">Saldo</p>
              <p className="text-sm font-bold text-orange-400">{orgData.crypto_balance.toFixed(2)} COIN</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-4rem)]">
        {/* Lista pojazdów */}
        <div className="w-1/2 p-6 border-r border-white/10">
          <h2 className="text-lg font-bold text-white mb-4">Dostępne pojazdy</h2>
          <div className="space-y-3 overflow-y-auto custom-scrollbar h-full">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`bg-white/5 backdrop-blur-sm border rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer ${
                  selectedVehicle?.id === vehicle.id ? 'border-blue-400/50 bg-blue-500/10' : 'border-white/10'
                }`}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Car size={16} className="text-blue-400" />
                    <h3 className="text-sm font-bold text-white">{vehicle.model}</h3>
                  </div>
                  <span className={`text-xs font-medium ${getDifficultyColor(vehicle.difficulty)}`}>
                    {vehicle.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={12} className="text-white/60" />
                  <span className="text-xs text-white/70">{vehicle.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={12} className="text-green-400" />
                    <span className="text-xs text-green-400">{vehicle.value.toLocaleString()} PLN</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-orange-400" />
                    <span className="text-xs text-orange-400">{vehicle.timeLeft}min</span>
                  </div>
                </div>

                {trackedVehicles.includes(vehicle.id) && (
                  <div className="mt-2 flex items-center gap-1">
                    <Zap size={12} className="text-blue-400" />
                    <span className="text-xs text-blue-400">Namierzony</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Szczegóły pojazdu */}
        <div className="w-1/2 p-6">
          {selectedVehicle ? (
            <div className="h-full flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4">Szczegóły pojazdu</h2>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Car size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedVehicle.model}</h3>
                    <p className="text-sm text-white/70">{selectedVehicle.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-white/60 mb-1">Wartość</p>
                    <p className="text-lg font-bold text-green-400">{selectedVehicle.value.toLocaleString()} PLN</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Trudność</p>
                    <p className={`text-lg font-bold ${getDifficultyColor(selectedVehicle.difficulty)}`}>
                      {selectedVehicle.difficulty}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-white/60 mb-1">Pozostały czas</p>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-orange-400" />
                    <p className="text-lg font-bold text-orange-400">{selectedVehicle.timeLeft} minut</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-white/60 mb-2">Obszar</p>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-sm text-white/80">
                      {selectedVehicle.area}
                    </p>
                  </div>
                </div>
              </div>

              {!trackedVehicles.includes(selectedVehicle.id) ? (
                <button
                  onClick={() => handleTrackVehicle(selectedVehicle)}
                  disabled={orgData.crypto_balance < 2.5}
                  className={`w-full py-3 rounded-xl transition-colors font-medium backdrop-blur-sm border ${
                    orgData.crypto_balance >= 2.5
                      ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/30'
                      : 'bg-white/5 text-white/40 cursor-not-allowed border-white/10'
                  }`}
                >
                  {orgData.crypto_balance >= 2.5 ? 'Namierz pojazd (2.5 COIN)' : 'Niewystarczające środki'}
                </button>
              ) : (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Navigation size={20} className="text-green-400" />
                    <span className="text-green-400 font-bold">Pojazd namierzony</span>
                  </div>
                  <p className="text-sm text-white/70">
                    SMS z lokalizacją został wysłany
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-white/30 mx-auto mb-4" />
                <p className="text-white/60">Wybierz pojazd aby zobaczyć szczegóły</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackerApp;
