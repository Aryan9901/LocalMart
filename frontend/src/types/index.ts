export interface Product {
  id: string;
  name: string;
  nameHindi?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  quantity: number;
  image: string;
  category: 'fruits' | 'vegetables';
  discount?: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  discount: number;
  platformFees: number;
  deliveryCharges: number;
  status: 'pending' | 'completed' | 'cancelled';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderDate: string;
  deliverySlot?: {
    date: string;
    time: string;
  };
}

export interface OrderItem {
  product: Product;
  quantity: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  street: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}