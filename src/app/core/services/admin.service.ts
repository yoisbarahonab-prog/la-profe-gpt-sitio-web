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
  private mockDocuments = signal<DocumentAsset[]>([
    {
      id: 'dossier-demo.pdf',
      displayName: 'Dossier Evaluación Docente Demo 2026',
      fileName: 'dossier-demo.pdf',
      path: 'assets/documents/dossier-demo.pdf',
      sizeBytes: 1542000,
      mimeType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      assignedProductsCount: 2,
      assignedProductNames: ['Asistente ECEP Evaluación Docente 2026 Básica', 'Dossier ECEP 2026 – Básica Generalista']
    },
    {
      id: 'guia-orientacion-cpeip-2026.pdf',
      displayName: 'Guía de Orientaciones CPEIP 2026',
      fileName: 'guia-orientacion-cpeip-2026.pdf',
      path: 'assets/documents/guia-orientacion-cpeip-2026.pdf',
      sizeBytes: 2840000,
      mimeType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      assignedProductsCount: 0,
      assignedProductNames: []
    },
    {
      id: 'rubricas-portafolio-2026.docx',
      displayName: 'Rúbricas Portafolio 2026 Word',
      fileName: 'rubricas-portafolio-2026.docx',
      path: 'assets/documents/rubricas-portafolio-2026.docx',
      sizeBytes: 940000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: new Date().toISOString(),
      assignedProductsCount: 0,
      assignedProductNames: []
    }
  ]);

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
      catchError(() => {
        // Fallback para desarrollo local con 'ng serve' si las Netlify Functions no están activas
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === 'admin@laprofegpt.cl' && password === 'ProfeAdmin2026!') {
          const mockUser: AdminUser = {
            email: 'admin@laprofegpt.cl',
            role: 'Administrator',
            name: 'La Profe GPT Admin'
          };
          const mockToken = btoa('admin_local_dev_token');
          this.saveSession(mockToken, mockUser);
          return of({ success: true, token: mockToken, user: mockUser });
        }
        return of({ success: false, error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
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
        // Fallback local con ProductService si no está activo Netlify Dev
        return this.productService.getProducts().pipe(
          map(products => products.map(p => ({
            ...p,
            digitalType: (p.category === 'dossier' || p.category === 'biblioteca' ? 'file_attachment' : 'gpt_url') as any,
            digitalUrl: p.category === 'dossier' ? '' : `https://chatgpt.com/g/g-${p.id}`,
            attachmentPath: p.category === 'dossier' ? 'assets/documents/dossier-demo.pdf' : '',
            fileName: `${p.name}.pdf`
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
      catchError(() => {
        // Fallback local dev
        return of({ success: true, message: `Producto "${productData.name}" actualizado localmente.` });
      })
    );
  }

  // -------------------------------------------------------------------
  // Mantenedor de Documentos (CRUD & Alerta de Productos)
  // -------------------------------------------------------------------

  getAdminDocuments(): Observable<DocumentAsset[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<{ documents: DocumentAsset[] }>('/.netlify/functions/admin-documents', { headers }).pipe(
      map(res => res.documents || []),
      catchError(() => {
        return of(this.mockDocuments());
      })
    );
  }

  uploadAdminDocument(docData: { fileName: string; displayName?: string; fileBase64?: string }): Observable<{ success: boolean; message?: string; document?: DocumentAsset; error?: string }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<{ success: boolean; message: string; document: DocumentAsset }>('/.netlify/functions/admin-documents', docData, { headers }).pipe(
      catchError(() => {
        // Dev fallback
        const cleanName = docData.fileName.trim().replace(/\s+/g, '-');
        const dataUrl = docData.fileBase64 
          ? `data:${cleanName.endsWith('.pdf') ? 'application/pdf' : 'application/msword'};base64,${docData.fileBase64}`
          : `assets/documents/${cleanName}`;

        const newDoc: DocumentAsset = {
          id: cleanName,
          displayName: docData.displayName || cleanName,
          fileName: cleanName,
          path: dataUrl,
          sizeBytes: docData.fileBase64 ? Math.round(docData.fileBase64.length * 0.75) : 1024000,
          mimeType: cleanName.endsWith('.pdf') ? 'application/pdf' : 'application/msword',
          uploadedAt: new Date().toISOString(),
          assignedProductsCount: 0,
          assignedProductNames: []
        };
        const updated = [...this.mockDocuments(), newDoc];
        this.mockDocuments.set(updated);
        return of({ success: true, message: `Documento "${cleanName}" registrado localmente.`, document: newDoc });
      })
    );
  }

  deleteAdminDocument(fileName: string): Observable<{ success: boolean; message?: string; assignedProductNames?: string[]; error?: string }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.delete<{ success: boolean; message?: string; assignedProductNames?: string[]; error?: string }>(`/.netlify/functions/admin-documents?fileName=${encodeURIComponent(fileName)}`, { headers }).pipe(
      catchError(() => {
        // Local dev fallback check
        const target = this.mockDocuments().find(d => d.fileName === fileName || d.id === fileName);
        if (target && target.assignedProductsCount > 0) {
          return of({
            success: false,
            error: `No se puede eliminar el documento "${fileName}" porque está asignado a ${target.assignedProductsCount} producto(s).`,
            assignedProductNames: target.assignedProductNames
          });
        }
        const filtered = this.mockDocuments().filter(d => d.fileName !== fileName && d.id !== fileName);
        this.mockDocuments.set(filtered);
        return of({ success: true, message: `Documento "${fileName}" eliminado localmente.` });
      })
    );
  }
}
