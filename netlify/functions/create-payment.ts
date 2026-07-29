import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { signFlowParams } from './shared/flow-client';

interface RequestItem {
  productId: string;
  quantity: number;
}

// Precios de servidor validados
const PUBLIC_PRICES: Record<string, number> = {
  'portafolio-basica-2026': 18000,
  'portafolio-media-2026': 18000,
  'portafolio-diferencial-pie-2026': 18000,
  'portafolio-escuela-especial-2026': 18000,
  'portafolio-parvularia-2026': 18000,
  'portafolio-tecnico-profesional-2026': 18000,
  'ecep-basica-2026': 18000,
  'ecep-matematica-2ciclo': 18000,
  'ecep-lenguaje-2ciclo': 18000,
  'ecep-basica-generalista': 18000,
  'ecep-ciencias-2ciclo': 18000,
  'ecep-parvularia-2026': 18000,
  'ecep-educacion-fisica': 18000,
  'ecep-historia': 18000,
  'ecep-diferencial-visual-auditiva': 18000,
  'ecep-diferencial-di-tea-dm': 18000,
  'ecep-diferencial-dea-tel': 18000,
  'ecep-ingles': 18000,
  'ecep-tecnico-profesional': 18000,
  'ecep-artes-musica': 18000,
  'ecep-ciencias-media': 18000,
  'dossier-ecep-basica-generalista': 15000,
  'dossier-ecep-parvularia': 15000,
  'dossier-ecep-diferencial-dea-tel': 15000,
  'dossier-ecep-diferencial-di-tea-dm': 15000,
  'dossier-ecep-diferencial-visual-auditiva': 15000,
  'dossier-ecep-lenguaje-basica': 15000,
  'dossier-ecep-lengua-literatura': 15000,
  'dossier-ecep-matematica-basica': 15000,
  'dossier-ecep-biologia': 15000,
  'dossier-ecep-quimica': 15000,
  'dossier-ecep-ciencias-naturales-basica': 15000,
  'dossier-ecep-ingles-basica': 15000,
  'dossier-ecep-educacion-fisica-basica': 15000,
  'dossier-ecep-educacion-fisica-media': 15000,
  'dossier-ecep-historia-basica': 15000,
  'dossier-ecep-matematica-media': 15000,
  'biblioteca-profe-gpt': 5000
};

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 45, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { customerEmail, customerName, items } = body as {
      customerEmail: string;
      customerName?: string;
      items: RequestItem[];
    };

    if (!customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan parámetros requeridos: customerEmail e items.' })
      };
    }

    // Calcular el total seguro en el servidor
    let totalAmount = 0;
    const itemIds: string[] = [];

    for (const item of items) {
      const price = PUBLIC_PRICES[item.productId] || 0;
      totalAmount += price * item.quantity;
      itemIds.push(`${item.productId}:${item.quantity}`);
    }

    if (totalAmount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Monto total de orden inválido.' })
      };
    }

    // Leer llaves de entorno de Netlify
    const apiKey = process.env['FLOW_API_KEY'] || 'sandbox_key_demo';
    const secretKey = process.env['FLOW_SECRET_KEY'] || 'sandbox_secret_demo';
    const flowApiUrl = process.env['FLOW_API_URL'] || 'https://sandbox.flow.cl/api';
    const siteUrl = process.env['SITE_URL'] || 'http://localhost:8888';

    const commerceOrder = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const urlConfirmation = `${siteUrl}/api/flow-webhook`;
    const urlReturn = `${siteUrl}/pago-estado`;

    // Guardar metadata en opcional (ej: email y lista de productos para el webhook)
    const optionalData = JSON.stringify({
      email: customerEmail,
      name: customerName || '',
      items: itemIds
    });

    const flowParams: Record<string, any> = {
      apiKey,
      commerceOrder,
      subject: `La Profe GPT - Orden ${commerceOrder}`,
      currency: 'CLP',
      amount: totalAmount,
      email: customerEmail,
      urlConfirmation,
      urlReturn,
      optional: optionalData
    };

    // Generar firma HMAC-SHA256
    const signature = signFlowParams(flowParams, secretKey);

    // Preparar formData para enviarlo a Flow
    const formData = new URLSearchParams();
    for (const key of Object.keys(flowParams)) {
      formData.append(key, String(flowParams[key]));
    }
    formData.append('s', signature);

    // Invocar API de Flow /payment/create
    const flowRes = await fetch(`${flowApiUrl}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const flowData = await flowRes.json() as { url?: string; token?: string; flowOrder?: number; code?: number; message?: string };

    if (flowData.url && flowData.token) {
      const redirectUrl = `${flowData.url}?token=${flowData.token}`;
      return {
        statusCode: 200,
        body: JSON.stringify({
          redirectUrl,
          flowToken: flowData.token,
          commerceOrder
        })
      };
    } else {
      console.error('[CreatePayment] Error desde Flow API:', flowData);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: flowData.message || 'Error al comunicarse con Flow.cl',
          flowCode: flowData.code
        })
      };
    }

  } catch (err: any) {
    console.error('[CreatePayment] Excepción:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Error interno del servidor' })
    };
  }
};
