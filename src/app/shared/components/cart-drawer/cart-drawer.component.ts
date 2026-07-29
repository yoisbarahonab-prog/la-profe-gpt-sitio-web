import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ClpCurrencyPipe } from '../../pipes/clp-currency.pipe';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, ClpCurrencyPipe],
  template: `
    <!-- Overlay de Fondo -->
    <div 
      *ngIf="cartService.isDrawerOpen()" 
      (click)="cartService.closeDrawer()" 
      class="fixed inset-0 bg-profe-text/60 backdrop-blur-sm z-50 transition-opacity duration-300">
    </div>

    <!-- Panel Deslizable Lateral -->
    <aside 
      [class.translate-x-full]="!cartService.isDrawerOpen()"
      [class.translate-x-0]="cartService.isDrawerOpen()"
      class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
      
      <!-- Header del Carrito -->
      <div class="bg-profe-purple text-white p-5 flex items-center justify-between shadow-md">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🛒</span>
          <div>
            <h2 class="text-lg font-black tracking-tight">Tu Carrito de Compras</h2>
            <p class="text-xs text-profe-purple-light font-medium">
              {{ cartService.itemCount() }} {{ cartService.itemCount() === 1 ? 'producto seleccionado' : 'productos seleccionados' }}
            </p>
          </div>
        </div>
        <button 
          (click)="cartService.closeDrawer()"
          class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
          ✕
        </button>
      </div>

      <!-- Lista de Productos -->
      <div class="flex-1 overflow-y-auto p-5 space-y-4">
        @if (cartService.items().length === 0) {
          <div class="text-center py-16 px-4">
            <div class="w-20 h-20 bg-profe-purple-light text-profe-purple text-3xl rounded-full flex items-center justify-center mx-auto mb-4">
              🛍️
            </div>
            <h3 class="text-lg font-bold text-profe-text mb-1">Tu carrito está vacío</h3>
            <p class="text-sm text-profe-muted mb-6">Explora nuestros Asistentes 2026 y Dossiers para agregarlos a tu compra.</p>
            <button 
              (click)="cartService.closeDrawer()"
              class="bg-profe-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-profe-purple-dark transition-colors shadow-md">
              Ver Productos
            </button>
          </div>
        } @else {
          @for (item of cartService.items(); track item.product.id) {
            <div class="bg-profe-cream/60 border-2 border-profe-purple-light/70 rounded-2xl p-4 flex gap-3 relative hover:border-profe-purple/40 transition-colors">
              <span class="text-3xl flex-shrink-0">{{ item.product.emoji }}</span>
              
              <div class="flex-1 min-w-0">
                <h4 class="font-black text-sm text-profe-purple-dark leading-snug line-clamp-2">
                  {{ item.product.name }}
                </h4>
                <p class="text-xs text-profe-muted font-bold mt-1">
                  {{ item.product.priceCLP | clpCurrency }}
                </p>

                <!-- Controles de Cantidad -->
                <div class="flex items-center gap-2 mt-3">
                  <button 
                    (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                    class="w-7 h-7 rounded-lg bg-white border border-profe-purple/20 font-bold text-profe-purple hover:bg-profe-purple-light transition-colors flex items-center justify-center">
                    -
                  </button>
                  <span class="text-xs font-black text-profe-text w-6 text-center">
                    {{ item.quantity }}
                  </span>
                  <button 
                    (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                    class="w-7 h-7 rounded-lg bg-white border border-profe-purple/20 font-bold text-profe-purple hover:bg-profe-purple-light transition-colors flex items-center justify-center">
                    +
                  </button>
                </div>
              </div>

              <!-- Eliminar -->
              <button 
                (click)="cartService.removeFromCart(item.product.id)"
                class="text-profe-muted hover:text-profe-pink transition-colors text-sm p-1">
                🗑️
              </button>
            </div>
          }
        }
      </div>

      <!-- Footer y Total del Carrito -->
      @if (cartService.items().length > 0) {
        <div class="border-t border-gray-100 p-5 bg-gradient-to-b from-white to-profe-pink-light/30 shadow-inner">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-bold text-profe-muted">Total a Pagar:</span>
            <span class="text-2xl font-black text-profe-purple-dark">
              {{ cartService.totalCLP() | clpCurrency }}
            </span>
          </div>

          <p class="text-xs text-profe-muted mb-4 font-medium flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-profe-purple-light">
            <span>✉️</span> Envío digital automático e instantáneo a tu correo.
          </p>

          <button 
            (click)="proceedToCheckout()"
            class="w-full bg-gradient-to-r from-profe-pink to-profe-pink-dark text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-wide flex items-center justify-center gap-2">
            <span>Ir a Pagar con Flow</span>
            <span>🔒</span>
          </button>
        </div>
      }
    </aside>
  `
})
export class CartDrawerComponent {
  public cartService = inject(CartService);
  private router = inject(Router);

  proceedToCheckout() {
    this.cartService.closeDrawer();
    this.router.navigate(['/checkout']);
  }
}
