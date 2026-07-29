import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, password } = body;

    const adminEmail = process.env['ADMIN_EMAIL'] || 'admin@laprofegpt.cl';
    const adminPassword = process.env['ADMIN_PASSWORD'] || 'ProfeAdmin2026!';

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email y contraseña requeridos' })
      };
    }

    if (email.trim().toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      // Simular Token JWT de administración seguro
      const mockToken = Buffer.from(`${email}:${Date.now()}:admin_session_valid`).toString('base64');
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          token: mockToken,
          user: {
            email: adminEmail,
            role: 'Administrator',
            name: 'La Profe GPT Admin'
          }
        })
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' })
      };
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Error de autenticación' })
    };
  }
};
