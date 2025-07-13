// Order Management Utilities
import supabase from '../supabase';

export interface OrderItem {
  productId: number;
  size: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

export interface OrderData {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: OrderItem[];
  totalItems: number;
  totalAmount: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
}

// Generate order ID
export const generateOrderId = (): string => {
  return `KB-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Calculate order totals
export const calculateOrderTotals = (items: OrderItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return { totalItems, totalAmount };
};

// Validate customer details
export const validateCustomerDetails = (details: CustomerDetails): string | null => {
  if (!details.firstName.trim()) return 'First name is required';
  if (!details.lastName.trim()) return 'Last name is required';
  if (!details.phone.trim()) return 'Phone number is required';
  if (!details.email.trim()) return 'Email is required';
  if (!details.address.trim()) return 'Address is required';
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(details.email)) return 'Please enter a valid email';
  
  // Basic phone validation (Indian format)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(details.phone.replace(/\D/g, ''))) {
    return 'Please enter a valid 10-digit phone number';
  }
  
  return null;
};

// Send notification via ntfy.sh
export const sendOrderNotification = async (orderData: OrderData, orderId: string) => {
  try {
    const itemsList = orderData.items
      .map(item => `${item.quantity}x ${item.size} - ${formatCurrency(item.totalPrice)}`)
      .join('\n');
    
    const message = `🛒 New Order Received!
    
📋 Order ID: ${orderId}
👤 Customer: ${orderData.customerName}
📞 Phone: ${orderData.phone}
💰 Total: ${formatCurrency(orderData.totalAmount)}
📦 Items: ${orderData.totalItems}

Order Details:
${itemsList}

📍 Address: ${orderData.address}
📧 Email: ${orderData.email}`;
    
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
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

// Save order to Supabase
export const saveOrderToSupabase = async (orderData: OrderData, orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          id: orderId,
          customer_name: orderData.customerName,
          order: orderData,
          ordered_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Supabase insert error:', error);
    return { data: null, error };
  }
};

// Get order history (for future implementation)
export const getOrderHistory = async (customerEmail: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order->>email', customerEmail)
      .order('ordered_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching order history:', error);
    return { data: null, error };
  }
};

// Order status tracking
export const getOrderStatus = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching order status:', error);
    return { data: null, error };
  }
};

// Update order status (for admin use)
export const updateOrderStatus = async (orderId: string, status: OrderData['orderStatus']) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        order: { orderStatus: status },
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { data: null, error };
  }
};
