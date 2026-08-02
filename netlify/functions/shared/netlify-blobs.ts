import { getStore } from '@netlify/blobs';
import * as fs from 'fs';
import * as path from 'path';

export class NetlifyVaultStorage {

  private static getDocsStore() {
    try {
      const siteID = process.env['NETLIFY_SITE_ID'];
      const token = process.env['NETLIFY_AUTH_TOKEN'] || process.env['NETLIFY_TOKEN'] || process.env['NETLIFY_API_TOKEN'];

      if (siteID && token) {
        return getStore({ name: 'private-documents', siteID, token });
      }
      return getStore('private-documents');
    } catch (err) {
      console.warn('[NetlifyBlobs] Error instanciando store private-documents en Netlify Blobs:', err);
      return null;
    }
  }

  private static getProductsStore() {
    try {
      const siteID = process.env['NETLIFY_SITE_ID'];
      const token = process.env['NETLIFY_AUTH_TOKEN'] || process.env['NETLIFY_TOKEN'] || process.env['NETLIFY_API_TOKEN'];

      if (siteID && token) {
        return getStore({ name: 'catalog-products', siteID, token });
      }
      return getStore('catalog-products');
    } catch (err) {
      console.warn('[NetlifyBlobs] Error instanciando store catalog-products en Netlify Blobs:', err);
      return null;
    }
  }

  // ----------------------------------------------------
  // Documentos Privados (Archivos + Metadatos)
  // ----------------------------------------------------

  static async saveDocument(fileName: string, dataBuffer: Buffer, metadata: any): Promise<boolean> {
    const docsStore = this.getDocsStore();
    if (docsStore) {
      try {
        await docsStore.set(fileName, dataBuffer, {
          metadata: {
            displayName: metadata.displayName || fileName,
            mimeType: metadata.mimeType || 'application/pdf',
            uploadedAt: new Date().toISOString()
          }
        });
        return true;
      } catch (err) {
        console.error('[NetlifyBlobs] Error guardando archivo en Netlify Blobs:', err);
        throw err;
      }
    }

    // Backup local si no hay conexion Blobs disponible
    const docsDir = path.join(__dirname, '..', 'assets', 'documents');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(docsDir, fileName), dataBuffer);
    return true;
  }

  static async getDocumentBuffer(fileName: string): Promise<Buffer | null> {
    const docsStore = this.getDocsStore();
    if (docsStore) {
      try {
        const blob = await docsStore.get(fileName, { type: 'arrayBuffer' });
        if (blob) {
          return Buffer.from(blob);
        }
      } catch (err) {
        console.warn('[NetlifyBlobs] No se pudo obtener blob de Netlify:', err);
      }
    }

    const localPath = path.join(__dirname, '..', 'assets', 'documents', fileName);
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
    return null;
  }

  static async deleteDocument(fileName: string): Promise<boolean> {
    const docsStore = this.getDocsStore();
    if (docsStore) {
      try {
        await docsStore.delete(fileName);
      } catch (err) {
        console.warn('[NetlifyBlobs] Error al eliminar documento de Netlify Blobs:', err);
      }
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
    const productsStore = this.getProductsStore();
    if (productsStore) {
      try {
        const json = await productsStore.get('products-catalog', { type: 'json' });
        if (json && Array.isArray(json)) {
          return json;
        }
      } catch (err) {
        console.warn('[NetlifyBlobs] No se obtuvieron productos de Blobs:', err);
      }
    }

    const productsJsonPath = path.join(__dirname, '..', '..', 'src', 'assets', 'data', 'products.json');
    if (fs.existsSync(productsJsonPath)) {
      return JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
    }
    return [];
  }

  static async saveProducts(products: any[]): Promise<boolean> {
    const productsStore = this.getProductsStore();
    if (productsStore) {
      try {
        await productsStore.setJSON('products-catalog', products);
      } catch (err) {
        console.error('[NetlifyBlobs] Error guardando productos en Netlify Blobs:', err);
        throw err;
      }
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
