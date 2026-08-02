import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

export interface AttachmentItem {
  path: string;
  fileName: string;
}

export interface AdminProduct extends Product {
  digitalType?: 'gpt_url' | 'pdf_download' | 'file_attachment' | 'hybrid';
  digitalUrl?: string;
  digitalUrls?: string[];
  attachmentPath?: string;
  fileName?: string;
  attachments?: AttachmentItem[];
}

export interface DocumentAsset {
  id: string;
  displayName: string;
  fileName: string;
  path: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  assignedProductsCount: number;
  assignedProductNames: string[];
}

export interface AdminUser {
  email: string;
  role: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private productService = inject(ProductService);

  private tokenKey = 'profe_admin_token';
  public isLoggedIn = signal<boolean>(this.hasValidToken());
  public currentUser = signal<AdminUser | null>(this.getStoredUser());

  private hasValidToken(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }

  private getStoredUser(): AdminUser | null {
    const raw = sessionStorage.getItem('profe_admin_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  getToken(): string {
    return sessionStorage.getItem(this.tokenKey) || '';
  }

  login(email: string, password: string): Observable<{ success: boolean; token?: string; error?: string }> {
    return this.http.post<{ success: boolean; token: string; user: AdminUser }>('/.netlify/functions/admin-auth', { email, password }).pipe(
      tap(res => {
        if (res.success && res.token) {
          this.saveSession(res.token, res.user);
        }
      }),
      catchError((err) => {
        const errorMsg = err.error?.error || 'Error de conexión o credenciales inválidas.';
        return of({ success: false, error: errorMsg });
      })
    );
  }

  private saveSession(token: string, user: AdminUser) {
    sessionStorage.setItem(this.tokenKey, token);
    sessionStorage.setItem('profe_admin_user', JSON.stringify(user));
    this.isLoggedIn.set(true);
    this.currentUser.set(user);
  }

  logout() {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('profe_admin_user');
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
  }

  getAdminProducts(): Observable<AdminProduct[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<{ products: AdminProduct[] }>('/.netlify/functions/admin-products', { headers }).pipe(
      map(res => res.products || []),
      catchError(() => {
        return this.productService.getProducts().pipe(
          map(products => products.map(p => ({
            ...p,
            digitalType: (p.category === 'dossier' || p.category === 'biblioteca' ? 'file_attachment' : 'gpt_url') as any,
            digitalUrl: p.category === 'dossier' ? '' : `https://chatgpt.com/g/g-${p.id}`,
            attachmentPath: '',
            fileName: ''
          })))
        );
      })
    );
  }

  updateProduct(productData: Partial<AdminProduct>): Observable<{ success: boolean; message?: string; error?: string }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<{ success: boolean; message: string }>('/.netlify/functions/admin-products', productData, { headers }).pipe(
      catchError((err) => {
        return of({ success: false, error: err.error?.error || 'Error actualizando producto en Netlify.' });
      })
    );
  }

  // -------------------------------------------------------------------
  // Mantenedor de Documentos (Conexión Real Netlify Blobs)
  // -------------------------------------------------------------------

  getAdminDocuments(): Observable<DocumentAsset[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<{ documents: DocumentAsset[] }>('/.netlify/functions/admin-documents', { headers }).pipe(
      map(res => res.documents || []),
      catchError(() => {
        return of([]);
      })
    );
  }

  uploadAdminDocument(docData: { fileName: string; displayName?: string; fileBase64?: string }): Observable<{ success: boolean; message?: string; document?: DocumentAsset; error?: string }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<{ success: boolean; message: string; document: DocumentAsset }>('/.netlify/functions/admin-documents', docData, { headers }).pipe(
      catchError((err) => {
        return of({ success: false, error: err.error?.error || 'Error al subir el documento a Netlify Blobs.' });
      })
    );
  }

  deleteAdminDocument(fileName: string): Observable<{ success: boolean; message?: string; assignedProductNames?: string[]; error?: string }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.delete<{ success: boolean; message?: string; assignedProductNames?: string[]; error?: string }>(`/.netlify/functions/admin-documents?fileName=${encodeURIComponent(fileName)}`, { headers }).pipe(
      catchError((err) => {
        return of({
          success: false,
          error: err.error?.error || 'Error al eliminar el documento.',
          assignedProductNames: err.error?.assignedProductNames || []
        });
      })
    );
  }
}
