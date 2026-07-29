import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CartDrawerComponent } from './shared/components/cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, CartDrawerComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between">
      <app-navbar *ngIf="!isAdminRoute()" />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer *ngIf="!isAdminRoute()" />
      <app-cart-drawer *ngIf="!isAdminRoute()" />
    </div>
  `
})
export class AppComponent {
  private router = inject(Router);
  isAdminRoute = signal<boolean>(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url || '';
      this.isAdminRoute.set(url.startsWith('/admin'));
    });
  }
}
