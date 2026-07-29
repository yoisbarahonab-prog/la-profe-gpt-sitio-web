import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

const CART_STORAGE_KEY = 'profegpt_cart_v1';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signal de ítems en el carrito
  private itemsSignal = signal<CartItem[]>(this.loadCartFromStorage());

  // Signal para controlar visibilidad del Drawer del Carrito
  public isDrawerOpen = signal<boolean>(false);

  // Computados reactivos
  public items = computed(() => this.itemsSignal());
  public itemCount = computed(() => this.itemsSignal().reduce((acc, item) => acc + item.quantity, 0));
  public totalCLP = computed(() => this.itemsSignal().reduce((acc, item) => acc + (item.product.priceCLP * item.quantity), 0));

  constructor() {
    // Guardar automáticamente en localStorage ante cambios
    effect(() => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.itemsSignal()));
    });
  }

  addToCart(product: Product) {
    const current = this.itemsSignal();
    const existingIndex = current.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1
      };
      this.itemsSignal.set(updated);
    } else {
      this.itemsSignal.set([...current, { product, quantity: 1 }]);
    }

    // Abrir automáticamente el drawer al agregar
    this.openDrawer();
  }

  removeFromCart(productId: string) {
    this.itemsSignal.set(this.itemsSignal().filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const updated = this.itemsSignal().map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.itemsSignal.set(updated);
  }

  clearCart() {
    this.itemsSignal.set([]);
  }

  openDrawer() {
    this.isDrawerOpen.set(true);
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
  }

  toggleDrawer() {
    this.isDrawerOpen.set(!this.isDrawerOpen());
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
