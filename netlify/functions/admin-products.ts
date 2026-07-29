import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { PRIVATE_DIGITAL_VAULT, PrivateAsset } from './shared/private-vault';
import { NetlifyVaultStorage } from './shared/netlify-blobs';
import * as fs from 'fs';
import * as path from 'path';

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Verificar token de autorización simple
  const authHeader = event.headers['authorization'] || event.headers['Authorization'] || '';
  if (!authHeader.includes('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ error: 'No autorizado. Token de administración faltante.' }) };
  }

  if (event.httpMethod === 'GET') {
    try {
      const publicProducts = await NetlifyVaultStorage.getProducts();

      // Combinar metadatos públicos con los datos de la bóveda privada
      const combinedProducts = publicProducts.map(p => {
        const privateAsset = PRIVATE_DIGITAL_VAULT[p.id] || {
          id: p.id,
          name: p.name,
          digitalType: 'hybrid',
          digitalUrl: '',
          digitalUrls: [],
          attachmentPath: '',
          fileName: '',
          attachments: []
        };

        return {
          ...p,
          digitalType: privateAsset.digitalType || 'hybrid',
          digitalUrl: privateAsset.digitalUrl || (privateAsset.digitalUrls && privateAsset.digitalUrls[0]) || '',
          digitalUrls: privateAsset.digitalUrls || (privateAsset.digitalUrl ? [privateAsset.digitalUrl] : []),
          attachmentPath: privateAsset.attachmentPath || (privateAsset.attachments && privateAsset.attachments[0]?.path) || '',
          fileName: privateAsset.fileName || (privateAsset.attachments && privateAsset.attachments[0]?.fileName) || '',
          attachments: privateAsset.attachments || (privateAsset.attachmentPath ? [{ path: privateAsset.attachmentPath, fileName: privateAsset.fileName || '' }] : [])
        };
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: combinedProducts })
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error cargando productos: ' + err.message })
      };
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { id, name, category, categoryLabel, priceCLP, flowToken, emoji, description, digitalType, digitalUrl, digitalUrls, attachmentPath, fileName, attachments } = body;

      if (!id) {
        return { statusCode: 400, body: JSON.stringify({ error: 'ID de producto requerido.' }) };
      }

      // Actualizar o crear producto en Netlify Blobs y catálogo local
      const publicProducts: any[] = await NetlifyVaultStorage.getProducts();
      const index = publicProducts.findIndex(p => p.id === id);

      const newPublicData = {
        id,
        name: name || `Producto ${id}`,
        category: category || 'portafolio',
        categoryLabel: categoryLabel || (category === 'ecep' ? 'Asistente ECEP 2026' : category === 'dossier' ? 'Dossier PDF' : category === 'biblioteca' ? 'Biblioteca Profe GPT' : 'Portafolio Docente 2026'),
        priceCLP: Number(priceCLP || 15000),
        flowToken: flowToken || `token_${id}`,
        emoji: emoji || '📚',
        description: description || ''
      };

      if (index !== -1) {
        publicProducts[index] = { ...publicProducts[index], ...newPublicData };
      } else {
        // Crear nuevo producto en el catálogo público
        publicProducts.push(newPublicData);
      }

      await NetlifyVaultStorage.saveProducts(publicProducts);

      // Actualizar la bóveda privada en memoria
      PRIVATE_DIGITAL_VAULT[id] = {
        id,
        name: name || PRIVATE_DIGITAL_VAULT[id]?.name || id,
        digitalType: digitalType || 'hybrid',
        digitalUrl: digitalUrl || (digitalUrls && digitalUrls[0]) || '',
        digitalUrls: digitalUrls || (digitalUrl ? [digitalUrl] : []),
        attachmentPath: attachmentPath || (attachments && attachments[0]?.path) || '',
        fileName: fileName || (attachments && attachments[0]?.fileName) || '',
        attachments: attachments || (attachmentPath ? [{ path: attachmentPath, fileName: fileName || '' }] : [])
      };

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Producto guardado exitosamente.', product: PRIVATE_DIGITAL_VAULT[id] })
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error guardando producto: ' + err.message })
      };
    }
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) };
};
