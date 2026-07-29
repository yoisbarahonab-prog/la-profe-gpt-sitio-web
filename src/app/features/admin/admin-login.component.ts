import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#FDF5FF] text-profe-text flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      <!-- Fondo con Halo Degradado 3 Colores -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#6B4FBB]/30 via-[#E8607A]/20 to-[#8B5CF6]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tr from-[#E8607A]/25 via-[#6B4FBB]/20 to-[#8B5CF6]/25 rounded-full blur-3xl pointer-events-none"></div>

      <div class="w-full max-w-md bg-white/95 backdrop-blur-md border-2 border-profe-purple-light/80 rounded-3xl p-8 shadow-xl relative z-10">
        
        <!-- Header con Logo & Título -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-block mb-3 hover:scale-105 transition-transform">
            <img src="/assets/images/LOGO.png" alt="La Profe GPT Logo" class="h-14 mx-auto object-contain">
          </a>
          <span class="inline-block bg-[#EDE9FF] border border-profe-purple-light text-profe-purple font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs mb-2">
            ZONA RESTRINGIDA
          </span>
          <h1 class="text-2xl font-black text-profe-purple-dark">Acceso Administración</h1>
          <p class="text-xs font-semibold text-profe-muted mt-1">Ingresa tus credenciales privadas para gestionar los productos.</p>
        </div>

        <!-- Alerta de Error -->
        <div *ngIf="errorMessage()" class="mb-6 bg-[#FFF0F3] border-2 border-[#FBCFE8] text-profe-pink-dark p-3.5 rounded-2xl text-xs font-extrabold flex items-start gap-2 animate-fade-in-up">
          <span class="text-sm">⚠️</span>
          <span>{{ errorMessage() }}</span>
        </div>

        <!-- Formulario de Login -->
        <form (ngSubmit)="onLogin()" class="space-y-5">
          
          <div>
            <label class="block text-xs font-black text-profe-purple-dark mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
            <div class="relative">
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email"
                required
                placeholder="admin@laprofegpt.cl"
                class="w-full bg-white border-2 border-profe-purple-light focus:border-profe-purple rounded-2xl px-4 py-3 text-xs font-extrabold text-profe-text focus:outline-none transition-colors pl-10 shadow-inner">
              <span class="absolute left-3.5 top-3.5 text-profe-muted text-sm">✉️</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-profe-purple-dark mb-1.5 uppercase tracking-wider">Contraseña Privada</label>
            <div class="relative">
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                [(ngModel)]="password" 
                name="password"
                required
                placeholder="••••••••••••"
                class="w-full bg-white border-2 border-profe-purple-light focus:border-profe-purple rounded-2xl px-4 py-3 text-xs font-extrabold text-profe-text focus:outline-none transition-colors pl-10 pr-10 shadow-inner">
              <span class="absolute left-3.5 top-3.5 text-profe-muted text-sm">🔒</span>
              
              <button 
                type="button"
                (click)="showPassword.set(!showPassword())"
                class="absolute right-3.5 top-3.5 text-profe-muted hover:text-profe-purple text-xs font-bold">
                {{ showPassword() ? '👁️' : '🙈' }}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            [disabled]="isLoading()"
            class="w-full bg-gradient-to-r from-profe-purple to-profe-purple-dark hover:from-profe-purple-dark hover:to-profe-purple text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <span *ngIf="isLoading()" class="inline-block animate-spin text-sm">⏳</span>
            <span>{{ isLoading() ? 'Iniciando sesión...' : 'Ingresar al Dashboard →' }}</span>
          </button>

        </form>

        <div class="mt-8 pt-6 border-t border-gray-100 text-center">
          <a routerLink="/" class="text-xs font-bold text-profe-purple hover:underline">
            ← Volver al sitio principal
          </a>
        </div>

      </div>
    </div>
  `
})
export class AdminLoginComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor completa todos los campos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.adminService.login(this.email, this.password).subscribe(res => {
      this.isLoading.set(false);
      if (res.success) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.errorMessage.set(res.error || 'Credenciales inválidas.');
      }
    });
  }
}
