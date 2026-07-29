import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, shareReplay, catchError } from 'rxjs';
import { Product, CategoryFilter } from '../models/product.model';
import productsData from '../../../assets/data/products.json';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  
  // Lista fallback proveniente directamente del archivo products.json
  private fallbackProducts: Product[] = productsData as Product[];

  private products$ = this.http.get<Product[]>('/assets/data/products.json').pipe(
    catchError(() => of(this.fallbackProducts)),
    shareReplay(1)
  );

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductsByCategory(category: CategoryFilter): Observable<Product[]> {
    return this.products$.pipe(
      map(products => {
        if (category === 'all') return products;
        return products.filter(p => p.category === category);
      })
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }
}
