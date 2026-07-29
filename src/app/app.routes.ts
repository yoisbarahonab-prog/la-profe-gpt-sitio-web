import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./features/catalog/catalog-page.component').then(m => m.CatalogPageComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout-page.component').then(m => m.CheckoutPageComponent)
  },
  {
    path: 'pago-estado',
    loadComponent: () => import('./features/payment-status/payment-status.component').then(m => m.PaymentStatusComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
