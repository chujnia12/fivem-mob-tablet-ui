
import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart, Search, Filter } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';

interface OrdersAppProps {
  orgData: {
    name: string;
    balance: number;
  };
  onHome: () => void;
}

const OrdersApp: React.FC<OrdersAppProps> = ({ orgData, onHome }) => {
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentOrders, setRecentOrders] = useState([
    { id: 1, items: 'Pistolet x2, Kamizelka x1', total: 13000, status: 'delivered', date: '15.07.2025', time: '14:30' },
    { id: 2, items: 'Marihuana x5', total: 10000, status: 'pending', date: '15.07.2025', time: '16:45' },
    { id: 3, items: 'SMG x1, Apteczka x3', total: 14400, status: 'processing', date: '16.07.2025', time: '09:15' },
  ]);

  const categories = [
    { id: 'all', name: 'Wszystkie', color: 'text-gray-400' },
    { id: 'weapons', name: 'Broń', color: 'text-red-400' },
    { id: 'protection', name: 'Ochrona', color: 'text-blue-400' },
    { id: 'medical', name: 'Medyczne', color: 'text-green-400' },
    { id: 'drugs', name: 'Narkotyki', color: 'text-purple-400' },
    { id: 'vehicles', name: 'Pojazdy', color: 'text-orange-400' },
    { id: 'electronics', name: 'Elektronika', color: 'text-cyan-400' },
  ];

  const products = [
    // Weapons
    { 
      id: 'pistolet', 
      name: 'Pistolet', 
      price: 5000, 
      image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop', 
      category: 'weapons', 
      description: 'Standardowy pistolet do ochrony', 
      stock: 15 
    },
    { 
      id: 'smg', 
      name: 'SMG', 
      price: 12000, 
      image: 'https://images.unsplash.com/photo-1544473244-f6895e69ad8b?w=400&h=300&fit=crop', 
      category: 'weapons', 
      description: 'Pistolet maszynowy wysokiej jakości', 
      stock: 8 
    },
    { 
      id: 'rifle', 
      name: 'Karabin', 
      price: 25000, 
      image: 'https://images.unsplash.com/photo-1562447771-4d88e3e1d783?w=400&h=300&fit=crop', 
      category: 'weapons', 
      description: 'Karabin snajperski dalekiego zasięgu', 
      stock: 3 
    },
    { 
      id: 'shotgun', 
      name: 'Strzelba', 
      price: 8000, 
      image: 'https://images.unsplash.com/photo-1544473244-f6895e69ad8b?w=400&h=300&fit=crop', 
      category: 'weapons', 
      description: 'Strzelba do walki w zwarciu', 
      stock: 12 
    },
    
    // Protection
    { 
      id: 'kamizelka', 
      name: 'Kamizelka', 
      price: 3000, 
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 
      category: 'protection', 
      description: 'Kamizelka kuloodporna', 
      stock: 20 
    },
    { 
      id: 'helmet', 
      name: 'Hełm', 
      price: 1500, 
      image: 'https://images.unsplash.com/photo-1544473244-f6895e69ad8b?w=400&h=300&fit=crop', 
      category: 'protection', 
      description: 'Hełm ochronny', 
      stock: 25 
    },
    
    // Medical
    { 
      id: 'apteczka', 
      name: 'Apteczka', 
      price: 800, 
      image: 'https://images.unsplash.com/photo-1603398938530-779d850e65da?w=400&h=300&fit=crop', 
      category: 'medical', 
      description: 'Podstawowa apteczka pierwszej pomocy', 
      stock: 50 
    },
    { 
      id: 'bandage', 
      name: 'Bandaże', 
      price: 200, 
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop', 
      category: 'medical', 
      description: 'Bandaże medyczne', 
      stock: 100 
    },
    
    // Drugs
    { 
      id: 'marihuana', 
      name: 'Marihuana', 
      price: 2000, 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 
      category: 'drugs', 
      description: 'Wysokiej jakości marihuana', 
      stock: 30 
    },
    { 
      id: 'kokaina', 
      name: 'Kokaina', 
      price: 3500, 
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop', 
      category: 'drugs', 
      description: 'Czysta kokaina', 
      stock: 15 
    },
    
    // Vehicles
    { 
      id: 'motorcycle', 
      name: 'Motocykl', 
      price: 45000, 
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 
      category: 'vehicles', 
      description: 'Szybki motocykl do ucieczek', 
      stock: 2 
    },
    { 
      id: 'car', 
      name: 'Samochód', 
      price: 85000, 
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop', 
      category: 'vehicles', 
      description: 'Opancerzony samochód', 
      stock: 1 
    },
    
    // Electronics
    { 
      id: 'phone', 
      name: 'Telefon', 
      price: 1200, 
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', 
      category: 'electronics', 
      description: 'Szyfrowany telefon', 
      stock: 25 
    },
    { 
      id: 'radio', 
      name: 'Radio', 
      price: 800, 
      image: 'https://images.unsplash.com/photo-1558584673-c834fb7c974a?w=400&h=300&fit=crop', 
      category: 'electronics', 
      description: 'Radio dalekiego zasięgu', 
      stock: 15 
    },
  ];

  const updateQuantity = (productId: string, change: number) => {
    setCart(prev => {
      const newQuantity = (prev[productId] || 0) + change;
      if (newQuantity <= 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <ShoppingCart className="text-orange-400" size={24} />
            <h1 className="text-xl font-medium">Centrum Zamówień</h1>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm px-6 py-2 rounded-xl border border-white/10">
          <span className="text-white/60 text-sm">Saldo organizacji: </span>
          <span className="font-bold text-green-400">${orgData.balance.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex h-[calc(100%-5rem)]">
        {/* Products Section */}
        <div className="flex-1 p-6 space-y-6">
          {/* Search and Category Filter */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <Input
                  placeholder="Szukaj produktów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-white/20 text-white/80 hover:bg-white/10 bg-transparent rounded-xl"
              >
                <Filter size={20} />
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  size="sm"
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`${selectedCategory === category.id 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'border-white/20 text-white/80 hover:bg-white/10 bg-transparent'} rounded-xl`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <ScrollArea className="h-[calc(100%-8rem)] rounded-2xl">
            <div className="grid grid-cols-3 gap-4 pr-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-200">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-white text-xs">Dostępne: {product.stock}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 text-white">{product.name}</h3>
                    <div className="text-white/60 text-xs mb-3 h-8 line-clamp-2">{product.description}</div>
                    <div className="text-green-400 font-bold text-lg mb-4">${product.price.toLocaleString()}</div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(product.id, -1)}
                          className="w-8 h-8 p-0 border-white/20 text-white hover:bg-white/10 bg-transparent rounded-xl"
                          disabled={!cart[product.id]}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center font-medium text-white">
                          {cart[product.id] || 0}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-8 h-8 p-0 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                          disabled={product.stock <= (cart[product.id] || 0)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Cart and Orders Summary */}
        <div className="w-96 bg-white/5 backdrop-blur-sm border-l border-white/10 p-6 space-y-6">
          {/* Current Cart */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <ShoppingCart size={20} className="text-orange-400" />
              Koszyk
            </h3>
            
            {getTotalItems() === 0 ? (
              <div className="text-white/60 text-center py-8 bg-white/5 rounded-xl border border-white/10">
                Koszyk jest pusty
              </div>
            ) : (
              <>
                <ScrollArea className="max-h-48 rounded-xl">
                  <div className="space-y-3 pr-4">
                    {Object.entries(cart).map(([productId, quantity]) => {
                      const product = products.find(p => p.id === productId);
                      if (!product) return null;
                      
                      return (
                        <div key={productId} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium text-sm text-white">{product.name}</div>
                              <div className="text-white/60 text-xs">
                                {quantity}x ${product.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-green-400">
                            ${(product.price * quantity).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Razem:</span>
                    <span className="text-green-400 text-xl">${getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    Łącznie przedmiotów: {getTotalItems()}
                  </div>
                </div>
                
                <Button 
                  className={`w-full h-12 rounded-xl text-white ${
                    getTotalPrice() > orgData.balance 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                  disabled={getTotalPrice() > orgData.balance}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {getTotalPrice() > orgData.balance ? 'Niewystarczające środki' : 'Złóż Zamówienie'}
                </Button>
              </>
            )}
          </div>

          {/* Recent Orders */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-white">Ostatnie Zamówienia</h3>
            <ScrollArea className="max-h-64 rounded-xl">
              <div className="space-y-3 pr-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium text-white">Zamówienie #{order.id}</div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'delivered' ? 'bg-green-400/20 text-green-400' :
                        order.status === 'processing' ? 'bg-blue-400/20 text-blue-400' :
                        'bg-orange-400/20 text-orange-400'
                      }`}>
                        {order.status === 'delivered' ? 'Dostarczone' :
                         order.status === 'processing' ? 'W realizacji' : 'Oczekuje'}
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">{order.items}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-green-400 font-bold text-sm">${order.total.toLocaleString()}</div>
                      <div className="text-white/40 text-xs">{order.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersApp;
