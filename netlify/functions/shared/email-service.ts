import { PrivateAsset } from './private-vault';
import * as fs from 'fs';
import * as path from 'path';

export async function sendDigitalDeliveryEmail(
  resendApiKey: string,
  fromEmail: string,
  toEmail: string,
  customerName: string,
  items: PrivateAsset[]
): Promise<boolean> {
  if (!resendApiKey) {
    console.warn('[EmailService] RESEND_API_KEY no configurada. Omitiendo envío de email.');
    return false;
  }

  const emailAttachments: Array<{ filename: string; content: string }> = [];  // Procesar archivos adjuntos para enviar en el correo
  for (const item of items) {
    const fileItems: { path: string; fileName: string }[] = [];
    if (item.attachmentPath) {
      fileItems.push({ path: item.attachmentPath, fileName: item.fileName || path.basename(item.attachmentPath) });
    }
    if (item.attachments && Array.isArray(item.attachments)) {
      for (const att of item.attachments) {
        if (att.path && !fileItems.some(f => f.path === att.path)) {
          fileItems.push({ path: att.path, fileName: att.fileName || path.basename(att.path) });
        }
      }
    }

    for (const fileObj of fileItems) {
      const fileSource = fileObj.path;
      if (fileSource.startsWith('http')) {
        try {
          console.log(`[EmailService] Obteniendo archivo remoto para adjuntar: ${fileSource}`);
          const fileRes = await fetch(fileSource);
          if (fileRes.ok) {
            const arrayBuffer = await fileRes.arrayBuffer();
            const base64Content = Buffer.from(arrayBuffer).toString('base64');
            emailAttachments.push({
              filename: fileObj.fileName,
              content: base64Content
            });
            console.log(`[EmailService] Archivo remoto ${fileObj.fileName} adjuntado con éxito.`);
          }
        } catch (err) {
          console.error(`[EmailService] Error obteniendo adjunto remoto ${fileSource}:`, err);
        }
      } else {
        // Archivo local en la carpeta privada de Netlify Functions
        try {
          const resolvedPath = path.isAbsolute(fileSource) 
            ? fileSource 
            : path.join(__dirname, '..', fileSource);

          if (fs.existsSync(resolvedPath)) {
            const fileBuffer = fs.readFileSync(resolvedPath);
            const base64Content = fileBuffer.toString('base64');
            emailAttachments.push({
              filename: fileObj.fileName,
              content: base64Content
            });
            console.log(`[EmailService] Archivo local ${fileObj.fileName} adjuntado con éxito desde la carpeta privada.`);
          } else {
            console.warn(`[EmailService] Archivo local no encontrado en ruta: ${resolvedPath}`);
          }
        } catch (err) {
          console.error(`[EmailService] Error leyendo archivo local ${fileSource}:`, err);
        }
      }
    }
  }

  const itemsHtml = items.map(item => {
    // Recopilar URLs de GPT
    const gptUrls: string[] = [];
    if (item.digitalUrl) gptUrls.push(item.digitalUrl);
    if (item.digitalUrls && Array.isArray(item.digitalUrls)) {
      for (const url of item.digitalUrls) {
        if (url && !gptUrls.includes(url)) gptUrls.push(url);
      }
    }

    // Recopilar nombres de archivos adjuntos
    const fileNames: string[] = [];
    if (item.fileName || item.attachmentPath) {
      fileNames.push(item.fileName || path.basename(item.attachmentPath || 'documento.pdf'));
    }
    if (item.attachments && Array.isArray(item.attachments)) {
      for (const att of item.attachments) {
        if (att.fileName && !fileNames.includes(att.fileName)) {
          fileNames.push(att.fileName);
        }
      }
    }

    const hasGpt = gptUrls.length > 0;
    const hasFile = fileNames.length > 0;

    let badge = '📄 Recurso Digital';
    if (hasGpt && hasFile) badge = `🚀 Pack Combo (${gptUrls.length} GPTs + ${fileNames.length} Adjuntos)`;
    else if (hasGpt) badge = gptUrls.length > 1 ? `🤖 ${gptUrls.length} Asistentes GPT` : '🤖 Asistente GPT';
    else if (hasFile) badge = fileNames.length > 1 ? `📎 ${fileNames.length} Archivos Adjuntos` : '📎 Archivo Adjunto (PDF/Word)';

    return `
      <div style="background: #FDF5FF; border: 2px solid #EDE9FF; border-radius: 16px; padding: 20px; margin-bottom: 16px;">
        <span style="background: #6B4FBB; color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">
          ${badge}
        </span>
        <h3 style="color: #1E1040; margin: 10px 0 6px 0; font-size: 16px;">${item.name}</h3>
        
        ${hasFile ? `
          <div style="color: #6B6280; font-size: 12px; margin: 6px 0 10px 0; background: #ffffff; padding: 10px; border-radius: 10px; border: 1px solid #EDE9FF;">
            <strong style="color: #4A3490;">📎 Documentos adjuntos en este correo:</strong>
            <ul style="margin: 4px 0 0 0; padding-left: 20px; color: #1E1040;">
              ${fileNames.map(name => `<li style="margin-bottom: 2px;"><strong>${name}</strong></li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${hasGpt ? `
          <div style="margin-top: 10px;">
            ${gptUrls.map((url, i) => `
              <a href="${url}" target="_blank" style="display: inline-block; background: #E8607A; color: white; text-decoration: none; font-weight: 800; font-size: 13px; padding: 10px 16px; border-radius: 12px; margin-right: 6px; margin-top: 4px;">
                Acceder a Asistente GPT ${gptUrls.length > 1 ? (i + 1) : ''} →
              </a>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FDF5FF; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 32px; border: 2px solid #EDE9FF; box-shadow: 0 4px 20px rgba(107, 79, 187, 0.08);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4A3490; font-size: 28px; font-weight: 900; margin: 0;">La Profe <span style="color: #E8607A;">GPT</span></h1>
          <p style="color: #6B6280; font-size: 14px; font-weight: 600; margin-top: 4px;">Confirmación de Compra y Entrega de Productos Digitales</p>
        </div>

        <p style="color: #1E1040; font-size: 15px; font-weight: 700;">¡Hola ${customerName || 'Docente'}!</p>
        <p style="color: #6B6280; font-size: 14px; line-height: 1.6;">
          ¡Muchas gracias por tu compra! Tu pago ha sido verificado con éxito en Flow.cl. A continuación encuentras tus accesos y materiales de estudio:
        </p>

        <!-- Lista de Recursos -->
        <div style="margin: 24px 0;">
          ${itemsHtml}
        </div>

        <div style="background: #FFF0F3; border-radius: 16px; padding: 16px; text-align: center; margin-top: 24px;">
          <p style="color: #B5194A; font-size: 12px; font-weight: 700; margin: 0;">
            💡 Guarda este correo para consultar tus recursos y archivos adjuntos en cualquier momento.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #EDE9FF; margin: 32px 0 16px 0;" />

        <p style="color: #6B6280; font-size: 11px; text-align: center; margin: 0;">
          © 2026 La Profe GPT | Si tienes cualquier duda, escríbenos a <a href="mailto:contacto@laprofegpt.cl" style="color: #6B4FBB; font-weight: 700;">contacto@laprofegpt.cl</a>
        </p>

      </div>
    </body>
    </html>
  `;

  try {
    const payload: any = {
      from: fromEmail || 'La Profe GPT <ventas@laprofegpt.cl>',
      to: [toEmail],
      subject: '✨ Tus Accesos y Recursos Educativos - La Profe GPT',
      html: htmlBody
    };

    if (emailAttachments.length > 0) {
      payload.attachments = emailAttachments;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`[EmailService] Correo enviado exitosamente a ${toEmail} con ${emailAttachments.length} adjunto(s).`);
      return true;
    } else {
      const errText = await response.text();
      console.error('[EmailService] Error enviando correo vía Resend API:', errText);
      return false;
    }
  } catch (err) {
    console.error('[EmailService] Excepción al enviar correo:', err);
    return false;
  }
}
