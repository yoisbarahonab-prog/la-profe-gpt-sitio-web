import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-[#4E359B] text-white pt-14 pb-8 border-t border-white/10 font-sans relative z-10">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
        
        <!-- Columna 1: Official Logo Marca y Eslogan -->
        <div class="lg:col-span-1 space-y-3">
          <div class="flex items-center gap-2">
            <img 
              src="/assets/images/LOGO.png" 
              alt="La Profe GPT Logo" 
              class="h-12 w-auto object-contain brightness-0 invert">
          </div>
          
          <div class="text-xs font-extrabold leading-tight">
            <span class="text-white/90 block">Ideas que inspiran,</span>
            <span class="text-profe-pink-light flex items-center gap-1">
              recursos que enseñan <span class="text-[10px] font-normal">♡</span>
            </span>
          </div>
        </div>

        <!-- Columna 2: Enlaces rápidos -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-wider text-profe-pink-light mb-3">
            Enlaces rápidos
          </h4>
          <ul class="space-y-2 text-xs font-semibold text-white/80">
            <li><a routerLink="/" class="hover:text-white transition-colors">Inicio</a></li>
            <li><a href="#programas" class="hover:text-white transition-colors">Programas</a></li>
            <li><a href="#como-funciona" class="hover:text-white transition-colors">¿Cómo funciona?</a></li>
            <li><a routerLink="/catalogo" class="hover:text-white transition-colors">Recursos gratuitos</a></li>
            <li><a href="#sobre-mi" class="hover:text-white transition-colors">Sobre mí</a></li>
          </ul>
        </div>

        <!-- Columna 3: Legal & Administración -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-wider text-profe-pink-light mb-3">
            Legal & Admin
          </h4>
          <ul class="space-y-2 text-xs font-semibold text-white/80">
            <li><a href="#" class="hover:text-white transition-colors">Términos y condiciones</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Política de privacidad</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Preguntas frecuentes</a></li>
            <li><a routerLink="/admin/login" class="text-profe-pink-light font-bold hover:text-white transition-colors flex items-center gap-1">🔐 Acceso Admin</a></li>
          </ul>
        </div>

        <!-- Columna 4: Síguenos en redes (4 Íconos PNG generados) -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-wider text-profe-pink-light mb-3">
            Síguenos en redes
          </h4>
          <div class="flex items-center gap-3">
            <a 
              href="https://tiktok.com/@la_profe_gpt" 
              target="_blank" 
              rel="noopener" 
              aria-label="TikTok"
              class="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/25 border border-white/15 flex items-center justify-center transition-all hover:scale-110 shadow-sm">
              <img src="/assets/icons/icon-tiktok.png" alt="TikTok" class="w-5 h-5 object-contain">
            </a>
            
            <a 
              href="https://instagram.com/la_profe_gpt" 
              target="_blank" 
              rel="noopener" 
              aria-label="Instagram"
              class="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/25 border border-white/15 flex items-center justify-center transition-all hover:scale-110 shadow-sm">
              <img src="/assets/icons/icon-instagram.png" alt="Instagram" class="w-5 h-5 object-contain">
            </a>

            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener" 
              aria-label="YouTube"
              class="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/25 border border-white/15 flex items-center justify-center transition-all hover:scale-110 shadow-sm">
              <img src="/assets/icons/icon-youtube.png" alt="YouTube" class="w-5 h-5 object-contain">
            </a>

            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener" 
              aria-label="Facebook"
              class="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/25 border border-white/15 flex items-center justify-center transition-all hover:scale-110 shadow-sm">
              <img src="/assets/icons/icon-facebook.png" alt="Facebook" class="w-5 h-5 object-contain">
            </a>
          </div>
        </div>

        <!-- Columna 5: ¿Dudas? -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-wider text-profe-pink-light mb-3">
            ¿Dudas?
          </h4>
          <div class="space-y-2 text-xs font-semibold text-white/90">
            <div class="flex items-center gap-2">
              <img src="/assets/icons/icon-phone.png" alt="Teléfono" class="w-4 h-4 object-contain">
              <span>+569 1234 5678</span>
            </div>
            <div class="flex items-center gap-2">
              <img src="/assets/icons/icon-mail.png" alt="Email" class="w-4 h-4 object-contain">
              <span>hola&#64;laprofegpt.cl</span>
            </div>
          </div>
        </div>

      </div>

      <div class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 border-t border-white/10 text-center text-xs text-white/60 font-medium">
        © 2026 La Profe GPT. Todos los derechos reservados. Plataforma especializada para docentes en Chile.
      </div>
    </footer>
  `
})
export class FooterComponent {}
