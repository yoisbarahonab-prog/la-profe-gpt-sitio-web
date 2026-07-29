import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutPayload {
  customerEmail: string;
  customerName?: string;
  items: { productId: string; quantity: number }[];
}
