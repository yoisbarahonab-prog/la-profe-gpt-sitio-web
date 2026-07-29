import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-xl mx-auto px-4 py-16 text-center">
      <div class="bg-white rounded-3xl border-2 border-profe-purple-light p-8 shadow-xl">
        
        @if (status === 'success') {
          <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-2 border-green-300">
            ✓
          </div>
          <h1 class="text-2xl font-black text-profe-purple-dark mb-2">¡Pago Confirmado con Éxito!</h1>
          <p class="text-xs text-profe-muted font-bold leading-relaxed mb-6">
            Hemos verificado tu transacción en Flow.cl. Tus accesos e hipervínculos a tus Asistentes y Dossiers digitales están siendo despachados automáticamente a tu correo electrónico.
          </p>
          <div class="bg-profe-pink-light p-4 rounded-2xl border border-profe-pink/30 mb-6 text-left">
            <h4 class="text-xs font-black text-profe-pink-dark mb-1">✉️ Revisa tu bandeja de entrada:</h4>
            <p class="text-[11px] text-profe-muted font-semibold">
              Si no ves el mensaje en tu bandeja principal en 2 minutos, por favor revisa tu carpeta de Spam / Correo No Deseado.
            </p>
          </div>
        } @else {
          <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-2 border-red-300">
            ✕
          </div>
          <h1 class="text-2xl font-black text-profe-purple-dark mb-2">Pago Pendiente o Cancelado</h1>
          <p class="text-xs text-profe-muted font-bold leading-relaxed mb-6">
            La transacción no pudo ser verificada o fue cancelada desde la plataforma de Flow. Si tuviste algún problema con tu banco, puedes reintentar.
          </p>
        }

        <a 
          routerLink="/catalogo"
          class="inline-block bg-profe-purple hover:bg-profe-purple-dark text-white font-black text-sm px-6 py-3.5 rounded-xl shadow transition-all">
          Volver al Catálogo
        </a>

      </div>
    </div>
  `
})
export class PaymentStatusComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);

  status: 'success' | 'failure' = 'success';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const statusParam = params['status'];
      if (statusParam === 'failure' || statusParam === 'canceled') {
        this.status = 'failure';
      } else {
        this.status = 'success';
        // Limpiar el carrito tras compra exitosa
        this.cartService.clearCart();
      }
    });
  }
}
