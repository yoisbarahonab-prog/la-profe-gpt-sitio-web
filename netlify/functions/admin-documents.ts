import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { PRIVATE_DIGITAL_VAULT } from './shared/private-vault';
import { NetlifyVaultStorage } from './shared/netlify-blobs';
import * as fs from 'fs';
import * as path from 'path';

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

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const authHeader = event.headers['authorization'] || event.headers['Authorization'] || '';
  if (!authHeader.includes('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ error: 'No autorizado. Token faltante.' }) };
  }

  const docsDir = path.join(__dirname, 'assets', 'documents');
  const productsJsonPath = path.join(__dirname, '..', '..', 'src', 'assets', 'data', 'products.json');

  // Asegurar que el directorio de documentos privados existe
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Cargar productos para calcular asignaciones
  let allProducts: any[] = [];
  try {
    if (fs.existsSync(productsJsonPath)) {
      allProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
    }
  } catch (err) {
    console.error('[admin-documents] Error leyendo products.json:', err);
  }

  const getAssignedProductsForFile = (filePath: string, fileName: string): string[] => {
    const cleanPath = filePath.toLowerCase().trim();
    const cleanName = fileName.toLowerCase().trim();
    const matchedNames = new Set<string>();

    // Escanear Bóveda Privada
    Object.values(PRIVATE_DIGITAL_VAULT).forEach(asset => {
      const pName = asset.name || asset.id;
      if (asset.attachmentPath && asset.attachmentPath.toLowerCase().trim() === cleanPath) {
        matchedNames.add(pName);
      }
      if (asset.fileName && asset.fileName.toLowerCase().trim() === cleanName) {
        matchedNames.add(pName);
      }
      if (asset.attachments && Array.isArray(asset.attachments)) {
        asset.attachments.forEach(att => {
          if (att.path && att.path.toLowerCase().trim() === cleanPath) matchedNames.add(pName);
          if (att.fileName && att.fileName.toLowerCase().trim() === cleanName) matchedNames.add(pName);
        });
      }
    });

    // Escanear productos públicos
    allProducts.forEach(p => {
      if (p.attachmentPath && p.attachmentPath.toLowerCase().trim() === cleanPath) matchedNames.add(p.name);
      if (p.fileName && p.fileName.toLowerCase().trim() === cleanName) matchedNames.add(p.name);
      if (p.attachments && Array.isArray(p.attachments)) {
        p.attachments.forEach((att: any) => {
          if (att.path && att.path.toLowerCase().trim() === cleanPath) matchedNames.add(p.name);
          if (att.fileName && att.fileName.toLowerCase().trim() === cleanName) matchedNames.add(p.name);
        });
      }
    });

    return Array.from(matchedNames);
  };

  // ----------------------------------------------------
  // GET: Listar todos los documentos registrados
  // ----------------------------------------------------
  if (event.httpMethod === 'GET') {
    try {
      const files = fs.readdirSync(docsDir);
      const docsList: DocumentAsset[] = files.map(file => {
        const fullPath = path.join(docsDir, file);
        const stats = fs.statSync(fullPath);
        const relativePath = `assets/documents/${file}`;
        const ext = path.extname(file).toLowerCase();
        
        let mimeType = 'application/octet-stream';
        if (ext === '.pdf') mimeType = 'application/pdf';
        else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (ext === '.doc') mimeType = 'application/msword';
        else if (ext === '.txt') mimeType = 'text/plain';

        const assignedProductNames = getAssignedProductsForFile(relativePath, file);

        return {
          id: file,
          displayName: file.replace(ext, '').replace(/[-_]/g, ' '),
          fileName: file,
          path: relativePath,
          sizeBytes: stats.size,
          mimeType,
          uploadedAt: stats.mtime.toISOString(),
          assignedProductsCount: assignedProductNames.length,
          assignedProductNames
        };
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: docsList })
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error obteniendo documentos: ' + err.message })
      };
    }
  }

  // ----------------------------------------------------
  // POST: Subir o registrar un nuevo documento
  // ----------------------------------------------------
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { fileName, fileBase64, displayName } = body;

      if (!fileName) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Nombre de archivo requerido.' }) };
      }

      const cleanFileName = fileName.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '_');
      const targetPath = path.join(docsDir, cleanFileName);

      if (fileBase64) {
        const buffer = Buffer.from(fileBase64, 'base64');
        await NetlifyVaultStorage.saveDocument(cleanFileName, buffer, { displayName, mimeType: cleanFileName.endsWith('.pdf') ? 'application/pdf' : 'application/msword' });

        // También guardar en src/assets/documents/ para desarrollo local si la carpeta existe
        const devDocsDir = path.join(__dirname, '..', '..', 'src', 'assets', 'documents');
        if (fs.existsSync(devDocsDir)) {
          fs.writeFileSync(path.join(devDocsDir, cleanFileName), buffer);
        }
      } else if (!fs.existsSync(targetPath)) {
        fs.writeFileSync(targetPath, 'DOCUMENTO_PRIVADO_LA_PROFE_GPT');
      }

      const relativePath = `assets/documents/${cleanFileName}`;
      const assignedProductNames = getAssignedProductsForFile(relativePath, cleanFileName);

      const newDoc: DocumentAsset = {
        id: cleanFileName,
        displayName: displayName || cleanFileName,
        fileName: cleanFileName,
        path: relativePath,
        sizeBytes: fs.existsSync(targetPath) ? fs.statSync(targetPath).size : 0,
        mimeType: cleanFileName.endsWith('.pdf') ? 'application/pdf' : 'application/msword',
        uploadedAt: new Date().toISOString(),
        assignedProductsCount: assignedProductNames.length,
        assignedProductNames
      };

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Documento registrado exitosamente.', document: newDoc })
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error guardando documento: ' + err.message })
      };
    }
  }

  // ----------------------------------------------------
  // DELETE: Eliminar documento (con validación de uso)
  // ----------------------------------------------------
  if (event.httpMethod === 'DELETE') {
    try {
      const fileName = event.queryStringParameters?.fileName || event.queryStringParameters?.id;
      if (!fileName) {
        return { statusCode: 400, body: JSON.stringify({ error: 'ID/Nombre de archivo requerido.' }) };
      }

      const relativePath = `assets/documents/${fileName}`;
      const assignedProductNames = getAssignedProductsForFile(relativePath, fileName);

      // VERIFICACIÓN DE SEGURIDAD DE USO EN PRODUCTOS
      if (assignedProductNames.length > 0) {
        return {
          statusCode: 409, // Conflict
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            error: `No se puede eliminar el documento "${fileName}" porque está asignado a ${assignedProductNames.length} producto(s).`,
            assignedProductNames
          })
        };
      }

      const targetPath = path.join(docsDir, fileName);
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: `Documento "${fileName}" eliminado con éxito.` })
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error eliminando documento: ' + err.message })
      };
    }
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) };
};
