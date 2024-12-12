const API_BASE_URL = 'https://api.minify.com/v1';

export const api = {
  auth: {
    sendOtp: async (phone: string) => {
      // Simulated API call
      return { success: true };
    },
    verifyOtp: async (phone: string, otp: string) => {
      // Simulated API call
      return { token: 'dummy-token' };
    },
  },
  products: {
    list: async () => {
      // Simulated API call
      return {
        fruits: [
          {
            id: '1',
            name: 'Apple',
            nameHindi: 'सेब',
            price: 180,
            originalPrice: 200,
            unit: 'kg',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
            category: 'fruits',
            discount: 10,
          },
          // Add more dummy products
        ],
        vegetables: [
          {
            id: '2',
            name: 'Potato',
            nameHindi: 'आलू',
            price: 28,
            unit: 'kg',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
            category: 'vegetables',
          },
          // Add more dummy products
        ],
      };
    },
  },
  orders: {
    create: async (order: Partial<Order>) => {
      // Simulated API call
      return { orderId: 'dummy-order-id' };
    },
    list: async () => {
      // Simulated API call
      return [];
    },
    get: async (id: string) => {
      // Simulated API call
      return null;
    },
  },
};