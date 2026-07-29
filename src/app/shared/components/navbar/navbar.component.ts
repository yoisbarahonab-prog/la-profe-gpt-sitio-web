import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 bg-[#FDF5FF]/95 backdrop-blur-md border-b border-profe-purple-light/40 shadow-xs transition-all">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-2.5 flex items-center justify-between gap-4">
        
        <!-- Brand / Official LOGO & 2-Line Tagline -->
        <div class="flex items-center gap-4">
          <a routerLink="/" class="flex items-center group">
            <img 
              src="/assets/images/LOGO.png" 
              alt="La Profe GPT Logo" 
              class="w-28 sm:w-34 lg:w-40 h-auto object-contain group-hover:scale-105 transition-transform drop-shadow-xs">
          </a>

          <!-- Tagline exact match to user reference screenshot -->
          <div class="border-l border-profe-purple/20 pl-4 hidden sm:flex flex-col justify-center leading-tight font-extrabold text-xs sm:text-sm">
            <span class="text-[#4E359B] tracking-tight">Ideas que inspiran,</span>
            <span class="text-[#E8607A] tracking-tight flex items-center gap-1">
              recursos que enseñan <span class="text-m font-normal">♡</span>
            </span>
          </div>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-7">
          <a 
            routerLink="/" 
            routerLinkActive="text-profe-pink border-b-2 border-profe-pink font-black"
            [routerLinkActiveOptions]="{exact: true}"
            class="text-profe-text text-sm font-bold hover:text-profe-pink transition-colors py-2 border-b-2 border-transparent">
            Inicio
          </a>

          <!-- Programas Dropdown -->
          <div class="relative group py-2">
            <a 
              routerLink="/catalogo"
              routerLinkActive="text-profe-pink border-b-2 border-profe-pink font-black"
              class="text-profe-text text-sm font-bold hover:text-profe-pink transition-colors flex items-center gap-1.5 py-2 border-b-2 border-transparent">
              <span>Programas</span>
              <svg class="w-4 h-4 text-profe-muted group-hover:text-profe-pink transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </a>

            <!-- Dropdown Menu Box -->
            <div class="absolute top-full left-1/2 -translate-x-1/2 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50 pointer-events-none group-hover:pointer-events-auto">
              <div class="bg-white/95 backdrop-blur-md border-2 border-profe-purple-light/70 rounded-3xl shadow-xl p-3 w-64 space-y-1">
                
                <a 
                  routerLink="/catalogo"
                  [queryParams]="{ categoria: 'portafolio' }"
                  class="flex items-center gap-3 p-2.5 rounded-2xl text-xs font-extrabold text-profe-purple-dark hover:bg-[#EDE9FF]/70 hover:text-profe-purple transition-all group/item">
                  <div class="w-8 h-8 rounded-xl bg-[#EDE9FF] flex items-center justify-center text-sm shadow-xs group-hover/item:scale-110 transition-transform">
                    📚
                  </div>
                  <div class="flex flex-col">
                    <span>Portafolio Docente 2026</span>
                    <span class="text-[10px] font-bold text-profe-muted">Orientación & Recursos</span>
                  </div>
                </a>

                <a 
                  routerLink="/catalogo"
                  [queryParams]="{ categoria: 'ecep' }"
                  class="flex items-center gap-3 p-2.5 rounded-2xl text-xs font-extrabold text-profe-purple-dark hover:bg-[#FFF0F3] hover:text-profe-pink-dark transition-all group/item">
                  <div class="w-8 h-8 rounded-xl bg-[#FFF0F3] flex items-center justify-center text-sm shadow-xs group-hover/item:scale-110 transition-transform">
                    🎓
                  </div>
                  <div class="flex flex-col">
                    <span>Programa ECEP</span>
                    <span class="text-[10px] font-bold text-profe-muted">Asistentes & Ensayos</span>
                  </div>
                </a>

                <a 
                  routerLink="/catalogo"
                  [queryParams]="{ categoria: 'dossier' }"
                  class="flex items-center gap-3 p-2.5 rounded-2xl text-xs font-extrabold text-profe-purple-dark hover:bg-[#F3E8FF] hover:text-[#6D28D9] transition-all group/item">
                  <div class="w-8 h-8 rounded-xl bg-[#F3E8FF] flex items-center justify-center text-sm shadow-xs group-hover/item:scale-110 transition-transform">
                    📂
                  </div>
                  <div class="flex flex-col">
                    <span>Dossier Pruebas</span>
                    <span class="text-[10px] font-bold text-profe-muted">Pruebas anteriores PDF</span>
                  </div>
                </a>

                <div class="border-t border-gray-100 pt-1 mt-1">
                  <a 
                    routerLink="/catalogo"
                    class="flex items-center justify-between p-2.5 rounded-2xl text-xs font-black text-profe-pink hover:bg-profe-pink-light/50 transition-all">
                    <span>Ver catálogo completo (39)</span>
                    <span>→</span>
                  </a>
                </div>

              </div>
            </div>
          </div>

          <a 
            href="#como-funciona" 
            class="text-profe-text text-sm font-bold hover:text-profe-pink transition-colors py-2 border-b-2 border-transparent hover:border-profe-pink">
            ¿Cómo funciona?
          </a>

          <a 
            routerLink="/catalogo" 
            routerLinkActive="text-profe-pink border-b-2 border-profe-pink font-black"
            class="text-profe-text text-sm font-bold hover:text-profe-pink transition-colors py-2 border-b-2 border-transparent hover:border-profe-pink">
            Recursos gratuitos
          </a>

          <a 
            href="#sobre-mi" 
            class="text-profe-text text-sm font-bold hover:text-profe-pink transition-colors py-2 border-b-2 border-transparent hover:border-profe-pink">
            Sobre mí
          </a>
        </nav>

        <!-- Right Side Actions: Cart Button -->
        <div class="flex items-center gap-3">
          
          <!-- Carrito Button con Badge -->
          <button 
            (click)="cartService.toggleDrawer()"
            aria-label="Ver Carrito de Compras"
            class="relative p-2 text-profe-purple hover:bg-profe-purple-light/50 rounded-full transition-colors">
            <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span 
              *ngIf="cartService.itemCount() > 0"
              class="absolute -top-1 -right-1 bg-profe-pink text-white w-5 h-5 rounded-full flex items-center justify-center font-black text-[11px] shadow-md border-2 border-white animate-pulse">
              {{ cartService.itemCount() }}
            </span>
          </button>

          <!-- Mobile Hamburger Menu Toggle -->
          <button 
            (click)="toggleMobileMenu()"
            aria-label="Abrir menú"
            class="lg:hidden text-profe-purple-dark p-2 rounded-xl border border-profe-purple-light hover:bg-profe-purple-light/40">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>

      </div>

      <!-- Mobile Dropdown Menu -->
      <div 
        *ngIf="isMobileMenuOpen()" 
        class="lg:hidden bg-white border-t border-profe-purple-light/50 px-4 py-4 space-y-2 animate-fade-in-up shadow-xl">
        <a 
          routerLink="/" 
          (click)="isMobileMenuOpen.set(false)"
          routerLinkActive="text-profe-pink font-black bg-[#FFF0F3]"
          [routerLinkActiveOptions]="{exact: true}"
          class="block text-profe-purple-dark text-sm font-bold py-2.5 px-3 rounded-xl hover:bg-profe-purple-light/50 transition-colors">
          Inicio
        </a>
        
        <div class="space-y-1 pl-2 border-l-2 border-profe-pink/50 my-1">
          <span class="block text-[10px] font-black uppercase tracking-wider text-profe-pink px-3 py-1">
            Programas de preparación
          </span>
          <a 
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'portafolio' }"
            (click)="isMobileMenuOpen.set(false)"
            class="flex items-center gap-2 text-profe-purple-dark text-xs font-bold py-2 px-3 rounded-xl hover:bg-profe-purple-light/50">
            <span>📚</span>
            <span>Portafolio Docente 2026</span>
          </a>
          <a 
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'ecep' }"
            (click)="isMobileMenuOpen.set(false)"
            class="flex items-center gap-2 text-profe-purple-dark text-xs font-bold py-2 px-3 rounded-xl hover:bg-profe-pink-light/50">
            <span>🎓</span>
            <span>Programa ECEP</span>
          </a>
          <a 
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'dossier' }"
            (click)="isMobileMenuOpen.set(false)"
            class="flex items-center gap-2 text-profe-purple-dark text-xs font-bold py-2 px-3 rounded-xl hover:bg-purple-50">
            <span>📂</span>
            <span>Dossier Pruebas</span>
          </a>
        </div>

        <a 
          href="#como-funciona" 
          (click)="isMobileMenuOpen.set(false)"
          class="block text-profe-purple-dark text-sm font-bold py-2.5 px-3 rounded-xl hover:bg-profe-purple-light/50">
          ¿Cómo funciona?
        </a>
        <a 
          routerLink="/catalogo" 
          (click)="isMobileMenuOpen.set(false)"
          routerLinkActive="text-profe-pink font-black bg-[#FFF0F3]"
          class="block text-profe-purple-dark text-sm font-bold py-2.5 px-3 rounded-xl hover:bg-profe-purple-light/50">
          Recursos gratuitos
        </a>
        <a 
          href="#sobre-mi" 
          (click)="isMobileMenuOpen.set(false)"
          class="block text-profe-purple-dark text-sm font-bold py-2.5 px-3 rounded-xl hover:bg-profe-purple-light/50">
          Sobre mí
        </a>
      </div>
    </header>
  `
})
export class NavbarComponent {
  public cartService = inject(CartService);
  isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }
}
