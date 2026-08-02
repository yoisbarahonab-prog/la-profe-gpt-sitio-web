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
          <div class="lg:col-span-6 text-center lg:text-left space-y-5 z-10 w-full flex flex-col items-center lg:items-start">
            
            <!-- Titular Principal Exacto -->
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

            <!-- Imagen Hero 3D (Se coloca AQUÍ en móviles entre el texto y los botones CTA, order-2 en móvil, en desktop pasa a la derecha col-span-6) -->
            <div class="w-full lg:hidden my-3 relative flex justify-center items-center">
              <img 
                src="/assets/images/hero-gpt.png" 
                alt="La Profe GPT Evaluación Docente 2026" 
                class="w-full max-w-md h-auto object-contain pointer-events-none select-none drop-shadow-[0_15px_25px_rgba(107,79,187,0.15)]"
                style="-webkit-mask-image: linear-gradient(to bottom, transparent, black 4px, black calc(100% - 4px), transparent), linear-gradient(to right, transparent, black 6px, black calc(100% - 6px), transparent); -webkit-mask-composite: source-in; mask-image: linear-gradient(to bottom, transparent, black 4px, black calc(100% - 4px), transparent), linear-gradient(to right, transparent, black 6px, black calc(100% - 6px), transparent); mask-composite: intersect;">
            </div>

            <!-- Botones CTA Principales (Aparecen debajo de la imagen en móvil) -->
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

          <!-- Hero 3D Graphic Composite (Solo Visible en Pantallas Escritorio lg:block) -->
          <div class="hidden lg:flex lg:col-span-6 relative justify-end items-center w-full">
            <img 
              src="/assets/images/hero-gpt.png" 
              alt="La Profe GPT Evaluación Docente 2026" 
              class="w-[130%] max-w-none -mr-16 h-auto object-contain pointer-events-none select-none drop-shadow-[0_20px_35px_rgba(107,79,187,0.18)]"
              style="-webkit-mask-image: linear-gradient(to bottom, transparent, black 15px, black calc(100% - 15px), transparent), linear-gradient(to right, transparent, black 25px, black calc(100% - 25px), transparent); -webkit-mask-composite: source-in; mask-image: linear-gradient(to bottom, transparent, black 15px, black calc(100% - 15px), transparent), linear-gradient(to right, transparent, black 25px, black calc(100% - 25px), transparent); mask-composite: intersect;">
          </div>

        </div>

      </section>


      <!-- ========================================================= -->
      <!-- 2. TRUST / FEATURE BADGES BAR                            -->
      <!-- ========================================================= -->
      <section class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 -mt-4 mb-16 relative z-20">
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-profe-purple-light/50 shadow-lg hover:shadow-2xl transition-all duration-500 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <!-- Badge 1 -->
          <div class="group flex items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
            <div class="h-50 w-auto rounded-full bg-[#EDE9FF] flex items-center justify-center flex-shrink-0 p-3 shadow-xs group-hover:shadow-md animate-float-slow transition-all duration-300">
              <img 
                src="/assets/icons/barra-content1.png" 
                alt="Miles de docentes" 
                class="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-1 transition-transform duration-300">
            </div>
          </div>

          <!-- Badge 2 -->
          <div class="group flex items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
            <div class="h-50 w-auto rounded-full bg-[#FFF0F3] flex items-center justify-center flex-shrink-0 p-3 shadow-xs group-hover:shadow-md animate-float-reverse transition-all duration-300">
              <img 
                src="/assets/icons/barra-content2.png" 
                alt="Contenido oficial" 
                class="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-1 transition-transform duration-300">
            </div>
          </div>

          <!-- Badge 3 -->
          <div class="group flex items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
            <div class="h-50 w-auto rounded-full bg-[#EDE9FF] flex items-center justify-center flex-shrink-0 p-3 shadow-xs group-hover:shadow-md animate-float-slow transition-all duration-300" style="animation-delay: 0.5s;">
              <img 
                src="/assets/icons/barra-content3.png" 
                alt="Acceso hasta" 
                class="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-1 transition-transform duration-300">
            </div>
          </div>

          <!-- Badge 4 -->
          <div class="group flex items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
            <div class="h-50 w-auto rounded-full bg-[#FFF0F3] flex items-center justify-center flex-shrink-0 p-3 shadow-xs group-hover:shadow-md animate-float-reverse transition-all duration-300" style="animation-delay: 0.5s;">
              <img 
                src="/assets/icons/barra-content4.png" 
                alt="Actualizaciones" 
                class="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-1 transition-transform duration-300">
            </div>
          </div>

        </div>
      </section>


      <!-- ========================================================= -->
      <!-- 3. NUESTROS PROGRAMAS DE PREPARACIÓN                      -->
      <!-- ========================================================= -->
      <section id="programas" class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 relative z-10">
        
        <div class="text-center max-w-3xl mx-auto mb-12">
          <div class="inline-flex items-center justify-center gap-2 mb-1">
            <img src="/assets/icons/title-burst-left.svg" alt="Spark icon" class="h-8 w-auto object-contain">
            <span class="text-profe-pink font-black text-xl tracking-widest uppercase">
              Nuestros programas de preparación
            </span>
            <img src="/assets/icons/title-burst-right.svg" alt="Spark icon" class="h-8 w-auto object-contain">
          </div>
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
          <div class="inline-flex items-center justify-center gap-2 mb-1">
            <img src="/assets/icons/title-burst-left.svg" alt="Spark icon" class="h-8 w-auto object-contain">
            <span class="text-profe-pink font-black text-xl tracking-widest uppercase">
              ¿Qué incluye cada programa?
            </span>
            <img src="/assets/icons/title-burst-right.svg" alt="Spark icon" class="h-8 w-auto object-contain">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 p-2">
          
          <!-- Sticker 1 (Inclinado -2deg) -->
          <div class="bg-white/95 backdrop-blur-sm rounded-3xl p-2 border-2 border-profe-purple-light/70 shadow-md hover:shadow-xl -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center cursor-pointer">
            <div class="w-full h-36 sm:h-44 rounded-2xl overflow-hidden flex items-center justify-center">
              <img 
                src="/assets/icons/asistente-ia.png" 
                alt="Asistente IA" 
                class="w-full h-full rounded-2xl object-contain sm:object-cover"
                style="-webkit-mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); -webkit-mask-composite: source-in; mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); mask-composite: intersect;">
            </div>
          </div>

          <!-- Sticker 2 (Inclinado +3deg) -->
          <div class="bg-white/95 backdrop-blur-sm rounded-3xl p-2 border-2 border-profe-purple-light/70 shadow-md hover:shadow-xl rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center cursor-pointer">
            <div class="w-full h-36 sm:h-44 rounded-2xl overflow-hidden flex items-center justify-center">
              <img 
                src="/assets/icons/asistente-ia.png" 
                alt="Asistente IA" 
                class="w-full h-full rounded-2xl object-contain sm:object-cover"
                style="-webkit-mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); -webkit-mask-composite: source-in; mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); mask-composite: intersect;">
            </div>
          </div>

          <!-- Sticker 3 (Inclinado -1.5deg) -->
          <div class="bg-white/95 backdrop-blur-sm rounded-3xl p-2 border-2 border-profe-purple-light/70 shadow-md hover:shadow-xl -rotate-1 sm:-rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center cursor-pointer">
            <div class="w-full h-36 sm:h-44 rounded-2xl overflow-hidden flex items-center justify-center">
              <img 
                src="/assets/icons/asistente-ia.png" 
                alt="Asistente IA" 
                class="w-full h-full rounded-2xl object-contain sm:object-cover"
                style="-webkit-mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); -webkit-mask-composite: source-in; mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); mask-composite: intersect;">
            </div>
          </div>

          <!-- Sticker 4 (Inclinado +2.5deg) -->
          <div class="bg-white/95 backdrop-blur-sm rounded-3xl p-2 border-2 border-profe-pink-light/70 shadow-md hover:shadow-xl rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center cursor-pointer">
            <div class="w-full h-36 sm:h-44 rounded-2xl overflow-hidden flex items-center justify-center">
              <img 
                src="/assets/icons/recursos-complementarios.png" 
                alt="Recursos" 
                class="w-full h-full rounded-2xl object-contain sm:object-cover"
                style="-webkit-mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); -webkit-mask-composite: source-in; mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); mask-composite: intersect;">
            </div>
          </div>

          <!-- Sticker 5 (Inclinado -3deg) -->
          <div class="bg-white/95 backdrop-blur-sm rounded-3xl p-2 border-2 border-profe-purple-light/70 shadow-md hover:shadow-xl -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center cursor-pointer">
            <div class="w-full h-36 sm:h-44 rounded-2xl overflow-hidden flex items-center justify-center">
              <img 
                src="/assets/icons/actualizaciones-incluidas.png" 
                alt="Actualizaciones" 
                class="w-full h-full rounded-2xl object-contain sm:object-cover"
                style="-webkit-mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); -webkit-mask-composite: source-in; mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); mask-composite: intersect;">
            </div>
          </div>

          <!-- Sticker 6 (Inclinado +1.5deg) -->
          <div class="bg-white/95 backdrop-blur-sm rounded-3xl p-2 border-2 border-profe-pink-light/70 shadow-md hover:shadow-xl rotate-1 sm:rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center cursor-pointer">
            <div class="w-full h-36 sm:h-44 rounded-2xl overflow-hidden flex items-center justify-center">
              <img 
                src="/assets/icons/acceso-flexible.png" 
                alt="Acceso" 
                class="w-full h-full rounded-2xl object-contain sm:object-cover"
                style="-webkit-mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); -webkit-mask-composite: source-in; mask-image: linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent), linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent); mask-composite: intersect;">
            </div>
          </div>

        </div>

      </section>      


      <!-- ========================================================= -->
      <!-- 6. BANNER CTA ("Aprende a tu ritmo...")                   -->
      <!-- ========================================================= -->
      <section class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 relative z-10">
        
        <div class="bg-gradient-to-r from-[#FFF0F3] via-[#F8F5FF] to-[#FFF0F3] rounded-3xl p-8 sm:p-12 border-2 border-profe-purple-light/50 shadow-md relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div class="flex-1 text-center lg:text-left z-10">
            
            <div class="inline-flex items-center gap-2">
              <img 
                src="/assets/icons/book-heart.png" 
                alt="Heart" 
                class="h-28 w-auto object-contain animate-float-slow filter drop-shadow-md hover:scale-110 transition-transform duration-300">
            </div>

            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-profe-purple-dark leading-snug">
              Aprende a tu ritmo, <span class="text-profe-pink">con recursos de calidad y el apoyo de la IA</span> para potenciar tu trabajo docente. <span class="text-profe-pink inline-block animate-pulse-heart">♡</span>
            </h2>

            <div class="flex flex-wrap justify-center lg:justify-start gap-3 pt-3">
              
              <div class="bg-white/90 border border-profe-purple-light px-4 py-2 rounded-full text-xs font-extrabold text-profe-purple-dark flex items-center gap-2 shadow-xs hover:shadow-md hover:-translate-y-1 hover:bg-white transition-all duration-300 cursor-pointer group">
                <span class="inline-block animate-float-slow" style="animation-delay: 0.4s;">
                  <img src="/assets/icons/contenido.png" alt="Documento" class="h-16 w-auto object-contain block transform transition-transform duration-300 group-hover:scale-125">
                </span>
                <span>Contenido alineado a manuales y rúbricas 2026</span>
              </div>

              <div class="bg-white/90 border border-profe-pink-light px-4 py-2 rounded-full text-xs font-extrabold text-profe-pink-dark flex items-center gap-2 shadow-xs hover:shadow-md hover:-translate-y-1 hover:bg-white transition-all duration-300 cursor-pointer group">
                <span class="inline-block animate-float-reverse" style="animation-delay: 0.8s;">
                  <img src="/assets/icons/compatible.png" alt="Seguro" class="h-16 w-auto object-contain block transform transition-transform duration-300 group-hover:scale-125">
                </span>
                <span>Compatible con ChatGPT gratuito y Plus</span>
              </div>

              <div class="bg-white/90 border border-profe-purple-light px-4 py-2 rounded-full text-xs font-extrabold text-profe-purple-dark flex items-center gap-2 shadow-xs hover:shadow-md hover:-translate-y-1 hover:bg-white transition-all duration-300 cursor-pointer group">
                <span class="inline-block animate-float-slow" style="animation-delay: 1.2s;">
                  <img src="/assets/icons/acceso.png" alt="Personal" class="h-16 w-auto object-contain block transform transition-transform duration-300 group-hover:scale-125">
                </span>
                <span>Acceso personal e intransferible</span>
              </div>

            </div>

          </div>

          <!-- Robot con Halo Degradado 3 Colores y Animación Inversa Desfasada -->
          <div class="w-44 sm:w-56 flex-shrink-0 z-10">
            <div class="relative group flex justify-center items-center">
              <div class="absolute -inset-3 bg-gradient-to-tr from-[#6B4FBB] via-[#E8607A] to-[#8B5CF6] rounded-full blur-2xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 -z-10"></div>
              
              <img 
                src="/assets/images/robot-hero.png" 
                alt="Robot Asistente La Profe GPT" 
                class="w-full h-auto object-contain animate-float-reverse relative z-10 filter drop-shadow-lg"
                style="animation-delay: 1.5s;">
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
