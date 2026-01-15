export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'restaurant';
  phone?: string;
  address?: Address;
  avatar?: string;
  isVerified: boolean;
  favoriteItems: string[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  isActive: boolean;
}

export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category | string;
  restaurant: Restaurant | string;
  image: string;
  images?: string[];
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  preparationTime: number;
  rating: number;
  reviewCount: number;
  discount?: number;
  tags: string[];
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: Address;
  phone: string;
  email: string;
  image: string;
  coverImage?: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  isActive: boolean;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  restaurant?: Restaurant;
}

export interface OrderItem {
  foodItem: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: User | string;
  restaurant: Restaurant | string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  couponCode?: string;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: User | string;
  foodItem?: string;
  restaurant?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CartState {
  items: CartItem[];
  restaurant: Restaurant | null;
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
}
