import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdminService, AdminProduct, DocumentAsset, AttachmentItem } from '../../core/services/admin.service';
import { CategoryFilter } from '../../core/models/product.model';
import { ClpCurrencyPipe } from '../../shared/pipes/clp-currency.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ClpCurrencyPipe],
  template: `
    <div class="min-h-screen bg-[#FDF5FF] text-profe-text font-sans pb-16">
      
      <!-- Top Admin Header Bar -->
      <header class="bg-white border-b border-profe-purple-light/50 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
        <div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          
          <div class="flex items-center gap-4">
            <a routerLink="/" class="hover:scale-105 transition-transform">
              <img src="/assets/images/LOGO.png" alt="Logo" class="h-9 w-auto object-contain">
            </a>
            
            <!-- Navigation Tabs -->
            <div class="flex items-center gap-1 bg-[#EDE9FF] p-1 rounded-2xl">
              <button 
                (click)="activeTab.set('products')"
                [class.bg-profe-purple]="activeTab() === 'products'"
                [class.text-white]="activeTab() === 'products'"
                [class.text-profe-purple-dark]="activeTab() !== 'products'"
                class="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5">
                <span>📦</span>
                <span>Productos</span>
              </button>

              <button 
                (click)="activeTab.set('documents')"
                [class.bg-profe-purple]="activeTab() === 'documents'"
                [class.text-white]="activeTab() === 'documents'"
                [class.text-profe-purple-dark]="activeTab() !== 'documents'"
                class="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5">
                <span>📁</span>
                <span>Mantenedor Documentos</span>
              </button>
            </div>
          </div>

          <div class="flex items-center gap-3">
            
            <button 
              *ngIf="activeTab() === 'products'"
              (click)="openCreateModal()"
              class="bg-profe-pink hover:bg-profe-pink-dark text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5">
              <span>➕</span>
              <span>Crear Nuevo Producto</span>
            </button>

            <button 
              *ngIf="activeTab() === 'documents'"
              (click)="openUploadDocModal()"
              class="bg-profe-purple hover:bg-profe-purple-dark text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5">
              <span>📤</span>
              <span>Subir / Registrar Documento</span>
            </button>

            <div class="hidden sm:flex flex-col text-right leading-tight border-l border-gray-200 pl-3">
              <span class="text-xs font-black text-profe-purple-dark">{{ currentUser()?.name || 'Administrador' }}</span>
              <span class="text-[10px] font-semibold text-profe-muted">{{ currentUser()?.email || 'admin@laprofegpt.cl' }}</span>
            </div>

            <button 
              (click)="onLogout()"
              class="bg-[#FFF0F3] hover:bg-profe-pink border border-[#FBCFE8] text-profe-pink-dark hover:text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5">
              <span>🚪</span>
              <span class="hidden sm:inline">Salir</span>
            </button>
          </div>

        </div>
      </header>

      <main class="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
        
        <!-- Feedback Toast Message -->
        <div *ngIf="toastMessage()" class="mb-6 bg-[#EDE9FF] border-2 border-profe-purple text-profe-purple-dark p-4 rounded-2xl text-xs font-black flex items-center justify-between shadow-md animate-fade-in-up">
          <div class="flex items-center gap-2">
            <span class="text-base">✅</span>
            <span>{{ toastMessage() }}</span>
          </div>
          <button (click)="toastMessage.set('')" class="text-profe-purple hover:text-profe-pink font-bold">✕</button>
        </div>

        <!-- Pop-up Alerta de Bloqueo al Eliminar Documento en Uso -->
        <div *ngIf="deleteWarningAlert()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-3xl border-2 border-red-500 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 text-2xl font-black">
              ⚠️
            </div>
            
            <div>
              <h3 class="text-lg font-black text-red-600">No se puede eliminar el documento</h3>
              <p class="text-xs font-bold text-gray-600 mt-1">
                El archivo <code class="bg-gray-100 px-1.5 py-0.5 rounded text-red-600 font-extrabold">{{ deleteWarningAlert()?.fileName }}</code> está siendo utilizado en los siguientes productos:
              </p>
            </div>

            <div class="bg-red-50 border border-red-200 rounded-2xl p-3 max-h-40 overflow-y-auto text-left">
              <ul class="space-y-1 text-xs font-black text-red-800">
                <li *ngFor="let pName of deleteWarningAlert()?.productNames" class="flex items-center gap-1.5">
                  <span>•</span>
                  <span>{{ pName }}</span>
                </li>
              </ul>
            </div>

            <p class="text-[11px] font-semibold text-profe-muted">
              Para eliminar este documento, primero debes desvincularlo de los productos listados arriba.
            </p>

            <button 
              (click)="deleteWarningAlert.set(null)"
              class="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-md">
              Entendido, volver
            </button>
          </div>
        </div>

        <!-- ========================================================================================= -->
        <!-- PESTAÑA 1: PRODUCTOS DEL CATÁLOGO                                                         -->
        <!-- ========================================================================================= -->
        <div *ngIf="activeTab() === 'products'">
          
          <!-- Header Banner & Summary Stats -->
          <div class="mb-8 bg-gradient-to-r from-[#FFF0F3] via-[#F8F5FF] to-[#FFF0F3] border-2 border-profe-purple-light/70 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span class="text-profe-pink font-black text-xs uppercase tracking-widest block mb-1">
                \ \ Bóveda Privada & Catálogo / /
              </span>
              <h1 class="text-2xl sm:text-3xl font-black text-profe-purple-dark">
                Gestión de Paquetes y Productos
              </h1>
              <p class="text-xs sm:text-sm font-semibold text-profe-muted mt-1">
                Crea nuevos recursos o modifica precios, descripciones, enlaces a Custom GPTs y archivos adjuntos (PDF/Word).
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <div class="bg-white border border-profe-purple-light/70 px-4 py-2.5 rounded-2xl shadow-xs text-center">
                <span class="block text-xl font-black text-profe-purple">{{ products().length }}</span>
                <span class="text-[10px] font-bold text-profe-muted uppercase">Total Productos</span>
              </div>
              <div class="bg-white border border-profe-pink-light/70 px-4 py-2.5 rounded-2xl shadow-xs text-center">
                <span class="block text-xl font-black text-profe-pink">{{ getCountByCategory('portafolio') }}</span>
                <span class="text-[10px] font-bold text-profe-muted uppercase">Portafolios</span>
              </div>
              <div class="bg-white border border-profe-purple-light/70 px-4 py-2.5 rounded-2xl shadow-xs text-center">
                <span class="block text-xl font-black text-[#8B5CF6]">{{ getCountByCategory('ecep') }}</span>
                <span class="text-[10px] font-bold text-profe-muted uppercase">ECEP</span>
              </div>
              <div class="bg-white border border-profe-pink-light/70 px-4 py-2.5 rounded-2xl shadow-xs text-center">
                <span class="block text-xl font-black text-[#B5194A]">{{ getCountByCategory('dossier') }}</span>
                <span class="text-[10px] font-bold text-profe-muted uppercase">Dossiers</span>
              </div>
            </div>
          </div>

          <!-- Filter Bar & Search -->
          <div class="bg-white/95 backdrop-blur-md border-2 border-profe-purple-light/70 p-4 rounded-3xl shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div class="flex flex-wrap gap-2 w-full md:w-auto">
              <button 
                (click)="selectedCategory.set('all')"
                [class.bg-profe-purple]="selectedCategory() === 'all'"
                [class.text-white]="selectedCategory() === 'all'"
                [class.bg-[#EDE9FF]]="selectedCategory() !== 'all'"
                [class.text-profe-purple-dark]="selectedCategory() !== 'all'"
                class="px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-xs">
                Todos ({{ products().length }})
              </button>

              <button 
                (click)="selectedCategory.set('portafolio')"
                [class.bg-profe-purple]="selectedCategory() === 'portafolio'"
                [class.text-white]="selectedCategory() === 'portafolio'"
                [class.bg-[#EDE9FF]]="selectedCategory() !== 'portafolio'"
                [class.text-profe-purple-dark]="selectedCategory() !== 'portafolio'"
                class="px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-xs">
                📚 Portafolio ({{ getCountByCategory('portafolio') }})
              </button>

              <button 
                (click)="selectedCategory.set('ecep')"
                [class.bg-profe-purple]="selectedCategory() === 'ecep'"
                [class.text-white]="selectedCategory() === 'ecep'"
                [class.bg-[#EDE9FF]]="selectedCategory() !== 'ecep'"
                [class.text-profe-purple-dark]="selectedCategory() !== 'ecep'"
                class="px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-xs">
                🎓 ECEP ({{ getCountByCategory('ecep') }})
              </button>

              <button 
                (click)="selectedCategory.set('dossier')"
                [class.bg-profe-purple]="selectedCategory() === 'dossier'"
                [class.text-white]="selectedCategory() === 'dossier'"
                [class.bg-[#EDE9FF]]="selectedCategory() !== 'dossier'"
                [class.text-profe-purple-dark]="selectedCategory() !== 'dossier'"
                class="px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-xs">
                📄 Dossiers ({{ getCountByCategory('dossier') }})
              </button>

              <button 
                (click)="selectedCategory.set('biblioteca')"
                [class.bg-profe-purple]="selectedCategory() === 'biblioteca'"
                [class.text-white]="selectedCategory() === 'biblioteca'"
                [class.bg-[#EDE9FF]]="selectedCategory() !== 'biblioteca'"
                [class.text-profe-purple-dark]="selectedCategory() !== 'biblioteca'"
                class="px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-xs">
                📖 Biblioteca ({{ getCountByCategory('biblioteca') }})
              </button>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="relative w-full md:w-72">
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery"
                  placeholder="Buscar producto..."
                  class="w-full bg-white border-2 border-profe-purple-light focus:border-profe-purple rounded-2xl px-4 py-2 text-xs font-bold text-profe-text focus:outline-none transition-colors pl-9 shadow-inner">
                <span class="absolute left-3 top-2.5 text-profe-muted text-xs">🔍</span>
              </div>
            </div>

          </div>

          <!-- Product Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (product of filteredProducts; track product.id) {
              <div class="bg-white border-2 border-profe-purple-light/70 hover:border-profe-purple rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-3xl group-hover:scale-110 transition-transform">{{ product.emoji }}</span>
                    <span class="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EDE9FF] text-profe-purple-dark">
                      {{ product.categoryLabel }}
                    </span>
                  </div>

                  <h3 class="font-black text-base text-profe-purple-dark leading-snug mb-1">
                    {{ product.name }}
                  </h3>

                  <p class="text-xs font-semibold text-profe-muted leading-relaxed mb-4 line-clamp-2">
                    {{ product.description }}
                  </p>

                  <div class="bg-[#FDF5FF] border border-profe-purple-light/60 rounded-2xl p-3 mb-4 space-y-2 text-xs">
                    
                    <div class="flex items-center justify-between">
                      <span class="font-extrabold text-[11px] text-profe-muted">Recursos Incluidos:</span>
                      <div class="flex items-center gap-1.5">
                        <span *ngIf="(product.digitalUrls?.length || 0) > 0 || product.digitalUrl" class="bg-profe-purple text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                          🤖 {{ product.digitalUrls?.length || (product.digitalUrl ? 1 : 0) }} GPT(s)
                        </span>
                        <span *ngIf="(product.attachments?.length || 0) > 0 || product.attachmentPath" class="bg-profe-pink text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                          📎 {{ product.attachments?.length || (product.attachmentPath ? 1 : 0) }} Adjunto(s)
                        </span>
                      </div>
                    </div>

                    <div *ngIf="(product.digitalUrls?.length || 0) > 0 || product.digitalUrl" class="truncate text-[11px] text-profe-purple font-bold">
                      🤖 {{ product.digitalUrls?.length || 1 }} enlace(s) a Custom GPT
                    </div>

                    <div *ngIf="(product.attachments?.length || 0) > 0 || product.attachmentPath" class="truncate text-[11px] text-profe-pink-dark font-bold">
                      📎 {{ product.attachments?.length || 1 }} archivo(s) PDF/Word adjunto(s)
                    </div>

                  </div>
                </div>

                <div class="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                    <span class="block text-[10px] font-bold text-profe-muted uppercase">Precio Actual</span>
                    <span class="text-lg font-black text-profe-purple">
                      {{ product.priceCLP | clpCurrency }}
                    </span>
                  </div>

                  <button 
                    (click)="openEditModal(product)"
                    class="bg-profe-purple hover:bg-profe-purple-dark text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95">
                    <span>✏️</span>
                    <span>Editar Paquete</span>
                  </button>
                </div>

              </div>
            }
          </div>

        </div>

        <!-- ========================================================================================= -->
        <!-- PESTAÑA 2: MANTENEDOR DE DOCUMENTOS PRIVADOS (CRUD & ZOOM/GRILLA)                         -->
        <!-- ========================================================================================= -->
        <div *ngIf="activeTab() === 'documents'">
          
          <!-- Banner Superior del Mantenedor -->
          <div class="mb-8 bg-gradient-to-r from-[#EDE9FF] via-[#F8F5FF] to-[#EDE9FF] border-2 border-profe-purple-light/70 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span class="text-profe-purple font-black text-xs uppercase tracking-widest block mb-1">
                \ \ Bóveda Privada Backend / /
              </span>
              <h1 class="text-2xl sm:text-3xl font-black text-profe-purple-dark">
                Mantenedor de Documentos Protegidos
              </h1>
              <p class="text-xs sm:text-sm font-semibold text-profe-muted mt-1">
                Gestiona los archivos físicos (PDF/Word/Docs) alojados en <code>netlify/functions/assets/documents/</code>.
              </p>
            </div>

            <div class="flex items-center gap-3 bg-white p-2 rounded-2xl border border-profe-purple-light shadow-xs">
              
              <!-- Toggle Vista Grilla / Lista -->
              <div class="flex items-center bg-gray-100 p-1 rounded-xl">
                <button 
                  (click)="documentViewMode.set('grid')"
                  [class.bg-profe-purple]="documentViewMode() === 'grid'"
                  [class.text-white]="documentViewMode() === 'grid'"
                  [class.text-gray-600]="documentViewMode() !== 'grid'"
                  class="px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1">
                  <span>🔲</span> <span>Grilla</span>
                </button>

                <button 
                  (click)="documentViewMode.set('list')"
                  [class.bg-profe-purple]="documentViewMode() === 'list'"
                  [class.text-white]="documentViewMode() === 'list'"
                  [class.text-gray-600]="documentViewMode() !== 'list'"
                  class="px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1">
                  <span>≡</span> <span>Lista</span>
                </button>
              </div>

              <!-- Control de Zoom / Tamaños si está en modo Grilla -->
              <div *ngIf="documentViewMode() === 'grid'" class="flex items-center gap-1 border-l border-gray-200 pl-2">
                <span class="text-[10px] font-bold text-gray-500 uppercase">Zoom:</span>
                <button 
                  (click)="documentGridSize.set('sm')"
                  [class.bg-profe-purple-light]="documentGridSize() === 'sm'"
                  class="w-7 h-7 rounded-lg text-xs font-bold text-profe-purple hover:bg-profe-purple-light">
                  S
                </button>
                <button 
                  (click)="documentGridSize.set('md')"
                  [class.bg-profe-purple-light]="documentGridSize() === 'md'"
                  class="w-7 h-7 rounded-lg text-xs font-bold text-profe-purple hover:bg-profe-purple-light">
                  M
                </button>
                <button 
                  (click)="documentGridSize.set('lg')"
                  [class.bg-profe-purple-light]="documentGridSize() === 'lg'"
                  class="w-7 h-7 rounded-lg text-xs font-bold text-profe-purple hover:bg-profe-purple-light">
                  L
                </button>
              </div>

            </div>
          </div>

          <!-- Barra de Búsqueda de Documentos -->
          <div class="bg-white/95 backdrop-blur-md border-2 border-profe-purple-light/70 p-4 rounded-3xl shadow-sm mb-6 flex items-center justify-between gap-4">
            <div class="relative w-full md:w-80">
              <input 
                type="text" 
                [(ngModel)]="documentSearchQuery"
                placeholder="Buscar documento por nombre o archivo..."
                class="w-full bg-white border-2 border-profe-purple-light focus:border-profe-purple rounded-2xl px-4 py-2 text-xs font-bold text-profe-text focus:outline-none transition-colors pl-9 shadow-inner">
              <span class="absolute left-3 top-2.5 text-profe-muted text-xs">🔍</span>
            </div>

            <span class="text-xs font-black text-profe-purple">
              Mostrando {{ filteredDocuments.length }} documento(s)
            </span>
          </div>

          <!-- VISTA GRILLA DE DOCUMENTOS -->
          <div 
            *ngIf="documentViewMode() === 'grid'"
            class="grid gap-6"
            [class.grid-cols-2]="documentGridSize() === 'lg'"
            [class.grid-cols-3]="documentGridSize() === 'md'"
            [class.grid-cols-4]="documentGridSize() === 'sm'"
            [class.lg:grid-cols-4]="documentGridSize() === 'md'"
            [class.lg:grid-cols-5]="documentGridSize() === 'sm'">
            
            @for (doc of filteredDocuments; track doc.id) {
              <div class="bg-white border-2 border-profe-purple-light/70 hover:border-profe-purple rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative">
                
                <div>
                  <!-- Icono de Formato -->
                  <div class="w-12 h-12 rounded-2xl bg-[#FDF5FF] border border-profe-purple-light flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                    {{ doc.fileName.endsWith('.pdf') ? '📄' : '📝' }}
                  </div>

                  <h3 class="font-black text-sm text-profe-purple-dark leading-snug line-clamp-2 mb-1">
                    {{ doc.displayName || doc.fileName }}
                  </h3>

                  <code class="text-[10px] text-profe-muted bg-gray-50 px-2 py-0.5 rounded block truncate mb-3">
                    {{ doc.fileName }}
                  </code>

                  <div class="space-y-1 text-[11px] font-semibold text-profe-muted">
                    <div class="flex items-center justify-between">
                      <span>Tamaño:</span>
                      <span class="font-bold text-profe-text">{{ (doc.sizeBytes / 1024 / 1024) | number:'1.2-2' }} MB</span>
                    </div>

                    <div class="flex items-center justify-between">
                      <span>Uso en productos:</span>
                      <span 
                        [class.bg-green-100]="doc.assignedProductsCount === 0"
                        [class.text-green-800]="doc.assignedProductsCount === 0"
                        [class.bg-profe-pink-light]="doc.assignedProductsCount > 0"
                        [class.text-profe-pink-dark]="doc.assignedProductsCount > 0"
                        class="px-2 py-0.5 rounded-full font-black text-[10px]">
                        {{ doc.assignedProductsCount === 0 ? 'Sin asignar' : doc.assignedProductsCount + ' producto(s)' }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-4">
                  <button 
                    (click)="openDocumentPreviewModal(doc)"
                    class="bg-[#EDE9FF] hover:bg-profe-purple hover:text-white text-profe-purple-dark font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1">
                    <span>👁️</span> <span>Ver</span>
                  </button>

                  <button 
                    (click)="deleteDocument(doc)"
                    class="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1">
                    <span>🗑️</span> <span>Eliminar</span>
                  </button>
                </div>

              </div>
            }
          </div>

          <!-- VISTA LISTA / TABLA DE DOCUMENTOS -->
          <div *ngIf="documentViewMode() === 'list'" class="bg-white rounded-3xl border-2 border-profe-purple-light/70 overflow-hidden shadow-sm">
            <table class="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr class="bg-[#EDE9FF] text-profe-purple-dark font-black uppercase text-[10px] tracking-wider border-b border-profe-purple-light">
                  <th class="py-3.5 px-4">Tipo</th>
                  <th class="py-3.5 px-4">Nombre del Documento</th>
                  <th class="py-3.5 px-4">Nombre Archivo (Backend)</th>
                  <th class="py-3.5 px-4">Tamaño</th>
                  <th class="py-3.5 px-4">Asignaciones</th>
                  <th class="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (doc of filteredDocuments; track doc.id) {
                  <tr class="hover:bg-[#FDF5FF] transition-colors">
                    <td class="py-3 px-4 text-lg">
                      {{ doc.fileName.endsWith('.pdf') ? '📄' : '📝' }}
                    </td>
                    <td class="py-3 px-4 font-black text-profe-purple-dark">
                      {{ doc.displayName || doc.fileName }}
                    </td>
                    <td class="py-3 px-4">
                      <code class="bg-gray-100 px-2 py-0.5 rounded text-[11px] text-gray-700">{{ doc.fileName }}</code>
                    </td>
                    <td class="py-3 px-4 font-bold text-gray-600">
                      {{ (doc.sizeBytes / 1024 / 1024) | number:'1.2-2' }} MB
                    </td>
                    <td class="py-3 px-4">
                      <span 
                        [class.bg-green-100]="doc.assignedProductsCount === 0"
                        [class.text-green-800]="doc.assignedProductsCount === 0"
                        [class.bg-profe-pink-light]="doc.assignedProductsCount > 0"
                        [class.text-profe-pink-dark]="doc.assignedProductsCount > 0"
                        class="px-2.5 py-1 rounded-full font-black text-[10px]">
                        {{ doc.assignedProductsCount === 0 ? 'Sin asignar' : doc.assignedProductsCount + ' producto(s)' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button 
                          (click)="openDocumentPreviewModal(doc)"
                          class="bg-[#EDE9FF] hover:bg-profe-purple hover:text-white text-profe-purple-dark font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1">
                          <span>👁️</span> <span>Previsualizar</span>
                        </button>
                        <button 
                          (click)="deleteDocument(doc)"
                          class="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all">
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

        </div>

      </main>

      <!-- ========================================================================================= -->
      <!-- MODAL EXTENDIDO: GALERÍA DE SELECCIÓN DE DOCUMENTOS PARA PRODUCTOS                        -->
      <!-- ========================================================================================= -->
      <div *ngIf="isDocumentPickerOpen()" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl border-2 border-profe-purple shadow-2xl max-w-5xl w-full p-6 sm:p-8 max-h-[92vh] flex flex-col justify-between relative overflow-hidden">
          
          <!-- Header del Selector Galería -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
            <div class="flex items-center gap-3">
              <span class="text-3xl">📂</span>
              <div>
                <h2 class="text-xl font-black text-profe-purple-dark">Biblioteca de Documentos Privados</h2>
                <span class="text-xs font-semibold text-profe-muted">Selecciona un archivo PDF/Word de la bóveda para adjuntar al producto</span>
              </div>
            </div>

            <!-- Controles de Vista & Zoom -->
            <div class="flex items-center gap-3">
              
              <div class="flex items-center bg-gray-100 p-1 rounded-xl">
                <button 
                  (click)="pickerViewMode.set('grid')"
                  [class.bg-profe-purple]="pickerViewMode() === 'grid'"
                  [class.text-white]="pickerViewMode() === 'grid'"
                  class="px-3 py-1 rounded-lg text-xs font-black transition-all">
                  🔲 Grilla
                </button>
                <button 
                  (click)="pickerViewMode.set('list')"
                  [class.bg-profe-purple]="pickerViewMode() === 'list'"
                  [class.text-white]="pickerViewMode() === 'list'"
                  class="px-3 py-1 rounded-lg text-xs font-black transition-all">
                  ≡ Lista
                </button>
              </div>

              <div *ngIf="pickerViewMode() === 'grid'" class="flex items-center gap-1 border-l border-gray-200 pl-2">
                <span class="text-[10px] font-bold text-gray-500">Zoom:</span>
                <button (click)="pickerGridSize.set('sm')" [class.bg-profe-purple-light]="pickerGridSize() === 'sm'" class="w-6 h-6 rounded text-xs font-bold text-profe-purple">S</button>
                <button (click)="pickerGridSize.set('md')" [class.bg-profe-purple-light]="pickerGridSize() === 'md'" class="w-6 h-6 rounded text-xs font-bold text-profe-purple">M</button>
                <button (click)="pickerGridSize.set('lg')" [class.bg-profe-purple-light]="pickerGridSize() === 'lg'" class="w-6 h-6 rounded text-xs font-bold text-profe-purple">L</button>
              </div>

              <button (click)="isDocumentPickerOpen.set(false)" class="text-gray-400 hover:text-profe-pink text-xl font-black p-1 ml-2">✕</button>
            </div>
          </div>

          <!-- Buscador en Selector -->
          <div class="py-3 border-b border-gray-100 shrink-0">
            <div class="relative w-full">
              <input 
                type="text" 
                [(ngModel)]="pickerSearchQuery" 
                placeholder="Buscar documento en la biblioteca..." 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold pl-9">
              <span class="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
            </div>
          </div>

          <!-- Cuerpo Principal: Grid/Lista + Panel de Previsualización -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 overflow-y-auto flex-1">
            
            <!-- Lista / Grilla de Selección (Columna Izquierda 2 cols) -->
            <div class="md:col-span-2 space-y-4">
              
              <!-- Vista Grilla -->
              <div 
                *ngIf="pickerViewMode() === 'grid'"
                class="grid gap-4"
                [class.grid-cols-1]="pickerGridSize() === 'lg'"
                [class.grid-cols-2]="pickerGridSize() === 'md'"
                [class.grid-cols-3]="pickerGridSize() === 'sm'">
                
                @for (doc of filteredPickerDocuments; track doc.id) {
                  <div 
                    (click)="selectedDocForPicker.set(doc)"
                    [class.border-profe-purple]="selectedDocForPicker()?.id === doc.id"
                    [class.bg-[#FDF5FF]]="selectedDocForPicker()?.id === doc.id"
                    class="border-2 border-gray-100 hover:border-profe-purple rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group relative">
                    
                    <div>
                      <div class="text-2xl mb-2">{{ doc.fileName.endsWith('.pdf') ? '📄' : '📝' }}</div>
                      <h4 class="font-black text-xs text-profe-purple-dark line-clamp-2 mb-1">{{ doc.displayName || doc.fileName }}</h4>
                      <code class="text-[9px] text-gray-500 block truncate">{{ doc.fileName }}</code>
                    </div>

                    <div class="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-500">
                      <span>{{ (doc.sizeBytes / 1024 / 1024) | number:'1.2-2' }} MB</span>
                      <span [class.text-green-600]="selectedDocForPicker()?.id === doc.id">
                        {{ selectedDocForPicker()?.id === doc.id ? '✓ Seleccionado' : 'Elegir' }}
                      </span>
                    </div>
                  </div>
                }
              </div>

              <!-- Vista Lista -->
              <div *ngIf="pickerViewMode() === 'list'" class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table class="w-full text-left text-xs font-semibold">
                  <tbody class="divide-y divide-gray-100">
                    @for (doc of filteredPickerDocuments; track doc.id) {
                      <tr 
                        (click)="selectedDocForPicker.set(doc)"
                        [class.bg-[#FDF5FF]]="selectedDocForPicker()?.id === doc.id"
                        class="hover:bg-gray-50 cursor-pointer transition-colors">
                        <td class="py-2.5 px-3 text-base">{{ doc.fileName.endsWith('.pdf') ? '📄' : '📝' }}</td>
                        <td class="py-2.5 px-3 font-black text-profe-purple-dark">{{ doc.displayName }}</td>
                        <td class="py-2.5 px-3 text-gray-500 font-mono text-[10px]">{{ doc.fileName }}</td>
                        <td class="py-2.5 px-3 font-bold text-gray-500">{{ (doc.sizeBytes / 1024 / 1024) | number:'1.2-2' }} MB</td>
                        <td class="py-2.5 px-3 text-right">
                          <button class="bg-profe-purple hover:bg-profe-purple-dark text-white font-extrabold text-[10px] px-3 py-1 rounded-lg">
                            Elegir
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

            </div>

            <!-- Panel Lateral de Previsualización (Columna Derecha) -->
            <div class="bg-[#FDF5FF] border-2 border-profe-purple-light rounded-3xl p-5 flex flex-col justify-between h-full relative">
              
              <div *ngIf="selectedDocForPicker()" class="space-y-4">
                <div class="text-center py-4 border-b border-profe-purple-light relative">
                  <!-- Botón Ojo de Previsualización Completa -->
                  <button 
                    type="button"
                    (click)="openDocumentPreviewModal(selectedDocForPicker()!)"
                    class="absolute right-0 top-0 bg-white hover:bg-profe-purple hover:text-white border border-profe-purple-light text-profe-purple font-black p-2 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1"
                    title="Abrir Previsualización Completa del Documento">
                    <span>👁️</span> <span class="text-[10px]">Ver PDF/Doc</span>
                  </button>

                  <div class="w-16 h-16 bg-white rounded-2xl border border-profe-purple-light flex items-center justify-center text-4xl mx-auto mb-2 shadow-xs">
                    {{ selectedDocForPicker()?.fileName?.endsWith('.pdf') ? '📄' : '📝' }}
                  </div>
                  <h3 class="font-black text-sm text-profe-purple-dark leading-snug">{{ selectedDocForPicker()?.displayName }}</h3>
                  <code class="text-[10px] text-profe-muted font-bold block mt-1 truncate">{{ selectedDocForPicker()?.fileName }}</code>
                </div>

                <div class="space-y-2 text-xs font-semibold text-profe-muted">
                  <div class="flex items-center justify-between gap-2">
                    <span class="shrink-0 font-bold">Formato:</span>
                    <span class="font-black text-profe-purple uppercase text-[11px] truncate text-right">
                      {{ formatMimeType(selectedDocForPicker()?.mimeType, selectedDocForPicker()?.fileName) }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="shrink-0 font-bold">Tamaño:</span>
                    <span class="font-black text-profe-purple">{{ ((selectedDocForPicker()?.sizeBytes || 0) / 1024 / 1024) | number:'1.2-2' }} MB</span>
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="shrink-0 font-bold">Ruta en Servidor:</span>
                    <code class="text-[10px] bg-white px-1.5 py-0.5 rounded text-profe-purple-dark font-bold truncate max-w-[160px]" [title]="selectedDocForPicker()?.path">{{ selectedDocForPicker()?.path }}</code>
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="shrink-0 font-bold">Productos Asignados:</span>
                    <span class="font-black text-profe-pink">{{ selectedDocForPicker()?.assignedProductsCount || 0 }}</span>
                  </div>
                </div>

                <div class="bg-white p-3 rounded-2xl border border-profe-purple-light/80 text-[11px] space-y-1">
                  <span class="font-extrabold text-profe-purple-dark block">📌 Vista Previa de Asignación:</span>
                  <p class="text-profe-muted text-[10px]">
                    Al confirmar, este archivo se vinculará como adjunto al producto en edición y se enviará en los correos de compra.
                  </p>
                </div>
              </div>

              <div *ngIf="!selectedDocForPicker()" class="text-center py-12 text-profe-muted text-xs font-semibold">
                👈 Haz clic en cualquier documento para previsualizar sus detalles.
              </div>

              <div *ngIf="selectedDocForPicker()" class="flex items-center gap-2 mt-4">
                <button 
                  type="button"
                  (click)="openDocumentPreviewModal(selectedDocForPicker()!)"
                  class="bg-white hover:bg-profe-purple hover:text-white border border-profe-purple-light text-profe-purple-dark font-extrabold text-xs px-3.5 py-3 rounded-2xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                  title="Abrir vista previa del archivo">
                  <span>👁️</span>
                  <span>Ver Documento</span>
                </button>

                <button 
                  (click)="confirmDocumentSelection()"
                  class="flex-1 bg-profe-purple hover:bg-profe-purple-dark text-white font-black text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
                  <span>✅ Confirmar y Asignar</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      <!-- ========================================================================================= -->
      <!-- MODAL VISOR COMPLETO DE DOCUMENTOS (PREVISUALIZADOR CON OJO)                              -->
      <!-- ========================================================================================= -->
      <div *ngIf="isDocumentViewerModalOpen()" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl border-2 border-profe-purple shadow-2xl max-w-4xl w-full p-6 max-h-[92vh] flex flex-col justify-between relative overflow-hidden">
          
          <!-- Header Visor -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ previewingDoc()?.fileName?.endsWith('.pdf') ? '📄' : '📝' }}</span>
              <div>
                <h3 class="text-lg font-black text-profe-purple-dark">{{ previewingDoc()?.displayName }}</h3>
                <span class="text-xs font-bold text-profe-muted">
                  Visor Previo • {{ previewingDoc()?.fileName }} • {{ formatMimeType(previewingDoc()?.mimeType, previewingDoc()?.fileName) }}
                </span>
              </div>
            </div>

            <button (click)="isDocumentViewerModalOpen.set(false)" class="bg-gray-100 hover:bg-profe-pink hover:text-white text-gray-500 font-black text-xs px-3.5 py-2 rounded-xl transition-all">
              ✕ Cerrar Previsualización
            </button>
          </div>

          <!-- Contenido del Visor -->
          <div class="py-4 flex-1 overflow-y-auto min-h-[450px] flex flex-col items-center justify-center">
            
            <!-- Si es PDF, embeber visor -->
            <div *ngIf="previewingDoc()?.fileName?.endsWith('.pdf')" class="w-full h-full min-h-[480px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              <iframe [src]="getSafeDocumentUrl(previewingDoc()?.path)" class="w-full h-full min-h-[480px] border-0"></iframe>
            </div>

            <!-- Si es Word / Docx, mostrar visor interactivo de documento -->
            <div *ngIf="!previewingDoc()?.fileName?.endsWith('.pdf')" class="w-full bg-[#FDF5FF] border-2 border-profe-purple-light rounded-3xl p-6 space-y-6 text-center">
              <div class="w-20 h-20 bg-white rounded-3xl border border-profe-purple-light flex items-center justify-center text-5xl mx-auto shadow-sm">
                📝
              </div>

              <div>
                <h4 class="text-xl font-black text-profe-purple-dark">{{ previewingDoc()?.displayName }}</h4>
                <p class="text-xs font-semibold text-profe-muted mt-1">
                  Documento de Microsoft Word alojado en la Bóveda Privada
                </p>
              </div>

              <div class="max-w-md mx-auto bg-white p-4 rounded-2xl border border-profe-purple-light space-y-2 text-xs font-semibold text-left">
                <div class="flex justify-between">
                  <span class="text-gray-500">Nombre de Archivo:</span>
                  <code class="font-bold text-profe-purple">{{ previewingDoc()?.fileName }}</code>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Tamaño del Archivo:</span>
                  <span class="font-bold text-profe-purple">{{ ((previewingDoc()?.sizeBytes || 0) / 1024 / 1024) | number:'1.2-2' }} MB</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Formato:</span>
                  <span class="font-bold text-profe-purple uppercase">{{ formatMimeType(previewingDoc()?.mimeType, previewingDoc()?.fileName) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Ubicación Privada:</span>
                  <code class="font-bold text-profe-pink">{{ previewingDoc()?.path }}</code>
                </div>
              </div>

              <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-bold text-amber-900 max-w-md mx-auto flex items-center gap-3 text-left">
                <span class="text-2xl shrink-0">🔒</span>
                <span>
                  Este archivo Word se encuentra cifrado en la carpeta privada del backend y se despachará adjunto directamente en los correos tras la compra.
                </span>
              </div>
            </div>

          </div>

          <!-- Footer Visor -->
          <div class="pt-3 border-t border-gray-100 flex items-center justify-between shrink-0">
            <span class="text-xs font-bold text-profe-muted">
              Bóveda Privada Backend • La Profe GPT
            </span>

            <button (click)="isDocumentViewerModalOpen.set(false)" class="bg-profe-purple text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs hover:bg-profe-purple-dark">
              Cerrar Visor
            </button>
          </div>

        </div>
      </div>

      <!-- MODAL DE CREACIÓN / EDICIÓN DE PRODUCTO -->
      <div *ngIf="isModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl border-2 border-profe-purple shadow-2xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
          
          <div class="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ editForm.emoji || '📚' }}</span>
              <div>
                <h2 class="text-lg font-black text-profe-purple-dark">
                  {{ isNewProduct() ? '➕ Crear Nuevo Producto' : '✏️ Editar Paquete de Producto' }}
                </h2>
                <span class="text-xs font-bold text-profe-muted">
                  {{ isNewProduct() ? 'Define el ID público y los accesos digitales' : 'ID: ' + editForm.id }}
                </span>
              </div>
            </div>

            <button (click)="closeModal()" class="text-profe-muted hover:text-profe-pink text-lg font-black p-1">✕</button>
          </div>

          <form (ngSubmit)="saveProduct()" class="space-y-4 text-xs font-bold">
            
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-2">
                <label class="block text-profe-purple-dark font-black mb-1">Nombre del Producto</label>
                <input type="text" [(ngModel)]="editForm.name" name="name" required placeholder="Ej: Asistente ECEP Historia 2026" class="w-full border-2 border-profe-purple-light focus:border-profe-purple rounded-xl px-3 py-2 text-xs font-extrabold text-profe-text">
              </div>

              <div>
                <label class="block text-profe-purple-dark font-black mb-1">Emoji Icono</label>
                <input type="text" [(ngModel)]="editForm.emoji" name="emoji" placeholder="📚" class="w-full border-2 border-profe-purple-light focus:border-profe-purple rounded-xl px-3 py-2 text-xs text-center font-black text-lg">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-profe-purple-dark font-black mb-1">ID Único (Autoincremental)</label>
                <input type="text" [(ngModel)]="editForm.id" name="id" readonly required class="w-full border-2 border-profe-purple-light rounded-xl px-3 py-2 text-xs font-black text-profe-purple bg-gray-100 cursor-not-allowed">
                
                <span class="text-profe-purple font-extrabold text-[10px] block mt-1">
                  ⚡ Asignado automáticamente: <code class="bg-[#EDE9FF] px-1.5 py-0.5 rounded">{{ editForm.id }}</code>
                </span>
              </div>

              <div>
                <label class="block text-profe-purple-dark font-black mb-1">Categoría</label>
                <select [(ngModel)]="editForm.category" name="category" (change)="onCategoryChange()" class="w-full border-2 border-profe-purple-light focus:border-profe-purple rounded-xl px-3 py-2 text-xs font-extrabold">
                  <option value="portafolio">📚 Portafolio Docente</option>
                  <option value="ecep">🎓 Asistente ECEP</option>
                  <option value="dossier">📄 Dossier Pruebas</option>
                  <option value="biblioteca">📖 Biblioteca</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-profe-purple-dark font-black mb-1">Precio ($ CLP)</label>
                <input type="number" [(ngModel)]="editForm.priceCLP" name="priceCLP" required class="w-full border-2 border-profe-purple-light focus:border-profe-purple rounded-xl px-3 py-2 text-xs font-black text-profe-purple">
              </div>

              <div>
                <label class="block text-profe-purple-dark font-black mb-1">Etiqueta de Categoría</label>
                <input type="text" [(ngModel)]="editForm.categoryLabel" name="categoryLabel" placeholder="Ej: Dossier PDF 2026" class="w-full border-2 border-profe-purple-light focus:border-profe-purple rounded-xl px-3 py-2 text-xs font-extrabold">
              </div>
            </div>

            <div>
              <label class="block text-profe-purple-dark font-black mb-1">Descripción del Producto</label>
              <textarea [(ngModel)]="editForm.description" name="description" rows="2" placeholder="Descripción detallada del recurso..." class="w-full border-2 border-profe-purple-light focus:border-profe-purple rounded-xl p-3 text-xs font-semibold"></textarea>
            </div>

            <!-- Recursos Digitales Incluidos (Múltiples GPTs y Adjuntos) -->
            <div class="space-y-4 pt-2 border-t border-gray-100">
              <span class="block text-xs font-black uppercase tracking-wider text-profe-pink">
                ⚙️ Configuración de Entrega por Correo (Bóveda Privada)
              </span>

              <!-- 1. Custom GPT URLs (Múltiples) -->
              <div class="bg-[#FDF5FF] p-4 rounded-2xl border border-profe-purple-light space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-profe-purple-dark font-black text-xs">
                    🤖 Asistentes Custom GPT (URLs)
                  </label>
                  <button 
                    type="button" 
                    (click)="addGptUrl()" 
                    class="bg-profe-purple hover:bg-profe-purple-dark text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1">
                    <span>➕ Agregar URL de GPT</span>
                  </button>
                </div>

                <div *ngIf="!editForm.digitalUrls || editForm.digitalUrls.length === 0" class="text-[11px] text-profe-muted italic">
                  No se han agregado URLs de ChatGPT aún. Haz clic en "Agregar URL de GPT".
                </div>

                <div *ngFor="let url of editForm.digitalUrls; let i = index; trackBy: trackByIndex" class="flex items-center gap-2">
                  <span class="text-profe-purple font-extrabold text-xs shrink-0">#{{ i + 1 }}</span>
                  <input 
                    type="text" 
                    [(ngModel)]="editForm.digitalUrls![i]" 
                    [name]="'digitalUrl_' + i" 
                    placeholder="https://chatgpt.com/g/g-..." 
                    class="w-full border-2 border-profe-purple-light focus:border-profe-purple rounded-xl px-3 py-2 text-xs font-bold">
                  <button 
                    type="button" 
                    (click)="removeGptUrl(i)" 
                    class="text-red-500 hover:text-red-700 font-bold p-2 hover:bg-red-50 rounded-xl shrink-0 text-sm" 
                    title="Eliminar esta URL">
                    🗑️
                  </button>
                </div>
              </div>

              <!-- 2. Direct File Attachments (Múltiples con Selector de Biblioteca) -->
              <div class="bg-[#FFF0F3] p-4 rounded-2xl border border-profe-pink-light space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-profe-pink-dark font-black text-xs">
                    📎 Archivos Adjuntos Directos (PDF / Word / Docs)
                  </label>
                  
                  <div class="flex items-center gap-2">
                    <button 
                      type="button" 
                      (click)="openDocumentPickerModal()" 
                      class="bg-profe-purple hover:bg-profe-purple-dark text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1">
                      <span>📂 Seleccionar desde Biblioteca</span>
                    </button>

                    <button 
                      type="button" 
                      (click)="addAttachment()" 
                      class="bg-profe-pink hover:bg-profe-pink-dark text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1">
                      <span>➕ Manual</span>
                    </button>
                  </div>
                </div>

                <div *ngIf="!editForm.attachments || editForm.attachments.length === 0" class="text-[11px] text-profe-muted italic">
                  No se han agregado archivos adjuntos aún. Haz clic en "Seleccionar desde Biblioteca" o "Manual".
                </div>

                <div *ngFor="let att of editForm.attachments; let i = index; trackBy: trackByIndex" class="p-3 bg-white rounded-2xl border border-profe-pink-light space-y-2 relative">
                  <div class="flex items-center justify-between">
                    <span class="text-profe-pink-dark font-extrabold text-[11px]">Archivo #{{ i + 1 }}</span>
                    <button 
                      type="button" 
                      (click)="removeAttachment(i)" 
                      class="text-red-500 hover:text-red-700 font-bold px-2 py-1 text-xs hover:bg-red-50 rounded-lg flex items-center gap-1" 
                      title="Eliminar este archivo">
                      <span>🗑️</span> <span>Eliminar</span>
                    </button>
                  </div>

                  <div>
                    <label class="block text-gray-600 text-[10px] font-bold mb-0.5">Ruta del Archivo Privado (Carpeta Backend)</label>
                    <input 
                      type="text" 
                      [(ngModel)]="att.path" 
                      [name]="'attPath_' + i" 
                      placeholder="assets/documents/dossier-demo.pdf" 
                      class="w-full border-2 border-profe-pink-light focus:border-profe-pink rounded-xl px-3 py-1.5 text-xs font-bold">
                  </div>

                  <div>
                    <label class="block text-gray-600 text-[10px] font-bold mb-0.5">Nombre para Mostrar al Adjuntar en Correo</label>
                    <input 
                      type="text" 
                      [(ngModel)]="att.fileName" 
                      [name]="'attName_' + i" 
                      placeholder="Ej: Dossier_ECEP_Historia_2026.pdf" 
                      class="w-full border-2 border-profe-pink-light focus:border-profe-pink rounded-xl px-3 py-1.5 text-xs font-bold">
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button type="button" (click)="closeModal()" class="bg-gray-100 text-gray-700 font-bold px-4 py-2.5 rounded-xl hover:bg-gray-200">
                Cancelar
              </button>

              <button 
                type="submit" 
                [disabled]="isSaving()"
                class="bg-profe-purple hover:bg-profe-purple-dark text-white font-black px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2">
                <span *ngIf="isSaving()">⏳</span>
                <span>{{ isSaving() ? 'Guardando...' : (isNewProduct() ? 'Crear Producto →' : 'Guardar Cambios →') }}</span>
              </button>
            </div>

          </form>

        </div>
      </div>

      <!-- MODAL DE SUBIDA DE DOCUMENTOS EN MANTENEDOR -->
      <div *ngIf="isUploadDocModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl border-2 border-profe-purple shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
          
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h3 class="text-lg font-black text-profe-purple-dark flex items-center gap-2">
              <span>📤</span> <span>Subir Archivo a la Bóveda Privada</span>
            </h3>
            <button (click)="isUploadDocModalOpen.set(false)" class="text-gray-400 hover:text-profe-pink font-bold">✕</button>
          </div>

          <form (ngSubmit)="submitUploadDoc()" class="space-y-4 text-xs font-bold">
            
            <!-- Selector de Archivo Físico -->
            <div class="bg-[#FDF5FF] border-2 border-dashed border-profe-purple-light p-5 rounded-2xl text-center space-y-2 cursor-pointer hover:bg-[#F6E6FF] transition-colors relative group">
              <input 
                type="file" 
                (change)="onFileSelected($event)" 
                accept=".pdf,.docx,.doc,.txt" 
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
              
              <div class="w-12 h-12 bg-white rounded-2xl border border-profe-purple-light flex items-center justify-center text-2xl mx-auto shadow-xs group-hover:scale-110 transition-transform">
                📂
              </div>

              <div>
                <span class="block font-black text-profe-purple-dark text-xs truncate px-2">
                  {{ selectedFileName() ? selectedFileName() : 'Selecciona un archivo PDF o Word' }}
                </span>
                <span class="text-[10px] text-profe-muted font-semibold block mt-0.5">
                  Haz clic aquí para examinar archivos en tu equipo (.pdf, .docx, .doc)
                </span>
              </div>
            </div>

            <div>
              <label class="block text-profe-purple-dark font-black mb-1">Nombre Descriptivo (Visual)</label>
              <input type="text" [(ngModel)]="uploadDocForm.displayName" name="displayName" required placeholder="Ej: Dossier Historia 2026" class="w-full border-2 border-profe-purple-light focus:border-profe-purple rounded-xl px-3 py-2 text-xs font-extrabold">
            </div>

            <div>
              <label class="block text-profe-purple-dark font-black mb-1">Nombre de Archivo a Guardar en Backend</label>
              <input type="text" [(ngModel)]="uploadDocForm.fileName" name="fileName" required placeholder="dossier-historia-2026.pdf" class="w-full border-2 border-profe-purple-light focus:border-profe-purple rounded-xl px-3 py-2 text-xs font-extrabold">
            </div>

            <div class="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
              <button type="button" (click)="isUploadDocModalOpen.set(false)" class="bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-xl hover:bg-gray-200">Cancelar</button>
              <button 
                type="submit" 
                [disabled]="isUploadingDoc() || !uploadDocForm.fileName"
                class="bg-profe-purple hover:bg-profe-purple-dark text-white font-black px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50">
                <span *ngIf="isUploadingDoc()">⏳</span>
                <span>{{ isUploadingDoc() ? 'Subiendo...' : '📤 Guardar en Bóveda →' }}</span>
              </button>
            </div>
          </form>

        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  public currentUser = this.adminService.currentUser;
  
  // Navigation & Data signals
  public activeTab = signal<'products' | 'documents'>('products');
  public products = signal<AdminProduct[]>([]);
  public documents = signal<DocumentAsset[]>([]);
  public selectedCategory = signal<CategoryFilter>('all');
  
  public searchQuery = '';
  public documentSearchQuery = '';
  public pickerSearchQuery = '';
  public toastMessage = signal<string>('');

  // Mantenedor Controls
  public documentViewMode = signal<'grid' | 'list'>('grid');
  public documentGridSize = signal<'sm' | 'md' | 'lg'>('md');
  public deleteWarningAlert = signal<{ fileName: string; productNames: string[] } | null>(null);

  // Document Picker Modal Controls
  public isDocumentPickerOpen = signal<boolean>(false);
  public pickerViewMode = signal<'grid' | 'list'>('grid');
  public pickerGridSize = signal<'sm' | 'md' | 'lg'>('md');
  public selectedDocForPicker = signal<DocumentAsset | null>(null);

  // Product Modal Controls
  public isModalOpen = signal<boolean>(false);
  public isNewProduct = signal<boolean>(false);
  public isSaving = signal<boolean>(false);

  // Document Viewer Modal Controls
  public isDocumentViewerModalOpen = signal<boolean>(false);
  public previewingDoc = signal<DocumentAsset | null>(null);
  private sanitizer = inject(DomSanitizer);

  // Upload Document Modal Controls
  public isUploadDocModalOpen = signal<boolean>(false);
  public selectedFileName = signal<string>('');
  public isUploadingDoc = signal<boolean>(false);
  public uploadDocForm: { displayName: string; fileName: string; fileBase64?: string } = { displayName: '', fileName: '', fileBase64: '' };

  editForm: Partial<AdminProduct> = {};

  ngOnInit() {
    this.loadProducts();
    this.loadDocuments();
  }

  loadProducts() {
    this.adminService.getAdminProducts().subscribe(prods => {
      this.products.set(prods || []);
    });
  }

  loadDocuments() {
    this.adminService.getAdminDocuments().subscribe(docs => {
      this.documents.set(docs || []);
    });
  }

  getCountByCategory(cat: CategoryFilter): number {
    return this.products().filter(p => p.category === cat).length;
  }

  get filteredProducts(): AdminProduct[] {
    return this.products().filter(p => {
      const matchesCategory = this.selectedCategory() === 'all' || p.category === this.selectedCategory();
      const q = this.searchQuery.toLowerCase().trim();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }

  get filteredDocuments(): DocumentAsset[] {
    const q = this.documentSearchQuery.toLowerCase().trim();
    return this.documents().filter(d => 
      !q || d.displayName.toLowerCase().includes(q) || d.fileName.toLowerCase().includes(q)
    );
  }

  get filteredPickerDocuments(): DocumentAsset[] {
    const q = this.pickerSearchQuery.toLowerCase().trim();
    return this.documents().filter(d => 
      !q || d.displayName.toLowerCase().includes(q) || d.fileName.toLowerCase().includes(q)
    );
  }

  trackByIndex(index: number): number {
    return index;
  }

  addGptUrl() {
    if (!this.editForm.digitalUrls) this.editForm.digitalUrls = [];
    this.editForm.digitalUrls.push('');
  }

  removeGptUrl(index: number) {
    if (this.editForm.digitalUrls) {
      this.editForm.digitalUrls.splice(index, 1);
    }
  }

  addAttachment() {
    if (!this.editForm.attachments) this.editForm.attachments = [];
    this.editForm.attachments.push({ path: 'assets/documents/dossier-demo.pdf', fileName: '' });
  }

  removeAttachment(index: number) {
    if (this.editForm.attachments) {
      this.editForm.attachments.splice(index, 1);
    }
  }

  // -------------------------------------------------------------------
  // Creador & Editor de Productos
  // -------------------------------------------------------------------

  generateNextAutoIncrementalId(): string {
    const existingIds = this.products().map(p => p.id);
    let nextNum = this.products().length + 1;
    let candidate = `prod-${String(nextNum).padStart(3, '0')}`;
    while (existingIds.includes(candidate)) {
      nextNum++;
      candidate = `prod-${String(nextNum).padStart(3, '0')}`;
    }
    return candidate;
  }

  openCreateModal() {
    this.isNewProduct.set(true);
    const autoId = this.generateNextAutoIncrementalId();
    this.editForm = {
      id: autoId,
      name: '',
      category: 'portafolio',
      categoryLabel: 'Portafolio Docente 2026',
      priceCLP: 15000,
      emoji: '📚',
      description: '',
      digitalType: 'hybrid',
      digitalUrl: '',
      digitalUrls: [''],
      attachmentPath: '',
      fileName: '',
      attachments: [{ path: 'assets/documents/dossier-demo.pdf', fileName: '' }]
    };
    this.isModalOpen.set(true);
  }

  openEditModal(product: AdminProduct) {
    this.isNewProduct.set(false);

    const gptUrls = product.digitalUrls && product.digitalUrls.length > 0
      ? [...product.digitalUrls]
      : (product.digitalUrl ? [product.digitalUrl] : []);

    const fileAtts = product.attachments && product.attachments.length > 0
      ? product.attachments.map(a => ({ ...a }))
      : (product.attachmentPath ? [{ path: product.attachmentPath, fileName: product.fileName || '' }] : []);

    this.editForm = {
      id: product.id,
      name: product.name,
      category: product.category,
      categoryLabel: product.categoryLabel,
      priceCLP: product.priceCLP,
      emoji: product.emoji,
      description: product.description,
      digitalType: product.digitalType || 'hybrid',
      digitalUrl: product.digitalUrl || (gptUrls[0] || ''),
      digitalUrls: gptUrls,
      attachmentPath: product.attachmentPath || (fileAtts[0]?.path || ''),
      fileName: product.fileName || (fileAtts[0]?.fileName || ''),
      attachments: fileAtts
    };
    this.isModalOpen.set(true);
  }

  onCategoryChange() {
    if (this.isNewProduct()) {
      const cat = this.editForm.category;
      if (cat === 'portafolio') this.editForm.categoryLabel = 'Portafolio Docente 2026';
      else if (cat === 'ecep') this.editForm.categoryLabel = 'Asistente ECEP 2026';
      else if (cat === 'dossier') this.editForm.categoryLabel = 'Dossier PDF 2026';
      else if (cat === 'biblioteca') this.editForm.categoryLabel = 'Biblioteca Profe GPT';
    }
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveProduct() {
    if (!this.editForm.id || !this.editForm.name) {
      alert('Por favor especifica un ID y Nombre para el producto.');
      return;
    }

    this.isSaving.set(true);
    this.adminService.updateProduct(this.editForm).subscribe(res => {
      this.isSaving.set(false);
      if (res.success) {
        const action = this.isNewProduct() ? 'creado' : 'actualizado';
        this.toastMessage.set(`¡Producto "${this.editForm.name}" ${action} exitosamente!`);
        this.closeModal();
        this.loadProducts();
        this.loadDocuments();
        setTimeout(() => this.toastMessage.set(''), 4000);
      } else {
        alert(res.error || 'Error al guardar cambios.');
      }
    });
  }

  // -------------------------------------------------------------------
  // Galería Modal de Selección de Documentos (Picker)
  // -------------------------------------------------------------------

  openDocumentPickerModal() {
    this.loadDocuments();
    this.selectedDocForPicker.set(this.documents()[0] || null);
    this.isDocumentPickerOpen.set(true);
  }

  confirmDocumentSelection() {
    const selected = this.selectedDocForPicker();
    if (!selected) return;

    if (!this.editForm.attachments) this.editForm.attachments = [];
    
    this.editForm.attachments.push({
      path: selected.path,
      fileName: selected.fileName
    });

    this.isDocumentPickerOpen.set(false);
    this.toastMessage.set(`¡Documento "${selected.displayName}" asignado al paquete!`);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }

  // -------------------------------------------------------------------
  // Mantenedor de Documentos Actions (CRUD)
  // -------------------------------------------------------------------

  openUploadDocModal() {
    this.selectedFileName.set('');
    this.isUploadingDoc.set(false);
    this.uploadDocForm = { displayName: '', fileName: '', fileBase64: '' };
    this.isUploadDocModalOpen.set(true);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const sanitizedFileName = file.name.replace(/\s+/g, '-');
    this.selectedFileName.set(file.name);
    this.uploadDocForm.fileName = sanitizedFileName;
    this.uploadDocForm.displayName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.uploadDocForm.fileBase64 = base64String;
    };
    reader.readAsDataURL(file);
  }

  submitUploadDoc() {
    if (!this.uploadDocForm.fileName) return;

    this.isUploadingDoc.set(true);
    this.adminService.uploadAdminDocument(this.uploadDocForm).subscribe(res => {
      this.isUploadingDoc.set(false);
      if (res.success) {
        this.toastMessage.set(`¡Documento "${this.uploadDocForm.fileName}" guardado correctamente en la Bóveda!`);
        this.isUploadDocModalOpen.set(false);
        this.loadDocuments();
        setTimeout(() => this.toastMessage.set(''), 4000);
      } else {
        alert(res.error || 'Error registrando documento.');
      }
    });
  }

  previewDocument(doc: DocumentAsset) {
    this.openDocumentPreviewModal(doc);
  }

  deleteDocument(doc: DocumentAsset) {
    // Alerta preventiva si el archivo pertenece a algún producto
    if (doc.assignedProductsCount > 0) {
      this.deleteWarningAlert.set({
        fileName: doc.fileName,
        productNames: doc.assignedProductNames
      });
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el documento "${doc.displayName}" (${doc.fileName})?`)) {
      this.adminService.deleteAdminDocument(doc.fileName).subscribe(res => {
        if (res.success) {
          this.toastMessage.set(`¡Documento "${doc.fileName}" eliminado exitosamente!`);
          this.loadDocuments();
          setTimeout(() => this.toastMessage.set(''), 4000);
        } else if (res.assignedProductNames && res.assignedProductNames.length > 0) {
          this.deleteWarningAlert.set({
            fileName: doc.fileName,
            productNames: res.assignedProductNames
          });
        } else {
          alert(res.error || 'Error al eliminar documento.');
        }
      });
    }
  }

  openDocumentPreviewModal(doc: DocumentAsset) {
    this.previewingDoc.set(doc);
    this.isDocumentViewerModalOpen.set(true);
  }

  getSafeDocumentUrl(path?: string): SafeResourceUrl {
    if (!path) return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    return this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }

  formatMimeType(mime?: string, fileName?: string): string {
    if (!mime && !fileName) return 'Documento';
    const name = (fileName || '').toLowerCase();
    if (mime?.includes('pdf') || name.endsWith('.pdf')) return 'PDF Documento';
    if (mime?.includes('word') || mime?.includes('officedocument') || name.endsWith('.docx') || name.endsWith('.doc')) return 'Word (DOCX)';
    if (name.endsWith('.txt')) return 'Texto Plano (.txt)';
    return 'Documento Digital';
  }

  onLogout() {
    this.adminService.logout();
    this.router.navigate(['/admin/login']);
  }
}
