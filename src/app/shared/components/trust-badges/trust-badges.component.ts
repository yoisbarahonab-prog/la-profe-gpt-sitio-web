import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trust-badges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-12 bg-gradient-to-b from-profe-cream via-profe-purple-light/30 to-profe-cream border-y border-profe-purple-light/60">
      <div class="max-w-6xl mx-auto px-4">
        
        <!-- Grid de Pilares de Confianza -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div class="glass-card rounded-2xl p-5 text-center transform hover:-translate-y-1 transition-all duration-300">
            <div class="w-12 h-12 bg-profe-purple-light text-profe-purple text-2xl rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              ⚡
            </div>
            <h3 class="font-black text-sm text-profe-purple-dark mb-1">Envío Automático 24/7</h3>
            <p class="text-xs text-profe-muted font-medium">Recibes tus accesos y archivos inmediatamente en tu correo tras confirmar el pago.</p>
          </div>

          <div class="glass-card rounded-2xl p-5 text-center transform hover:-translate-y-1 transition-all duration-300">
            <div class="w-12 h-12 bg-profe-pink-light text-profe-pink text-2xl rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              🎓
            </div>
            <h3 class="font-black text-sm text-profe-purple-dark mb-1">Alineado a CPEIP 2026</h3>
            <p class="text-xs text-profe-muted font-medium">Contenidos, rúbricas y manuales actualizados según los estándares del Ministerio.</p>
          </div>

          <div class="glass-card rounded-2xl p-5 text-center transform hover:-translate-y-1 transition-all duration-300">
            <div class="w-12 h-12 bg-profe-purple-light text-profe-purple text-2xl rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              🔒
            </div>
            <h3 class="font-black text-sm text-profe-purple-dark mb-1">Pago 100% Seguro</h3>
            <p class="text-xs text-profe-muted font-medium">Transacciones procesadas en la plataforma encriptada oficial de Flow.cl.</p>
          </div>

          <div class="glass-card rounded-2xl p-5 text-center transform hover:-translate-y-1 transition-all duration-300">
            <div class="w-12 h-12 bg-profe-pink-light text-profe-pink text-2xl rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              💬
            </div>
            <h3 class="font-black text-sm text-profe-purple-dark mb-1">Soporte a Docentes</h3>
            <p class="text-xs text-profe-muted font-medium">Asistencia directa por e-mail para responder cualquier duda sobre tus recursos.</p>
          </div>

        </div>

        <!-- Métodos de Pago Flow Badges -->
        <div class="bg-white/80 rounded-3xl p-6 border border-profe-purple-light text-center max-w-3xl mx-auto shadow-sm">
          <span class="text-xs font-black uppercase text-profe-purple tracking-wider block mb-3">
            Paga con tus medios preferidos en Chile a través de Flow.cl
          </span>

          <div class="flex flex-wrap justify-center items-center gap-3">
            <span class="bg-profe-purple-light/70 text-profe-purple-dark font-black text-xs px-3.5 py-2 rounded-xl border border-profe-purple/20 flex items-center gap-1.5 shadow-sm">
              💳 Webpay Plus (Débito/Crédito)
            </span>
            <span class="bg-profe-pink-light/70 text-profe-pink-dark font-black text-xs px-3.5 py-2 rounded-xl border border-profe-pink/20 flex items-center gap-1.5 shadow-sm">
              🏦 Servipag & BancoEstado
            </span>
            <span class="bg-profe-purple-light/70 text-profe-purple-dark font-black text-xs px-3.5 py-2 rounded-xl border border-profe-purple/20 flex items-center gap-1.5 shadow-sm">
              📱 Mach / Klap
            </span>
            <span class="bg-profe-pink-light/70 text-profe-pink-dark font-black text-xs px-3.5 py-2 rounded-xl border border-profe-pink/20 flex items-center gap-1.5 shadow-sm">
              💳 Tarjetas de Casas Comerciales
            </span>
          </div>
        </div>

      </div>
    </section>
  `
})
export class TrustBadgesComponent {}
