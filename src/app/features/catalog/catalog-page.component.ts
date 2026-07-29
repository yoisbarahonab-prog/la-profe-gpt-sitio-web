import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { Product, CategoryFilter } from '../../core/models/product.model';
import { ClpCurrencyPipe } from '../../shared/pipes/clp-currency.pipe';
import { ActivatedRoute, Router } from '@angular/router';

export interface BgShape {
  symbol: string;
  top: string;
  left?: string;
  right?: string;
  size: string;
  color: string;
  animation: string;
}

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ClpCurrencyPipe],
  template: `
    <div class="w-full min-h-screen bg-[#FDF5FF] text-profe-text overflow-hidden font-sans relative">
      
      <!-- ========================================================= -->
      <!-- CAPA DE FIGURAS FLOTANTES DISTRIBUIDAS EN TODO EL FONDO   -->
      <!-- DE LA PANTALLA (CENTRO, BORDES Y SECCIONES)               -->
      <!-- ========================================================= -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
        @for (shape of bgShapes; track $index) {
          <div 
            class="absolute select-none pointer-events-none transition-all duration-300 {{ shape.size }} {{ shape.color }} {{ shape.animation }}"
            [style.top]="shape.top"
            [style.left]="shape.left || 'auto'"
            [style.right]="shape.right || 'auto'">
            {{ shape.symbol }}
          </div>
        }
      </div>

      <div class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 relative z-10">

        <!-- ========================================================= -->
        <!-- HEADER DE CATÁLOGO CON CÁPSULA Y HALO DE GRADIENTE 3 COLORES -->
        <!-- ========================================================= -->
        <div class="relative bg-gradient-to-r from-[#FFF0F3]/70 via-[#F8F5FF] to-[#FFF0F3]/70 rounded-3xl p-6 sm:p-10 border-2 border-profe-purple-light/50 shadow-sm mb-8 overflow-hidden z-10">
          
          <div class="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
            
            <!-- Ilustración Izquierda: La Profe GPT -->
            <div class="hidden md:flex md:col-span-3 justify-center items-center">
              <div class="relative group flex justify-center items-center">
                <div class="absolute -inset-3 bg-gradient-to-tr from-[#6B4FBB] via-[#E8607A] to-[#8B5CF6] rounded-full blur-2xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 -z-10"></div>
                
                <img 
                  src="/assets/images/profe-hero.png" 
                  alt="La Profe GPT" 
                  class="w-48 lg:w-60 h-auto object-contain animate-float-slow relative z-10 filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500">
              </div>
            </div>

            <!-- Texto Centro -->
            <div class="md:col-span-6 text-center space-y-3 z-10">
              <span class="inline-block bg-white border border-profe-purple-light text-profe-purple font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                Catálogo Completo CPEIP 2026
              </span>
              
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-profe-purple-dark tracking-tight leading-tight">
                Asistentes Virtuales & Dossiers
              </h1>
              
              <p class="text-xs sm:text-base text-profe-muted font-bold max-w-xl mx-auto leading-relaxed">
                Explora los 39 recursos diseñados para ayudarte en tu Portafolio y ECEP. Selecciona tus ítems y paga todo junto en un solo clic.
              </p>
            </div>

            <!-- Ilustración Derecha: Robot GPT -->
            <div class="hidden md:flex md:col-span-3 justify-center items-center">
              <div class="relative group flex justify-center items-center">
                <div class="absolute -inset-3 bg-gradient-to-br from-[#6B4FBB] via-[#E8607A] to-[#8B5CF6] rounded-full blur-2xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 -z-10"></div>

                <img 
                  src="/assets/images/robot-hero.png" 
                  alt="Robot GPT" 
                  class="w-44 lg:w-56 h-auto object-contain animate-float-reverse relative z-10 filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500">
              </div>
            </div>

          </div>

        </div>

        <!-- ========================================================= -->
        <!-- BARRA DE FILTROS Y BUSCADOR (OPTIMIZADA PARA MÓVIL)       -->
        <!-- ========================================================= -->
        <div class="glass-card p-3.5 sm:p-5 rounded-3xl shadow-sm mb-6 border-2 border-profe-purple-light/80 sticky top-16 md:top-20 z-20 bg-white/95 backdrop-blur-md">
          <div class="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between">
            
            <!-- Category Tabs (Desplazable horizontalmente en móvil para evitar sobreposición) -->
            <div class="flex flex-nowrap overflow-x-auto pb-1 md:pb-0 scrollbar-none md:flex-wrap gap-2 w-full md:w-auto">
              <button 
                (click)="setCategory('all')"
                [class.bg-profe-purple]="activeCategory() === 'all'"
                [class.text-white]="activeCategory() === 'all'"
                [class.bg-profe-purple-light]="activeCategory() !== 'all'"
                [class.text-profe-purple-dark]="activeCategory() !== 'all'"
                class="flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-sm">
                Todos (39)
              </button>

              <button 
                (click)="setCategory('portafolio')"
                [class.bg-profe-purple]="activeCategory() === 'portafolio'"
                [class.text-white]="activeCategory() === 'portafolio'"
                [class.bg-profe-purple-light]="activeCategory() !== 'portafolio'"
                [class.text-profe-purple-dark]="activeCategory() !== 'portafolio'"
                class="flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-sm">
                📚 Portafolio (6)
              </button>

              <button 
                (click)="setCategory('ecep')"
                [class.bg-profe-purple]="activeCategory() === 'ecep'"
                [class.text-white]="activeCategory() === 'ecep'"
                [class.bg-profe-purple-light]="activeCategory() !== 'ecep'"
                [class.text-profe-purple-dark]="activeCategory() !== 'ecep'"
                class="flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-sm">
                ✏️ Asistentes ECEP (15)
              </button>

              <button 
                (click)="setCategory('dossier')"
                [class.bg-profe-purple]="activeCategory() === 'dossier'"
                [class.text-white]="activeCategory() === 'dossier'"
                [class.bg-profe-purple-light]="activeCategory() !== 'dossier'"
                [class.text-profe-purple-dark]="activeCategory() !== 'dossier'"
                class="flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-sm">
                📄 Dossiers (16)
              </button>

              <button 
                (click)="setCategory('biblioteca')"
                [class.bg-profe-purple]="activeCategory() === 'biblioteca'"
                [class.text-white]="activeCategory() === 'biblioteca'"
                [class.bg-profe-purple-light]="activeCategory() !== 'biblioteca'"
                [class.text-profe-purple-dark]="activeCategory() !== 'biblioteca'"
                class="flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-sm">
                📖 Biblioteca (2)
              </button>
            </div>

            <!-- Buscador Input -->
            <div class="relative w-full md:w-80">
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Buscar especialidad (ej: Básica, Inglés)..."
                class="w-full bg-white border-2 border-profe-purple-light focus:border-profe-purple rounded-2xl px-4 py-2 text-xs font-bold text-profe-text focus:outline-none transition-colors pl-9 pr-8 shadow-inner">
              <span class="absolute left-3 top-2 text-profe-muted text-sm">🔍</span>
              
              <button 
                *ngIf="searchQuery" 
                (click)="searchQuery = ''"
                class="absolute right-3 top-2 text-profe-muted hover:text-profe-purple font-bold text-xs">
                ✕
              </button>
            </div>

          </div>
        </div>

        <!-- Contador de Resultados -->
        <div class="flex justify-between items-center mb-6 px-1 z-10 relative">
          <span class="text-xs font-bold text-profe-muted">
            Mostrando {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'resultado' : 'resultados' }}
          </span>

          <span *ngIf="searchQuery" class="text-xs font-bold text-profe-purple">
            Filtro: "{{ searchQuery }}"
          </span>
        </div>

        <!-- Grid de Productos -->
        @if (filteredProducts.length === 0) {
          <div class="text-center py-16 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-profe-purple-light shadow-sm z-10 relative">
            <span class="text-5xl mb-3 block animate-bounce">🔎</span>
            <h3 class="text-lg font-black text-profe-purple-dark mb-1">No se encontraron resultados</h3>
            <p class="text-xs text-profe-muted font-semibold mb-4">Intenta buscando otro término o limpia los filtros.</p>
            <button 
              (click)="searchQuery = ''; setCategory('all')"
              class="bg-profe-purple text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-profe-purple-dark transition-colors">
              Restablecer Filtros
            </button>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
            @for (product of filteredProducts; track product.id) {
              <div class="bg-white/95 backdrop-blur-sm border-2 border-profe-purple-light hover:border-profe-purple rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                
                <div>
                  <!-- Emoji + Category Badge -->
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-4xl group-hover:scale-110 transition-transform duration-300">{{ product.emoji }}</span>
                    <span class="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-profe-purple-light text-profe-purple-dark shadow-inner">
                      {{ product.categoryLabel }}
                    </span>
                  </div>

                  <h3 class="font-black text-base text-profe-purple-dark leading-snug mb-2 group-hover:text-profe-purple transition-colors">
                    {{ product.name }}
                  </h3>

                  <p class="text-xs font-semibold text-profe-muted leading-relaxed mb-6">
                    {{ product.description }}
                  </p>
                </div>

                <div class="pt-4 border-t border-gray-100">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-bold text-profe-muted">Precio:</span>
                    <span class="text-xl font-black text-profe-purple">
                      {{ product.priceCLP | clpCurrency }}
                    </span>
                  </div>

                  <button 
                    (click)="cartService.addToCart(product)"
                    class="w-full bg-profe-purple hover:bg-profe-purple-dark active:scale-95 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    <span>🛒</span>
                    <span>Agregar al Carrito</span>
                  </button>
                </div>

              </div>
            }
          </div>
        }

      </div>

    </div>
  `
})
export class CatalogPageComponent {
  private productService = inject(ProductService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public cartService = inject(CartService);

  allProducts: Product[] = [];
  activeCategory = signal<CategoryFilter>('all');
  searchQuery = '';

  // Arreglo de figuras flotantes distribuidas en todo el lienzo del Catálogo (Centro, Zonas Intermedias y Márgenes)
  bgShapes: BgShape[] = [
    { symbol: '✦', top: '3%', left: '3%', size: 'text-4xl', color: 'text-profe-pink/50', animation: 'animate-sparkle' },
    { symbol: '♡', top: '6%', left: '25%', size: 'text-2xl', color: 'text-profe-purple/40', animation: 'animate-pulse-heart' },
    { symbol: '✨', top: '4%', left: '50%', size: 'text-3xl', color: 'text-profe-pink/60', animation: 'animate-sparkle' },
    { symbol: '♥', top: '8%', left: '76%', size: 'text-5xl', color: 'text-profe-pink/35', animation: 'animate-pulse-heart' },
    { symbol: '✦', top: '5%', left: '95%', size: 'text-4xl', color: 'text-profe-purple/45', animation: 'animate-sparkle' },

    { symbol: '✨', top: '15%', left: '12%', size: 'text-2xl', color: 'text-profe-pink/60', animation: 'animate-sparkle' },
    { symbol: '✦', top: '18%', left: '38%', size: 'text-xl', color: 'text-purple-400/40', animation: 'animate-sparkle' },
    { symbol: '♡', top: '16%', left: '64%', size: 'text-3xl', color: 'text-profe-pink/45', animation: 'animate-pulse-heart' },
    { symbol: '♥', top: '20%', left: '88%', size: 'text-2xl', color: 'text-profe-pink-dark/35', animation: 'animate-pulse-heart' },

    { symbol: '✦', top: '30%', left: '5%', size: 'text-4xl', color: 'text-profe-purple/40', animation: 'animate-sparkle' },
    { symbol: '♡', top: '34%', left: '30%', size: 'text-3xl', color: 'text-profe-pink/35', animation: 'animate-pulse-heart' },
    { symbol: '✨', top: '32%', left: '58%', size: 'text-2xl', color: 'text-purple-400/40', animation: 'animate-sparkle' },
    { symbol: '♥', top: '36%', left: '84%', size: 'text-4xl', color: 'text-profe-pink/45', animation: 'animate-pulse-heart' },

    { symbol: '✨', top: '48%', left: '15%', size: 'text-3xl', color: 'text-profe-pink/50', animation: 'animate-sparkle' },
    { symbol: '♥', top: '52%', left: '44%', size: 'text-2xl', color: 'text-profe-purple/30', animation: 'animate-pulse-heart' },
    { symbol: '✦', top: '50%', left: '72%', size: 'text-3xl', color: 'text-profe-pink/40', animation: 'animate-sparkle' },
    { symbol: '♡', top: '54%', left: '94%', size: 'text-4xl', color: 'text-profe-purple/40', animation: 'animate-pulse-heart' },

    { symbol: '✦', top: '65%', left: '4%', size: 'text-5xl', color: 'text-profe-pink/45', animation: 'animate-sparkle' },
    { symbol: '♡', top: '68%', left: '28%', size: 'text-2xl', color: 'text-purple-400/35', animation: 'animate-pulse-heart' },
    { symbol: '✨', top: '66%', left: '60%', size: 'text-4xl', color: 'text-profe-pink/40', animation: 'animate-sparkle' },
    { symbol: '♥', top: '70%', left: '86%', size: 'text-3xl', color: 'text-profe-pink/45', animation: 'animate-pulse-heart' },

    { symbol: '✨', top: '80%', left: '18%', size: 'text-2xl', color: 'text-profe-purple/40', animation: 'animate-sparkle' },
    { symbol: '✦', top: '84%', left: '48%', size: 'text-3xl', color: 'text-profe-pink/35', animation: 'animate-sparkle' },
    { symbol: '♡', top: '82%', left: '74%', size: 'text-4xl', color: 'text-purple-400/35', animation: 'animate-pulse-heart' },

    { symbol: '♥', top: '92%', left: '6%', size: 'text-4xl', color: 'text-profe-pink/40', animation: 'animate-pulse-heart' },
    { symbol: '✨', top: '95%', left: '34%', size: 'text-3xl', color: 'text-profe-pink/50', animation: 'animate-sparkle' },
    { symbol: '✦', top: '94%', left: '66%', size: 'text-4xl', color: 'text-profe-purple/45', animation: 'animate-sparkle' },
    { symbol: '♡', top: '97%', left: '92%', size: 'text-3xl', color: 'text-profe-pink/40', animation: 'animate-pulse-heart' }
  ];

  constructor() {
    this.seoService.updateSeo({
      title: 'Catálogo de Recursos 2026 | Asistentes ECEP & Portafolio - La Profe GPT',
      description: 'Catálogo completo con 39 recursos para docentes de Chile: Asistentes de Portafolio Docente, Asistentes ECEP 2026, Dossiers descargables y Biblioteca.',
      url: 'https://laprofegpt.cl/catalogo'
    });

    this.route.queryParams.subscribe(params => {
      const cat = params['categoria'] || params['category'];
      if (cat && ['portafolio', 'ecep', 'dossier', 'biblioteca'].includes(cat)) {
        this.activeCategory.set(cat as CategoryFilter);
      }
    });

    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
    });
  }

  setCategory(category: CategoryFilter) {
    this.activeCategory.set(category);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: category === 'all' ? { categoria: null } : { categoria: category },
      queryParamsHandling: 'merge'
    });
  }

  get filteredProducts(): Product[] {
    return this.allProducts.filter(p => {
      const matchesCategory = this.activeCategory() === 'all' || p.category === this.activeCategory();
      const query = this.searchQuery.toLowerCase().trim();
      const matchesSearch = !query || p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }
}
