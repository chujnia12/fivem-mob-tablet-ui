
import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '../../ui/button';

interface OrdersAppProps {
  orgData: {
    name: string;
    balance: number;
  };
  onHome: () => void;
}

const OrdersApp: React.FC<OrdersAppProps> = ({ orgData, onHome }) => {
  const [cart, setCart] = useState<{[key: string]: number}>({});

  const products = [
    { id: 'pistolet', name: 'Pistolet', price: 5000, icon: '🔫' },
    { id: 'smg', name: 'SMG', price: 12000, icon: '🔫' },
    { id: 'kamizelka', name: 'Kamizelka', price: 3000, icon: '🛡️' },
    { id: 'apteczka', name: 'Apteczka', price: 800, icon: '🏥' },
    { id: 'marihuana', name: 'Marihuana', price: 2000, icon: '🌿' },
    { id: 'kokaina', name: 'Kokaina', price: 3500, icon: '💊' },
    { id: 'metamfetamina', name: 'Metamfetamina', price: 4000, icon: '🧪' },
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
          <h1 className="text-2xl font-bold">Zamówienia</h1>
        </div>
        <div className="bg-red-600 px-4 py-2 rounded-lg">
          <span className="text-sm">Saldo organizacji: </span>
          <span className="font-bold">{orgData.balance.toLocaleString()}$</span>
        </div>
      </div>

      <div className="flex h-[calc(100%-5rem)]">
        {/* Products */}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="text-red-400" size={24} />
            <h2 className="text-xl font-bold text-red-400">Wybierz produkty do zamówienia</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{product.icon}</div>
                  <h3 className="font-bold mb-1">{product.name}</h3>
                  <div className="text-green-400 font-semibold mb-4">{product.price}$</div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="w-8 text-center font-bold">
                      {cart[product.id] || 0}
                    </span>
                    <Button
                      size="sm"
                      className="w-8 h-8 p-0 bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => updateQuantity(product.id, 1)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-4">Podsumowanie zamówienia:</h3>
          
          {getTotalItems() === 0 ? (
            <div className="text-gray-400 text-center py-8">Koszyk jest pusty</div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {Object.entries(cart).map(([productId, quantity]) => {
                  const product = products.find(p => p.id === productId);
                  if (!product) return null;
                  
                  return (
                    <div key={productId} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-400">
                          {quantity}x {product.price}$
                        </div>
                      </div>
                      <div className="font-bold">
                        {(product.price * quantity).toLocaleString()}$
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Suma: </span>
                  <span className="text-2xl">{getTotalPrice().toLocaleString()}$</span>
                </div>
              </div>
              
              <Button className="w-full bg-gray-600 hover:bg-gray-700 h-12">
                <ShoppingCart size={20} className="mr-2" />
                Złóż Zamówienie
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersApp;
