import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { ClpCurrencyPipe } from '../../shared/pipes/clp-currency.pipe';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ClpCurrencyPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-10">
      
      <!-- Botón Volver -->
      <button 
        (click)="goBack()"
        class="inline-flex items-center gap-2 text-xs font-black text-profe-purple hover:underline mb-6 bg-white px-4 py-2 rounded-full border border-profe-purple-light shadow-sm">
        <span>←</span> Volver al Catálogo
      </button>

      <!-- Indicador de Pasos / Wizard Bar -->
      <div class="grid grid-cols-3 gap-2 mb-8 text-center max-w-xl mx-auto">
        <div class="bg-profe-purple text-white p-2.5 rounded-2xl text-xs font-black shadow">
          1. Carrito ✓
        </div>
        <div class="bg-profe-pink text-white p-2.5 rounded-2xl text-xs font-black shadow animate-pulse">
          2. Datos Envío
        </div>
        <div class="bg-profe-purple-light text-profe-purple-dark p-2.5 rounded-2xl text-xs font-black">
          3. Pago Flow
        </div>
      </div>

      <div class="bg-white rounded-3xl border-2 border-profe-purple-light shadow-2xl overflow-hidden">
        
        <!-- Header del Checkout -->
        <div class="bg-gradient-to-r from-profe-purple to-profe-purple-dark text-white p-6 sm:p-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-3xl">🔒</span>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight">Checkout Seguro Flow.cl</h1>
          </div>
          <p class="text-xs sm:text-sm text-profe-purple-light font-medium">
            Ingresa tu correo para recibir automáticamente tus accesos y archivos digitales.
          </p>
        </div>

        <div class="p-6 sm:p-8 space-y-8">
          
          <!-- Resumen del Pedido -->
          <div>
            <h3 class="text-xs font-black text-profe-purple-dark uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Detalle de tu Compra</span>
              <span class="text-xs font-bold text-profe-muted">({{ cartService.itemCount() }} ítems)</span>
            </h3>

            <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
              @for (item of cartService.items(); track item.product.id) {
                <div class="flex items-center justify-between bg-profe-cream/70 p-4 rounded-2xl border border-profe-purple-light/60">
                  <div class="flex items-center gap-3">
                    <span class="text-3xl">{{ item.product.emoji }}</span>
                    <div>
                      <h4 class="font-black text-xs sm:text-sm text-profe-purple-dark leading-snug">
                        {{ item.product.name }}
                      </h4>
                      <span class="text-xs text-profe-muted font-bold">
                        Cantidad: {{ item.quantity }} × {{ item.product.priceCLP | clpCurrency }}
                      </span>
                    </div>
                  </div>
                  <span class="font-black text-sm text-profe-purple">
                    {{ (item.product.priceCLP * item.quantity) | clpCurrency }}
                  </span>
                </div>
              }
            </div>

            <!-- Total General -->
            <div class="mt-5 pt-4 border-t-2 border-dashed border-profe-purple-light flex justify-between items-center">
              <div>
                <span class="font-bold text-sm text-profe-muted block">Total a Pagar en Flow:</span>
                <span class="text-[11px] text-green-600 font-extrabold">✓ Envío Digital $0 (100% Automático)</span>
              </div>
              <span class="text-2xl sm:text-3xl font-black text-profe-purple-dark">
                {{ cartService.totalCLP() | clpCurrency }}
              </span>
            </div>
          </div>

          <!-- Formulario de Datos -->
          <form (ngSubmit)="processPayment()" class="space-y-5 pt-4 border-t border-gray-100">
            <div>
              <label class="block text-xs font-black text-profe-purple-dark mb-1.5 uppercase tracking-wider">
                Tu Correo Electrónico <span class="text-profe-pink">*</span>
              </label>
              <div class="relative">
                <input 
                  type="email" 
                  [(ngModel)]="email" 
                  name="email"
                  required
                  placeholder="ejemplo@docente.cl"
                  class="w-full bg-profe-cream border-2 border-profe-purple-light focus:border-profe-purple rounded-2xl px-4 py-3.5 text-sm font-bold text-profe-text focus:outline-none transition-colors pl-11 shadow-inner">
                <span class="absolute left-4 top-3.5 text-profe-muted text-base">✉️</span>
              </div>
              <p class="text-[11px] text-profe-muted mt-1.5 font-medium leading-relaxed">
                ⚠️ Revisa bien tu correo. A esta dirección llegarán tus accesos e hipervínculos inmediatamente tras el pago.
              </p>
            </div>

            <div>
              <label class="block text-xs font-black text-profe-purple-dark mb-1.5 uppercase tracking-wider">
                Nombre Completo (Opcional)
              </label>
              <div class="relative">
                <input 
                  type="text" 
                  [(ngModel)]="name" 
                  name="name"
                  placeholder="Profe María González"
                  class="w-full bg-profe-cream border-2 border-profe-purple-light focus:border-profe-purple rounded-2xl px-4 py-3.5 text-sm font-bold text-profe-text focus:outline-none transition-colors pl-11 shadow-inner">
                <span class="absolute left-4 top-3.5 text-profe-muted text-base">👤</span>
              </div>
            </div>

            <!-- Error Banner -->
            @if (errorMessage()) {
              <div class="bg-red-50 text-red-600 border border-red-200 text-xs font-bold p-4 rounded-2xl animate-shake">
                ⚠️ {{ errorMessage() }}
              </div>
            }

            <!-- Botón de Pago Pagar con Flow -->
            <button 
              type="submit"
              [disabled]="isLoading() || !email"
              class="btn-shine w-full bg-gradient-to-r from-profe-pink via-profe-pink-dark to-profe-pink text-white font-black text-lg sm:text-xl py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-wide flex items-center justify-center gap-3 disabled:opacity-50">
              @if (isLoading()) {
                <span class="inline-block animate-spin">🌀</span>
                <span>Conectando con Flow.cl...</span>
              } @else {
                <span>Pagar {{ cartService.totalCLP() | clpCurrency }} en Flow</span>
                <span>💳</span>
              }
            </button>
          </form>

        </div>

      </div>
    </div>
  `
})
export class CheckoutPageComponent {
  public cartService = inject(CartService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private seoService = inject(SeoService);

  email = '';
  name = '';
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor() {
    this.seoService.updateSeo({
      title: 'Checkout Seguro | La Profe GPT',
      description: 'Completa tus datos para procesar la compra e iniciar el envío automático de tus Asistentes y Dossiers 2026.'
    });
  }

  goBack() {
    this.router.navigate(['/catalogo']);
  }

  processPayment() {
    if (!this.email || !this.email.includes('@')) {
      this.errorMessage.set('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (this.cartService.items().length === 0) {
      this.errorMessage.set('Tu carrito está vacío.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const payload = {
      customerEmail: this.email,
      customerName: this.name,
      items: this.cartService.items().map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    this.http.post<{ redirectUrl: string; flowRedirectToken?: string }>('/api/create-payment', payload)
      .subscribe({
        next: (res) => {
          if (res.redirectUrl) {
            window.location.href = res.redirectUrl;
          } else {
            this.isLoading.set(false);
            this.errorMessage.set('No se pudo generar la redirección a Flow. Intenta nuevamente.');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error al iniciar pago:', err);
          this.errorMessage.set('Ocurrió un problema de conexión al conectar con Flow. Asegúrate de configurar las llaves en .env.');
        }
      });
  }
}
