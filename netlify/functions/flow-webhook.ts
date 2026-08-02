import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import 'dotenv/config';
import { signFlowParams } from './shared/flow-client';
import { PRIVATE_DIGITAL_VAULT, PrivateAsset } from './shared/private-vault';
import { sendDigitalDeliveryEmail } from './shared/email-service';

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Flow envía el token vía POST x-www-form-urlencoded
  let token = '';

  if (event.httpMethod === 'POST' && event.body) {
    const params = new URLSearchParams(event.body);
    token = params.get('token') || '';
  } else if (event.queryStringParameters) {
    token = event.queryStringParameters['token'] || '';
  }

  if (!token) {
    return { statusCode: 400, body: 'Token faltante' };
  }

  try {
    const apiKey = process.env['FLOW_API_KEY'] || 'sandbox_key_demo';
    const secretKey = process.env['FLOW_SECRET_KEY'] || 'sandbox_secret_demo';
    const flowApiUrl = process.env['FLOW_API_URL'] || 'https://sandbox.flow.cl/api';
    const resendApiKey = process.env['RESEND_API_KEY'] || '';
    const emailFrom = process.env['EMAIL_FROM'] || 'La Profe GPT <ventas@laprofegpt.cl>';

    // Firmar consulta de estado
    const paramsToSign = { apiKey, token };
    const signature = signFlowParams(paramsToSign, secretKey);

    const checkUrl = `${flowApiUrl}/payment/getStatus?apiKey=${apiKey}&token=${token}&s=${signature}`;
    const statusRes = await fetch(checkUrl);
    const statusData = await statusRes.json() as {
      status?: number; // 2 = PAID, 3 = REJECTED, 4 = CANCELED
      payer?: string;
      optional?: string;
      commerceOrder?: string;
    };

    console.log('[FlowWebhook] Estado de pago recibido:', statusData);

    // Si la transacción está PAGADA (status == 2)
    if (statusData.status === 2) {
      let customerEmail = statusData.payer || '';
      let customerName = 'Docente';
      let purchasedItems: PrivateAsset[] = [];

      // Parsear metadata opcional si existe
      if (statusData.optional) {
        try {
          const opt = JSON.parse(statusData.optional);
          if (opt.email) customerEmail = opt.email;
          if (opt.name) customerName = opt.name;
          if (opt.items && Array.isArray(opt.items)) {
            for (const rawItem of opt.items) {
              const [productId] = String(rawItem).split(':');
              const asset = PRIVATE_DIGITAL_VAULT[productId];
              if (asset) {
                purchasedItems.push(asset);
              }
            }
          }
        } catch (e) {
          console.warn('[FlowWebhook] No se pudo parsear optional data:', e);
        }
      }

      // Si no pudimos extraer los ítems desde la metadata opcional, fallback de seguridad
      if (purchasedItems.length === 0) {
        console.warn('[FlowWebhook] Advertencia: No se encontraron ítems específicos en optional data.');
      }

      // Enviar correo transaccional automático
      if (customerEmail && purchasedItems.length > 0) {
        await sendDigitalDeliveryEmail(
          resendApiKey,
          emailFrom,
          customerEmail,
          customerName,
          purchasedItems
        );
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Pago verificado y correo de entrega despachado exitosamente.' })
      };
    } else {
      console.log(`[FlowWebhook] Orden ${statusData.commerceOrder} en estado no pagado: ${statusData.status}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Notificación recibida (Estado no pagado).' })
      };
    }

  } catch (err: any) {
    console.error('[FlowWebhook] Excepción procesando webhook:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Error en servidor de webhook' })
    };
  }
};
