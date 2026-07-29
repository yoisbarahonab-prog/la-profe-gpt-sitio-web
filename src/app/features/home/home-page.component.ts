import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { Product, CategoryFilter } from '../../core/models/product.model';

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
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-[#FDF5FF] text-profe-text overflow-hidden font-sans relative">

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

      <!-- ========================================================= -->
      <!-- 1. HERO SECTION                                           -->
      <!-- ========================================================= -->
      <section class="relative bg-gradient-to-b from-[#FFF0F3]/60 via-[#EDE9FF]/30 to-[#FDF5FF] pt-8 pb-16 px-4 sm:px-8 lg:px-12 z-10">
        
        <div class="max-w-[1440px] mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center">
          
          <!-- Hero Text Content -->
          <div class="lg:col-span-6 text-center lg:text-left space-y-5 z-10 w-full">
            
            <!-- Mobile / Desktop Top Pill -->
            <div class="inline-flex items-center gap-1.5 bg-white border border-profe-purple-light/70 px-4 py-1.5 rounded-full shadow-xs mb-2">
              <span class="text-profe-pink font-bold text-xs">♡</span>
              <span class="text-[11px] font-extrabold tracking-wider uppercase text-profe-purple-dark">
                PLATAFORMA ESPECIALIZADA
              </span>
            </div>

            <!-- Titular Principal Exacto acorde a la Imagen del Usuario -->
            <!-- Linea 1: Oscuro (#1E1040), Linea 2: Morado (#6B4FBB), Linea 3: Rosa (#E8607A) -->
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1E1040] leading-[1.12]">
              Prepárate para tu<br>
              <span class="text-[#6B4FBB]">Evaluación</span><br>
              <span class="text-[#E8607A]">Docente 2026</span>
            </h1>

            <p class="text-base sm:text-xl font-extrabold text-profe-purple-dark leading-snug">
              con programas digitales diseñados para docentes. <span class="text-profe-pink">♡</span>
            </p>

            <p class="text-xs sm:text-base font-semibold text-profe-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
              Aprende a tu ritmo con recursos especializados que integran videos, materiales de estudio, documentos de apoyo y herramientas de inteligencia artificial.
            </p>

            <!-- Botones CTA Principales -->
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full">
              
              <a 
                routerLink="/catalogo"
                class="w-full sm:w-auto bg-profe-pink hover:bg-profe-pink-dark text-white font-black text-sm sm:text-base px-9 py-4 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                <span class="text-lg">📖</span>
                <span>Ver programas</span>
              </a>

              <a 
                href="#como-funciona"
                class="w-full sm:w-auto bg-white border-2 border-profe-purple-light hover:border-profe-purple text-profe-purple-dark font-black text-sm sm:text-base px-9 py-4 rounded-2xl shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                <span class="w-5 h-5 rounded-full border border-profe-purple text-profe-purple flex items-center justify-center text-[10px]">▶</span>
                <span>¿Cómo funciona?</span>
              </a>

            </div>

          </div>

          <!-- Hero 3D Graphic Composite con Halo Degradado 3 Colores -->
          <div class="lg:col-span-6 relative flex justify-center items-center w-full">
            <div class="relative w-full max-w-xl group flex justify-center items-center">
              
              <!-- Halo Blur Degradado 3 Colores -->
              <div class="absolute -inset-4 bg-gradient-to-tr from-[#6B4FBB] via-[#E8607A] to-[#8B5CF6] rounded-full blur-3xl opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 -z-10"></div>

              <img 
                src="/assets/images/hero-composition-3d.png" 
                alt="La Profe GPT Evaluación Docente 2026" 
                class="w-full h-auto object-contain drop-shadow-xl hover:scale-102 transition-transform duration-500 relative z-10">
            </div>
          </div>

        </div>

      </section>


      <!-- ========================================================= -->
      <!-- 2. TRUST / FEATURE BADGES BAR                            -->
      <!-- ========================================================= -->
      <section class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 -mt-4 mb-16 relative z-20">
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-profe-purple-light/50 shadow-lg grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 p-2">
            <div class="w-13 h-13 rounded-full bg-[#EDE9FF] flex items-center justify-center flex-shrink-0 p-3">
              <img src="/assets/icons/icon-users.png" alt="Miles de docentes" class="w-full h-full object-contain">
            </div>
            <div>
              <h3 class="font-extrabold text-xs sm:text-sm text-profe-purple-dark leading-snug">Miles de docentes</h3>
              <p class="text-[11px] text-profe-muted font-bold">ya confían en La Profe GPT</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 p-2">
            <div class="w-13 h-13 rounded-full bg-[#FFF0F3] flex items-center justify-center flex-shrink-0 p-3">
              <img src="/assets/icons/icon-shield-check.png" alt="Contenido oficial" class="w-full h-full object-contain">
            </div>
            <div>
              <h3 class="font-extrabold text-xs sm:text-sm text-profe-purple-dark leading-snug">Contenido alineado a</h3>
              <p class="text-[11px] text-profe-muted font-bold">manuales y rúbricas oficiales 2026</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 p-2">
            <div class="w-13 h-13 rounded-full bg-[#EDE9FF] flex items-center justify-center flex-shrink-0 p-3">
              <img src="/assets/icons/icon-calendar.png" alt="Acceso hasta" class="w-full h-full object-contain">
            </div>
            <div>
              <h3 class="font-extrabold text-xs sm:text-sm text-profe-purple-dark leading-snug">Acceso hasta</h3>
              <p class="text-[11px] text-profe-muted font-bold">abril 2027</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 p-2">
            <div class="w-13 h-13 rounded-full bg-[#FFF0F3] flex items-center justify-center flex-shrink-0 p-3">
              <img src="/assets/icons/icon-sync.png" alt="Actualizaciones" class="w-full h-full object-contain">
            </div>
            <div>
              <h3 class="font-extrabold text-xs sm:text-sm text-profe-purple-dark leading-snug">Actualizaciones</h3>
              <p class="text-[11px] text-profe-muted font-bold">constantes</p>
            </div>
          </div>

        </div>
      </section>


      <!-- ========================================================= -->
      <!-- 3. NUESTROS PROGRAMAS DE PREPARACIÓN                      -->
      <!-- ========================================================= -->
      <section id="programas" class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 relative z-10">
        
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="text-profe-pink font-black text-xs tracking-widest uppercase block mb-1">
            \ \ Nuestros programas de preparación / /
          </span>
          <h2 class="text-2xl sm:text-4xl font-black text-profe-purple-dark tracking-tight">
            Programas digitales de preparación para cada etapa de tu Evaluación Docente.
          </h2>
        </div>

        <!-- Desktop Cards (3 Columns con Tonalidades Dedicadas) -->
        <div class="hidden lg:grid grid-cols-3 gap-8">
          
          <!-- TARJETA 1: PORTAFOLIO DOCENTE -->
          <div id="portafolio" class="bg-[#F5F0FF]/90 backdrop-blur-sm rounded-3xl p-8 border-2 border-[#D8CDFA] hover:border-profe-purple shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div class="flex items-start justify-between mb-4">
                <div class="w-13 h-13 rounded-2xl bg-profe-purple text-white flex items-center justify-center p-3 shadow-sm">
                  <img src="/assets/icons/icon-book.png" alt="Portafolio" class="w-full h-full object-contain brightness-200">
                </div>
                <img 
                  src="/assets/images/book-portafolio-3d.png" 
                  alt="Portafolio 3D" 
                  class="w-32 h-auto object-contain transform group-hover:scale-105 transition-transform">
              </div>

              <h3 class="text-2xl font-black text-[#4A3490] mb-2">
                Portafolio Docente 2026
              </h3>
              <p class="text-xs sm:text-sm font-semibold text-profe-muted mb-6 leading-relaxed">
                Todo lo que necesitas para construir tu Portafolio Docente con seguridad y confianza.
              </p>

              <ul class="space-y-3 mb-8 text-xs sm:text-sm font-bold text-profe-text">
                <li class="flex items-center gap-2">
                  <span class="text-profe-purple font-black">✓</span>
                  <span>Videos de orientación</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-profe-purple font-black">✓</span>
                  <span>Materiales y documentos de apoyo</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-profe-purple font-black">✓</span>
                  <span>Asistente de IA especializado</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-profe-purple font-black">✓</span>
                  <span>Actualizaciones incluidas</span>
                </li>
              </ul>
            </div>

            <a 
              routerLink="/catalogo"
              [queryParams]="{ categoria: 'portafolio' }"
              class="w-full bg-white border-2 border-profe-purple text-profe-purple hover:bg-profe-purple hover:text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl transition-all text-center flex items-center justify-center gap-2 shadow-xs">
              <span>Ver programa</span>
              <span>→</span>
            </a>
          </div>

          <!-- TARJETA 2: PROGRAMA ECEP -->
          <div id="ecep" class="bg-[#FFF0F3]/90 backdrop-blur-sm rounded-3xl p-8 border-2 border-[#FBCFE8] hover:border-profe-pink shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div class="flex items-start justify-between mb-4">
                <div class="w-13 h-13 rounded-2xl bg-profe-pink text-white flex items-center justify-center p-3 shadow-sm">
                  <img src="/assets/icons/icon-ecep.png" alt="ECEP" class="w-full h-full object-contain brightness-200">
                </div>
                <img 
                  src="/assets/images/book-ecep-3d.png" 
                  alt="ECEP 3D" 
                  class="w-32 h-auto object-contain transform group-hover:scale-105 transition-transform">
              </div>

              <h3 class="text-2xl font-black text-[#B5194A] mb-2">
                Programa ECEP
              </h3>
              <p class="text-xs sm:text-sm font-semibold text-profe-muted mb-6 leading-relaxed">
                Prepárate para la Evaluación de Conocimientos Específicos y Pedagógicos con recursos de calidad.
              </p>

              <ul class="space-y-3 mb-8 text-xs sm:text-sm font-bold text-profe-text">
                <li class="flex items-center gap-2">
                  <span class="text-profe-pink font-black">✓</span>
                  <span>Banco de preguntas</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-profe-pink font-black">✓</span>
                  <span>Material de estudio</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-profe-pink font-black">✓</span>
                  <span>Asistente de IA especializado</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-profe-pink font-black">✓</span>
                  <span>Actualizaciones incluidas</span>
                </li>
              </ul>
            </div>

            <a 
              routerLink="/catalogo"
              [queryParams]="{ categoria: 'ecep' }"
              class="w-full bg-white border-2 border-profe-pink text-profe-pink-dark hover:bg-profe-pink hover:text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl transition-all text-center flex items-center justify-center gap-2 shadow-xs">
              <span>Ver programa</span>
              <span>→</span>
            </a>
          </div>

          <!-- TARJETA 3: DOSSIER -->
          <div id="dossier" class="bg-[#F3E8FF]/90 backdrop-blur-sm rounded-3xl p-8 border-2 border-[#E9D5FF] hover:border-[#8B5CF6] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div class="flex items-start justify-between mb-4">
                <div class="w-13 h-13 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center p-3 shadow-sm">
                  <img src="/assets/icons/icon-dossier.png" alt="Dossier" class="w-full h-full object-contain brightness-200">
                </div>
                <img 
                  src="/assets/images/book-dossier-3d.png" 
                  alt="Dossier 3D" 
                  class="w-32 h-auto object-contain transform group-hover:scale-105 transition-transform">
              </div>

              <h3 class="text-2xl font-black text-[#6D28D9] mb-2">
                Dossier
              </h3>
              <p class="text-xs sm:text-sm font-semibold text-profe-muted mb-6 leading-relaxed">
                Compilados y dossiers con pruebas oficiales para fortalecer tu preparación.
              </p>

              <ul class="space-y-3 mb-8 text-xs sm:text-sm font-bold text-profe-text">
                <li class="flex items-center gap-2">
                  <span class="text-[#8B5CF6] font-black">✓</span>
                  <span>Pruebas oficiales anteriores</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-[#8B5CF6] font-black">✓</span>
                  <span>Dossiers por asignatura</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-[#8B5CF6] font-black">✓</span>
                  <span>Análisis y síntesis</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-[#8B5CF6] font-black">✓</span>
                  <span>Actualizaciones incluidas</span>
                </li>
              </ul>
            </div>

            <a 
              routerLink="/catalogo"
              [queryParams]="{ categoria: 'dossier' }"
              class="w-full bg-white border-2 border-[#8B5CF6] text-[#6D28D9] hover:bg-[#8B5CF6] hover:text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl transition-all text-center flex items-center justify-center gap-2 shadow-xs">
              <span>Ver programa</span>
              <span>→</span>
            </a>
          </div>

        </div>

        <!-- Mobile Program Items -->
        <div class="lg:hidden space-y-4">
          
          <div class="bg-[#F5F0FF] rounded-2xl p-4 border border-[#D8CDFA] flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-profe-purple text-white flex items-center justify-center p-2.5">
                <img src="/assets/icons/icon-book.png" alt="Portafolio" class="w-full h-full object-contain brightness-200">
              </div>
              <div>
                <h3 class="font-extrabold text-sm text-[#4A3490]">Portafolio Docente 2026</h3>
                <a routerLink="/catalogo" [queryParams]="{ categoria: 'portafolio' }" class="text-xs font-extrabold text-profe-purple hover:underline">Ver programa →</a>
              </div>
            </div>
            <img src="/assets/images/book-portafolio-3d.png" alt="Book 3D" class="w-16 h-auto object-contain">
          </div>

          <div class="bg-[#FFF0F3] rounded-2xl p-4 border border-[#FBCFE8] flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-profe-pink text-white flex items-center justify-center p-2.5">
                <img src="/assets/icons/icon-ecep.png" alt="ECEP" class="w-full h-full object-contain brightness-200">
              </div>
              <div>
                <h3 class="font-extrabold text-sm text-[#B5194A]">Programa ECEP</h3>
                <a routerLink="/catalogo" [queryParams]="{ categoria: 'ecep' }" class="text-xs font-extrabold text-profe-pink-dark hover:underline">Ver programa →</a>
              </div>
            </div>
            <img src="/assets/images/book-ecep-3d.png" alt="Book 3D" class="w-16 h-auto object-contain">
          </div>

          <div class="bg-[#F3E8FF] rounded-2xl p-4 border border-[#E9D5FF] flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center p-2.5">
                <img src="/assets/icons/icon-dossier.png" alt="Dossier" class="w-full h-full object-contain brightness-200">
              </div>
              <div>
                <h3 class="font-extrabold text-sm text-[#6D28D9]">Dossier</h3>
                <a routerLink="/catalogo" [queryParams]="{ categoria: 'dossier' }" class="text-xs font-extrabold text-[#8B5CF6] hover:underline">Ver programa →</a>
              </div>
            </div>
            <img src="/assets/images/book-dossier-3d.png" alt="Book 3D" class="w-16 h-auto object-contain">
          </div>

        </div>

      </section>


      <!-- ========================================================= -->
      <!-- 4. ¿QUÉ INCLUYE CADA PROGRAMA? (GRID DE CARACTERÍSTICAS)  -->
      <!-- ========================================================= -->
      <section id="como-funciona" class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-14 relative z-10">
        
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-profe-pink font-black text-xs tracking-widest uppercase block mb-1">
            \ \ ¿Qué incluye cada programa? / /
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-profe-purple-light/60 shadow-xs hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-[#EDE9FF] p-2.5 mb-4">
              <img src="/assets/icons/icon-video.png" alt="Videos" class="w-full h-full object-contain">
            </div>
            <h3 class="font-extrabold text-base text-profe-purple-dark mb-1.5">Videos de orientación</h3>
            <p class="text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed">
              Módulos audiovisuales con estrategias y explicaciones claras.
            </p>
          </div>

          <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-profe-pink-light/60 shadow-xs hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-[#FFF0F3] p-2.5 mb-4">
              <img src="/assets/icons/icon-document.png" alt="Materiales" class="w-full h-full object-contain">
            </div>
            <h3 class="font-extrabold text-base text-profe-purple-dark mb-1.5">Materiales y documentos</h3>
            <p class="text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed">
              Guías, plantillas y recursos descargables listos para usar.
            </p>
          </div>

          <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-profe-purple-light/60 shadow-xs hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-[#EDE9FF] p-2.5 mb-4">
              <img src="/assets/icons/icon-robot-head.png" alt="Asistente IA" class="w-full h-full object-contain">
            </div>
            <h3 class="font-extrabold text-base text-profe-purple-dark mb-1.5">Asistente de IA especializado</h3>
            <p class="text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed">
              Acceso a un asistente entrenado para resolver dudas y orientar tu trabajo.
            </p>
          </div>

          <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-profe-pink-light/60 shadow-xs hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-[#FFF0F3] p-2.5 mb-4">
              <img src="/assets/icons/icon-star.png" alt="Recursos" class="w-full h-full object-contain">
            </div>
            <h3 class="font-extrabold text-base text-profe-purple-dark mb-1.5">Recursos complementarios</h3>
            <p class="text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed">
              Lecturas, presentaciones y material para profundizar en los temas clave.
            </p>
          </div>

          <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-profe-purple-light/60 shadow-xs hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-[#EDE9FF] p-2.5 mb-4">
              <img src="/assets/icons/icon-sync.png" alt="Actualizaciones" class="w-full h-full object-contain">
            </div>
            <h3 class="font-extrabold text-base text-profe-purple-dark mb-1.5">Actualizaciones incluidas</h3>
            <p class="text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed">
              Nuevos recursos y mejoras durante todo el período de acceso.
            </p>
          </div>

          <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-profe-pink-light/60 shadow-xs hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-[#FFF0F3] p-2.5 mb-4">
              <img src="/assets/icons/icon-calendar.png" alt="Acceso" class="w-full h-full object-contain">
            </div>
            <h3 class="font-extrabold text-base text-profe-purple-dark mb-1.5">Acceso extendido</h3>
            <p class="text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed">
              Uso del programa las veces que necesites hasta abril 2027.
            </p>
          </div>

        </div>

      </section>


      <!-- ========================================================= -->
      <!-- 5. BANNER CTA ("Aprende a tu ritmo...")                   -->
      <!-- ========================================================= -->
      <section class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 relative z-10">
        
        <div class="bg-gradient-to-r from-[#FFF0F3] via-[#F8F5FF] to-[#FFF0F3] rounded-3xl p-8 sm:p-12 border-2 border-profe-purple-light/50 shadow-md relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div class="flex-1 space-y-4 text-center lg:text-left z-10">
            
            <div class="inline-flex items-center gap-2">
              <img src="/assets/icons/icon-heart-pink.png" alt="Heart" class="w-9 h-9 object-contain">
            </div>

            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-profe-purple-dark leading-snug">
              Aprende a tu ritmo, con recursos de calidad<br class="hidden sm:inline"> y el apoyo de la IA para potenciar tu trabajo docente. <span class="text-profe-pink">♡</span>
            </h2>

            <div class="flex flex-wrap justify-center lg:justify-start gap-3 pt-3">
              
              <div class="bg-white/90 border border-profe-purple-light px-4 py-2 rounded-full text-xs font-extrabold text-profe-purple-dark flex items-center gap-2 shadow-xs">
                <img src="/assets/icons/icon-document.png" alt="Documento" class="w-4 h-4 object-contain">
                <span>Contenido alineado a manuales y rúbricas 2026</span>
              </div>

              <div class="bg-white/90 border border-profe-pink-light px-4 py-2 rounded-full text-xs font-extrabold text-profe-pink-dark flex items-center gap-2 shadow-xs">
                <img src="/assets/icons/icon-shield-check.png" alt="Seguro" class="w-4 h-4 object-contain">
                <span>Compatible con ChatGPT gratuito y Plus</span>
              </div>

              <div class="bg-white/90 border border-profe-purple-light px-4 py-2 rounded-full text-xs font-extrabold text-profe-purple-dark flex items-center gap-2 shadow-xs">
                <img src="/assets/icons/icon-users.png" alt="Personal" class="w-4 h-4 object-contain">
                <span>Acceso personal e intransferible</span>
              </div>

            </div>

          </div>

          <!-- Robot con Halo Degradado 3 Colores -->
          <div class="w-44 sm:w-56 flex-shrink-0 z-10">
            <div class="relative group flex justify-center items-center">
              <div class="absolute -inset-3 bg-gradient-to-tr from-[#6B4FBB] via-[#E8607A] to-[#8B5CF6] rounded-full blur-2xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 -z-10"></div>
              
              <img 
                src="/assets/images/robot-hero.png" 
                alt="Robot Asistente La Profe GPT" 
                class="w-full h-auto object-contain animate-float-slow relative z-10 filter drop-shadow-lg">
            </div>
          </div>

        </div>
      </section>

    </div>
  `
})
export class HomePageComponent {
  private productService = inject(ProductService);
  private seoService = inject(SeoService);
  public cartService = inject(CartService);

  allProducts: Product[] = [];
  selectedTab = signal<CategoryFilter>('all');

  bgShapes: BgShape[] = [
    { symbol: '✦', top: '2%', left: '3%', size: 'text-4xl', color: 'text-profe-pink/50', animation: 'animate-sparkle' },
    { symbol: '♡', top: '5%', left: '22%', size: 'text-2xl', color: 'text-profe-purple/35', animation: 'animate-pulse-heart' },
    { symbol: '✨', top: '3%', left: '48%', size: 'text-3xl', color: 'text-profe-pink/40', animation: 'animate-sparkle' },
    { symbol: '♥', top: '7%', left: '74%', size: 'text-4xl', color: 'text-profe-pink/35', animation: 'animate-pulse-heart' },
    { symbol: '✦', top: '4%', left: '94%', size: 'text-5xl', color: 'text-profe-purple/40', animation: 'animate-sparkle' },

    { symbol: '✨', top: '12%', left: '12%', size: 'text-2xl', color: 'text-profe-pink/50', animation: 'animate-sparkle' },
    { symbol: '✦', top: '16%', left: '35%', size: 'text-xl', color: 'text-purple-400/30', animation: 'animate-sparkle' },
    { symbol: '♡', top: '14%', left: '62%', size: 'text-3xl', color: 'text-profe-pink/35', animation: 'animate-pulse-heart' },
    { symbol: '♥', top: '18%', left: '86%', size: 'text-2xl', color: 'text-profe-pink-dark/30', animation: 'animate-pulse-heart' },

    { symbol: '♡', top: '25%', left: '5%', size: 'text-3xl', color: 'text-profe-purple/40', animation: 'animate-pulse-heart' },
    { symbol: '✦', top: '28%', left: '26%', size: 'text-4xl', color: 'text-profe-pink/30', animation: 'animate-sparkle' },
    { symbol: '✨', top: '24%', left: '54%', size: 'text-2xl', color: 'text-purple-400/35', animation: 'animate-sparkle' },
    { symbol: '♥', top: '30%', left: '80%', size: 'text-4xl', color: 'text-profe-pink/40', animation: 'animate-pulse-heart' },

    { symbol: '✨', top: '37%', left: '15%', size: 'text-3xl', color: 'text-profe-pink/45', animation: 'animate-sparkle' },
    { symbol: '♥', top: '40%', left: '42%', size: 'text-2xl', color: 'text-profe-purple/25', animation: 'animate-pulse-heart' },
    { symbol: '✦', top: '38%', left: '68%', size: 'text-3xl', color: 'text-profe-pink/30', animation: 'animate-sparkle' },
    { symbol: '♡', top: '42%', left: '92%', size: 'text-4xl', color: 'text-profe-purple/40', animation: 'animate-pulse-heart' },

    { symbol: '✦', top: '50%', left: '4%', size: 'text-5xl', color: 'text-profe-pink/40', animation: 'animate-sparkle' },
    { symbol: '♡', top: '54%', left: '28%', size: 'text-2xl', color: 'text-purple-500/30', animation: 'animate-pulse-heart' },
    { symbol: '✨', top: '52%', left: '58%', size: 'text-4xl', color: 'text-profe-pink/35', animation: 'animate-sparkle' },
    { symbol: '♥', top: '56%', left: '84%', size: 'text-3xl', color: 'text-profe-pink/45', animation: 'animate-pulse-heart' },

    { symbol: '✨', top: '64%', left: '18%', size: 'text-2xl', color: 'text-profe-purple/35', animation: 'animate-sparkle' },
    { symbol: '✦', top: '68%', left: '46%', size: 'text-3xl', color: 'text-profe-pink/30', animation: 'animate-sparkle' },
    { symbol: '♡', top: '66%', left: '72%', size: 'text-4xl', color: 'text-purple-400/30', animation: 'animate-pulse-heart' },
    { symbol: '✦', top: '70%', left: '95%', size: 'text-3xl', color: 'text-profe-pink/40', animation: 'animate-sparkle' },

    { symbol: '♥', top: '78%', left: '8%', size: 'text-4xl', color: 'text-profe-pink/45', animation: 'animate-pulse-heart' },
    { symbol: '✨', top: '82%', left: '32%', size: 'text-3xl', color: 'text-profe-purple/30', animation: 'animate-sparkle' },
    { symbol: '✦', top: '80%', left: '62%', size: 'text-4xl', color: 'text-profe-pink/35', animation: 'animate-sparkle' },
    { symbol: '♡', top: '85%', left: '88%', size: 'text-3xl', color: 'text-profe-purple/40', animation: 'animate-pulse-heart' },

    { symbol: '✦', top: '92%', left: '3%', size: 'text-5xl', color: 'text-profe-pink/50', animation: 'animate-sparkle' },
    { symbol: '♡', top: '95%', left: '24%', size: 'text-2xl', color: 'text-purple-400/35', animation: 'animate-pulse-heart' },
    { symbol: '✨', top: '93%', left: '52%', size: 'text-3xl', color: 'text-profe-pink/40', animation: 'animate-sparkle' },
    { symbol: '♥', top: '96%', left: '78%', size: 'text-4xl', color: 'text-profe-pink-dark/30', animation: 'animate-pulse-heart' },
    { symbol: '✦', top: '97%', left: '96%', size: 'text-3xl', color: 'text-profe-purple/45', animation: 'animate-sparkle' }
  ];

  constructor() {
    this.seoService.updateSeo({
      title: 'La Profe GPT | Portafolio Docente 2026, ECEP y Dossier CPEIP',
      description: 'Prepárate para tu Evaluación Docente 2026 con programas digitales diseñados para docentes. Asistentes de IA y dossiers descargables.'
    });

    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
    });
  }

  filterTab(category: CategoryFilter) {
    this.selectedTab.set(category);
  }
}
