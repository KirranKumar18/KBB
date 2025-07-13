import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Truck, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getOrderStatus, formatCurrency } from '@/utils/orderUtils';

interface OrderTrackingProps {
  orderId?: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId: initialOrderId }) => {
  const [orderId, setOrderId] = useState(initialOrderId || '');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getOrderStatus(orderId);
      
      if (error) {
        throw error;
      }

      if (!data) {
        setError('Order not found');
        return;
      }

      setOrder(data);
    } catch (err) {
      setError('Failed to fetch order details');
      console.error('Error tracking order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      trackOrder();
    }
  }, [initialOrderId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Track Your Order</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Order ID Input */}
          <div className="flex space-x-4 mb-6">
            <Input
              placeholder="Enter your order ID (e.g., KB-1234567890-ABCDE)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={trackOrder}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              {error}
            </div>
          )}

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.ordered_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.order.orderStatus)}
                  <Badge className={getStatusColor(order.order.orderStatus)}>
                    {order.order.orderStatus.charAt(0).toUpperCase() + order.order.orderStatus.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {order.order.customerName}</p>
                      <p><strong>Email:</strong> {order.order.email}</p>
                      <p><strong>Phone:</strong> {order.order.phone}</p>
                      <p><strong>Address:</strong> {order.order.address}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Total Items:</strong> {order.order.totalItems}</p>
                      <p><strong>Total Amount:</strong> {formatCurrency(order.order.totalAmount)}</p>
                      <p><strong>Payment Status:</strong> 
                        <Badge className={`ml-2 ${order.order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.order.paymentStatus.charAt(0).toUpperCase() + order.order.paymentStatus.slice(1)}
                        </Badge>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.size} Water Bottle</h4>
                          <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`flex items-center space-x-3 ${order.order.orderStatus === 'pending' ? 'text-blue-600' : 'text-gray-400'}`}>
                      <Clock className="h-5 w-5" />
                      <span>Order Placed</span>
                    </div>
                    <div className={`flex items-center space-x-3 ${order.order.orderStatus === 'processing' ? 'text-blue-600' : 'text-gray-400'}`}>
                      <Package className="h-5 w-5" />
                      <span>Processing</span>
                    </div>
                    <div className={`flex items-center space-x-3 ${order.order.orderStatus === 'shipped' ? 'text-blue-600' : 'text-gray-400'}`}>
                      <Truck className="h-5 w-5" />
                      <span>Shipped</span>
                    </div>
                    <div className={`flex items-center space-x-3 ${order.order.orderStatus === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="h-5 w-5" />
                      <span>Delivered</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTracking;
