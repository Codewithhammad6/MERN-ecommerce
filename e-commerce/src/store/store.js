import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Enhanced sample products for high-sales website
const sampleProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-canceling wireless headphones with 30-hour battery life and crystal clear sound quality.",
    price: 199.99,
    salePrice: 149.99,
    category: "Electronics",
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
    ],
    brand: "AudioTech",
    sku: "ATH-001",
    weight: 0.25,
    dimensions: "18x8x3",
    features: "Noise Cancellation, 30h Battery, Quick Charge, Touch Controls",
    tags: "wireless, bluetooth, headphones, audio",
    isFeatured: true,
    isOnSale: true,
    discountPercentage: 25,
    rating: 4.8,
    reviews: 156,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life.",
    price: 299.99,
    category: "Electronics",
    stock: 32,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
    ],
    brand: "FitTech",
    sku: "FTW-002",
    weight: 0.05,
    dimensions: "4x4x1",
    features: "Heart Rate Monitor, GPS, Water Resistant, Sleep Tracking",
    tags: "fitness, watch, smartwatch, health",
    isFeatured: true,
    isOnSale: false,
    rating: 4.6,
    reviews: 89,
    createdAt: "2024-01-20T14:15:00Z"
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    salePrice: 19.99,
    category: "Fashion & Apparel",
    stock: 120,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
    ],
    brand: "EcoWear",
    sku: "ECT-003",
    weight: 0.15,
    dimensions: "30x25x2",
    features: "100% Organic Cotton, Breathable, Sustainable, Multiple Colors",
    tags: "organic, cotton, t-shirt, sustainable",
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 33,
    rating: 4.4,
    reviews: 234,
    createdAt: "2024-02-01T09:45:00Z"
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 39.99,
    category: "Home & Garden",
    stock: 78,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400"
    ],
    brand: "HydroLife",
    sku: "HSB-004",
    weight: 0.4,
    dimensions: "8x3x3",
    features: "24h Cold, 12h Hot, BPA Free, Leak Proof",
    tags: "water bottle, insulated, stainless steel, eco-friendly",
    isFeatured: false,
    isOnSale: false,
    rating: 4.7,
    reviews: 189,
    createdAt: "2024-02-10T11:20:00Z"
  },
  {
    id: 5,
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat made from eco-friendly materials with alignment lines for perfect poses.",
    price: 79.99,
    salePrice: 59.99,
    category: "Sports & Outdoors",
    stock: 56,
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    ],
    brand: "ZenFlow",
    sku: "ZYM-005",
    weight: 1.2,
    dimensions: "183x61x0.6",
    features: "Non-slip Surface, Alignment Lines, Eco-friendly, 6mm Thick",
    tags: "yoga, mat, fitness, meditation",
    isFeatured: true,
    isOnSale: true,
    discountPercentage: 25,
    rating: 4.9,
    reviews: 312,
    createdAt: "2024-02-15T16:30:00Z"
  },
  {
    id: 6,
    name: "Natural Face Cream",
    description: "Hydrating face cream with natural ingredients for all skin types.",
    price: 24.99,
    category: "Beauty & Personal Care",
    stock: 95,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400"
    ],
    brand: "PureGlow",
    sku: "PFC-006",
    weight: 0.1,
    dimensions: "6x6x3",
    features: "Natural Ingredients, Hydrating, All Skin Types, Fragrance Free",
    tags: "face cream, natural, skincare, hydrating",
    isFeatured: false,
    isOnSale: false,
    rating: 4.5,
    reviews: 178,
    createdAt: "2024-02-20T13:10:00Z"
  },
  {
    id: 7,
    name: "Wireless Gaming Mouse",
    description: "High-performance wireless gaming mouse with RGB lighting and programmable buttons.",
    price: 89.99,
    salePrice: 69.99,
    category: "Electronics",
    stock: 28,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=400",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=400"
    ],
    brand: "GameTech",
    sku: "GTM-007",
    weight: 0.12,
    dimensions: "12x6x4",
    features: "RGB Lighting, Programmable Buttons, 25K DPI, Wireless",
    tags: "gaming, mouse, wireless, rgb",
    isFeatured: true,
    isOnSale: true,
    discountPercentage: 22,
    rating: 4.6,
    reviews: 145,
    createdAt: "2024-03-01T10:45:00Z"
  },
  {
    id: 8,
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 beautiful ceramic coffee mugs perfect for home or office use.",
    price: 34.99,
    category: "Home & Garden",
    stock: 67,
    images: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    ],
    brand: "HomeStyle",
    sku: "HCM-008",
    weight: 0.8,
    dimensions: "12x12x8",
    features: "Microwave Safe, Dishwasher Safe, Lead Free, Set of 4",
    tags: "coffee mug, ceramic, kitchen, home",
    isFeatured: false,
    isOnSale: false,
    rating: 4.3,
    reviews: 92,
    createdAt: "2024-03-05T15:20:00Z"
  }
];

export const useStore = create(
  persist(
    (set, get) => ({
      // Products
      products: sampleProducts,
      
      // Add new product
      addProduct: (product) => set((state) => ({
        products: [...state.products, product]
      })),
      
      // Update existing product
      updateProduct: (updatedProduct) => set((state) => ({
        products: state.products.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        )
      })),
      
      // Delete product
      deleteProduct: (productId) => set((state) => ({
        products: state.products.filter(product => product.id !== productId)
      })),

      // Cart
      cart: [],
      addToCart: (product, quantity = 1) => set((state) => {
        const existingItem = state.cart.find(item => item.id === product.id);
        if (existingItem) {
          return {
            cart: state.cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        return {
          cart: [...state.cart, { ...product, quantity }]
        };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== productId)
      })),
      updateCartQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const state = get();
        return state.cart.reduce((total, item) => {
          const price = item.salePrice || item.price;
          return total + (price * item.quantity);
        }, 0);
      },
      getCartCount: () => {
        const state = get();
        return state.cart.reduce((count, item) => count + item.quantity, 0);
      },

      // User
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, isAdmin: false }),

        // Orders
  orders: [
    {
      id: 1,
      customer: { 
        name: "John Doe", 
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001"
        }
      },
      date: "2024-01-15T10:30:00Z",
      status: "Delivered",
      totals: { subtotal: 289.97, tax: 9.99, total: 299.98 },
      payment: { method: "Credit Card", last4: "1234" },
      items: [
        { id: 1, quantity: 1, price: 149.99, name: "Wireless Bluetooth Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
        { id: 3, quantity: 2, price: 19.99, name: "Organic Cotton T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" }
      ]
    },
    {
      id: 2,
      customer: { 
        name: "Jane Smith", 
        email: "jane@example.com",
        phone: "+1 (555) 234-5678",
        address: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210"
        }
      },
      date: "2024-01-20T14:15:00Z",
      status: "Shipped",
      totals: { subtotal: 389.98, tax: 10.00, total: 399.98 },
      payment: { method: "PayPal", last4: "5678" },
      items: [
        { id: 2, quantity: 1, price: 299.99, name: "Smart Fitness Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
        { id: 5, quantity: 1, price: 59.99, name: "Yoga Mat Premium", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400" }
      ]
    },
    {
      id: 3,
      customer: { 
        name: "Mike Johnson", 
        email: "mike@example.com",
        phone: "+1 (555) 345-6789",
        address: {
          street: "789 Pine St",
          city: "Chicago",
          state: "IL",
          zipCode: "60601"
        }
      },
      date: "2024-02-01T09:45:00Z",
      status: "Processing",
      totals: { subtotal: 149.98, tax: 9.99, total: 159.97 },
      payment: { method: "Credit Card", last4: "9012" },
      items: [
        { id: 1, quantity: 1, price: 149.99, name: "Wireless Bluetooth Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
        { id: 6, quantity: 1, price: 24.99, name: "Natural Face Cream", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400" }
      ]
    },
    {
      id: 4,
      customer: { 
        name: "Sarah Wilson", 
        email: "sarah@example.com",
        phone: "+1 (555) 456-7890",
        address: {
          street: "321 Elm St",
          city: "Houston",
          state: "TX",
          zipCode: "77001"
        }
      },
      date: "2024-02-10T11:20:00Z",
      status: "Delivered",
      totals: { subtotal: 79.98, tax: 10.00, total: 89.98 },
      payment: { method: "Credit Card", last4: "3456" },
      items: [
        { id: 7, quantity: 1, price: 69.99, name: "Wireless Gaming Mouse", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400" },
        { id: 8, quantity: 1, price: 34.99, name: "Ceramic Coffee Mug Set", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400" }
      ]
    },
    {
      id: 5,
      customer: { 
        name: "David Brown", 
        email: "david@example.com",
        phone: "+1 (555) 567-8901",
        address: {
          street: "654 Maple Dr",
          city: "Phoenix",
          state: "AZ",
          zipCode: "85001"
        }
      },
      date: "2024-02-15T16:30:00Z",
      status: "Shipped",
      totals: { subtotal: 189.98, tax: 10.00, total: 199.98 },
      payment: { method: "PayPal", last4: "7890" },
      items: [
        { id: 1, quantity: 1, price: 149.99, name: "Wireless Bluetooth Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
        { id: 4, quantity: 1, price: 39.99, name: "Stainless Steel Water Bottle", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400" }
      ]
    }
  ],
  addOrder: (order) => set((state) => ({
    orders: [...state.orders, { ...order, id: Date.now() }]
  })),

      // Admin
      isAdmin: false,
      setAdminStatus: (status) => set({ isAdmin: status }),

      // Categories
      categories: [
        'Electronics',
        'Fashion & Apparel',
        'Home & Garden',
        'Sports & Outdoors',
        'Beauty & Personal Care',
        'Books & Media',
        'Toys & Games',
        'Automotive',
        'Health & Wellness',
        'Food & Beverages',
        'Jewelry & Accessories',
        'Pet Supplies',
        'Office & Business',
        'Baby & Kids',
        'Art & Crafts',
        'Music & Instruments',
        'Tools & Hardware',
        'Travel & Luggage',
        'Phones & Accessories',
        'Computers & Laptops'
      ],

      // Filters
      filters: {
        category: 'all',
        priceRange: [0, 1000],
        rating: 0,
        sortBy: 'name'
      },
      setFilters: (filters) => set({ filters }),
      getFilteredProducts: () => {
        const state = get();
        let filtered = [...state.products];

        // Category filter
        if (state.filters.category !== 'all') {
          filtered = filtered.filter(product => product.category === state.filters.category);
        }

        // Price range filter
        filtered = filtered.filter(product => {
          const price = product.salePrice || product.price;
          return price >= state.filters.priceRange[0] && price <= state.filters.priceRange[1];
        });

        // Rating filter
        if (state.filters.rating > 0) {
          filtered = filtered.filter(product => product.rating >= state.filters.rating);
        }

        // Sort
        switch (state.filters.sortBy) {
          case 'price-low':
            filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
            break;
          case 'price-high':
            filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          default:
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        return filtered;
      }
    }),
    {
      name: 'ecommerce-store',
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
        orders: state.orders,
        isAdmin: state.isAdmin
      })
    }
  )
); 