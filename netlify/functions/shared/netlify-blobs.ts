import { getStore } from '@netlify/blobs';
import * as fs from 'fs';
import * as path from 'path';

export class NetlifyVaultStorage {
  private static docsStore = getStore('private-documents');
  private static productsStore = getStore('catalog-products');

  // ----------------------------------------------------
  // Documentos Privados (Archivos + Metadatos)
  // ----------------------------------------------------

  static async saveDocument(fileName: string, dataBuffer: Buffer, metadata: any): Promise<boolean> {
    try {
      // 1. Guardar binario y metadatos en Netlify Blobs
      await this.docsStore.set(fileName, dataBuffer, {
        metadata: {
          displayName: metadata.displayName,
          mimeType: metadata.mimeType,
          uploadedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      console.warn('[NetlifyBlobs] Usando fallback local para guardar documento:', err);
    }

    // 2. Guardar respaldo físico en disco local
    const docsDir = path.join(__dirname, '..', 'assets', 'documents');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(docsDir, fileName), dataBuffer);
    return true;
  }

  static async getDocumentBuffer(fileName: string): Promise<Buffer | null> {
    try {
      const blob = await this.docsStore.get(fileName, { type: 'arrayBuffer' });
      if (blob) {
        return Buffer.from(blob);
      }
    } catch (err) {
      console.warn('[NetlifyBlobs] Buscando fallback local para documento:', err);
    }

    // Fallback local
    const localPath = path.join(__dirname, '..', 'assets', 'documents', fileName);
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
    return null;
  }

  static async deleteDocument(fileName: string): Promise<boolean> {
    try {
      await this.docsStore.delete(fileName);
    } catch (err) {
      console.warn('[NetlifyBlobs] Eliminando documento localmente:', err);
    }

    const localPath = path.join(__dirname, '..', 'assets', 'documents', fileName);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    return true;
  }

  // ----------------------------------------------------
  // Catálogo de Productos
  // ----------------------------------------------------

  static async getProducts(): Promise<any[]> {
    try {
      const json = await this.productsStore.get('products-catalog', { type: 'json' });
      if (json && Array.isArray(json)) {
        return json;
      }
    } catch (err) {
      console.warn('[NetlifyBlobs] Leyendo productos desde disco local:', err);
    }

    const productsJsonPath = path.join(__dirname, '..', '..', 'src', 'assets', 'data', 'products.json');
    if (fs.existsSync(productsJsonPath)) {
      return JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
    }
    return [];
  }

  static async saveProducts(products: any[]): Promise<boolean> {
    try {
      await this.productsStore.setJSON('products-catalog', products);
    } catch (err) {
      console.warn('[NetlifyBlobs] Guardando productos localmente:', err);
    }

    const productsJsonPath = path.join(__dirname, '..', '..', 'src', 'assets', 'data', 'products.json');
    try {
      fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2), 'utf-8');
    } catch (e) {
      console.error('[NetlifyBlobs] Error escribiendo products.json local:', e);
    }
    return true;
  }
}
