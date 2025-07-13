import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, Truck, Shield, Droplets, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

// Direct Supabase import
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cypdviizsrdrirfqujss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cGR2aWl6c3JkcmlyZnF1anNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDcxOTgsImV4cCI6MjA2NzYyMzE5OH0.26qQGdq26fEkJOTxgrTBOdyxoKyfMyjNgbG3csF3h6c';
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple currency formatter
const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

interface Product {
  id: number;
  size: string;
  price: number;
  originalPrice?: number;
  images: string[];
  features: string[];
  rating: number;
  reviews: number;
  description: string;
}

const OrderPage = () => {
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const products: Product[] = [
    {
      id: 1,
      size: '300ml',
      price: 15,
      originalPrice: 20,
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1594736797933-d0ab46a8cdd1?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=600&fit=crop'
      ],
      features: ['BPA-Free', 'Leak-Proof', 'Compact Design'],
      rating: 4.8,
      reviews: 124,
      description: 'Perfect for personal use and on-the-go hydration'
    },
    {
      id: 2,
      size: '500ml',
      price: 25,
      originalPrice: 30,
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571063030474-ef52d0c85b3b?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop'
      ],
      features: ['BPA-Free', 'Leak-Proof', 'Ergonomic Grip', 'Wide Mouth'],
      rating: 4.9,
      reviews: 89,
      description: 'Ideal for daily hydration needs and office use'
    },
    {
      id: 3,
      size: '1L',
      price: 40,
      originalPrice: 50,
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583394838892-84c63efcac09?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=600&fit=crop'
      ],
      features: ['BPA-Free', 'Leak-Proof', 'Large Capacity', 'Handle Grip', 'Ice Compatible'],
      rating: 4.7,
      reviews: 156,
      description: 'Perfect for families, sports, and extended activities'
    }
  ];

  // Image slideshow effect - changes every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newIndex = { ...prev };
        products.forEach(product => {
          const currentIndex = newIndex[product.id] || 0;
          newIndex[product.id] = (currentIndex + 1) % product.images.length;
        });
        return newIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [productId, count]) => {
      const product = products.find(p => p.id === parseInt(productId));
      return sum + (product ? product.price * count : 0);
    }, 0);
  };

  // Process order and save to Supabase
  const processOrder = async () => {
    if (getTotalItems() === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      // Create order items array
      const orderItems = Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId));
        return {
          productId: parseInt(productId),
          size: product?.size || '',
          quantity,
          price: product?.price || 0,
          totalPrice: (product?.price || 0) * quantity
        };
      });

      // Simple order data structure to match your table
      const orderData = {
        items: orderItems,
        totalItems: getTotalItems(),
        totalAmount: getTotalPrice(),
        orderStatus: 'pending'
      };

      // Insert into Supabase - matching your table structure exactly
      const { data, error } = await supabase
        .from('orders')
        .insert([              // THIS IS THE CORRECT INSERTION DONT CHANGE!!
          {
            Order: orderData,
            Ordered_At: new Date().toISOString(),
            Total: getTotalPrice(),     
            Customer_name: 'Walk-in Customer'
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        alert('Failed to process order. Please try again.');
        return;
      }

      console.log('Order saved successfully:', data);

      // Send notification
      try {
        const itemsList = orderItems
          .map(item => `${item.quantity}x ${item.size} - ${formatCurrency(item.totalPrice)}`)
          .join('\n');
        
        const message = `🛒 New Order Received!

💰 Total: ${formatCurrency(getTotalPrice())}
📦 Items: ${getTotalItems()}

Order Details:
${itemsList}`;
        
        await fetch('https://ntfy.sh/kbb-orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'Title': 'New K B Beverages Order',
            'Tags': 'shopping_cart,money_with_wings',
            'Priority': 'high'
          },
          body: message,
        });
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
        // Don't fail the order if notification fails
      }

      // Success - show confirmation and clear cart
      alert(`Order placed successfully!\nTotal: ${formatCurrency(getTotalPrice())}`);
      setCart({});
      setIsCartOpen(false);

    } catch (error) {
      console.error('Order processing error:', error);
      alert('Failed to process order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hover:bg-blue-50 transition-colors duration-300">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                K B Bevereges
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="relative hover:bg-blue-50 transition-colors duration-300">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 animate-pulse">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="text-2xl text-gray-800">Order Summary</SheetTitle>
                  </SheetHeader>
                  
                  {getTotalItems() > 0 ? (
                    <div className="mt-6 space-y-6">
                      {/* Order Items */}
                      <div className="space-y-4 max-h-60 overflow-y-auto">
                        {Object.entries(cart).map(([productId, count]) => {
                          const product = products.find(p => p.id === parseInt(productId));
                          if (!product) return null;
                          return (
                            <div key={productId} className="flex items-center justify-between py-3 border-b border-gray-100">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{product.size} Bottle</h4>
                                <p className="text-sm text-gray-600">{formatCurrency(product.price)} each</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFromCart(product.id)}
                                  className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
                                  {count}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addToCart(product.id)}
                                  className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="ml-4 font-semibold text-gray-800">
                                {formatCurrency(product.price * count)}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between text-xl font-bold text-gray-800 pt-4 border-t border-gray-200">
                        <span>Total ({getTotalItems()} items)</span>
                        <span>{formatCurrency(getTotalPrice())}</span>
                      </div>

                      {/* Place Order Button */}
                      <Button 
                        onClick={processOrder}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg mt-6"
                      >
                        Place Order - {formatCurrency(getTotalPrice())}
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-8 text-center">
                      <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Your cart is empty</p>
                      <p className="text-gray-400 text-sm mt-2">Add some bottles to get started!</p>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
              <div className="text-lg font-semibold text-gray-800">
                {formatCurrency(getTotalPrice())}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
            Choose Your
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Perfect Bottle
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in">
            Premium quality water bottles designed for your lifestyle. Each bottle is crafted with care and comes with our satisfaction guarantee.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-600 animate-fade-in">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Quality Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span>100% Pure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Product Image with Slideshow */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={product.images[currentImageIndex[product.id] || 0]} 
                    alt={`${product.size} Water Bottle`}
                    className="w-full h-full object-cover transition-all duration-1000 ease-in-out transform group-hover:scale-110"
                  />
                  {product.originalPrice && (
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse">
                      Save {formatCurrency(product.originalPrice - product.price)}
                    </Badge>
                  )}
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {product.images.map((_, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          (currentImageIndex[product.id] || 0) === imgIndex 
                            ? 'bg-white' 
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">{product.size}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-300">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-blue-600">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
                      )}
                    </div>
                  </div>

                  {/* Cart Controls */}
                  <div className="flex items-center justify-between">
                    {cart[product.id] ? (
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(product.id)}
                          className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 transition-colors duration-300"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
                          {cart[product.id]}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(product.id)}
                          className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 transition-colors duration-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => addToCart(product.id)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            K B Bevereges
          </div>
          <p className="text-gray-400">Pure Water, Pure Life</p>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default OrderPage;
