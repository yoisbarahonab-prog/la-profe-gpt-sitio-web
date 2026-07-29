import * as crypto from 'crypto';

export interface FlowCreatePaymentParams {
  apiKey: string;
  commerceOrder: string;
  subject: string;
  currency: string;
  amount: number;
  email: string;
  urlConfirmation: string;
  urlReturn: string;
  optional?: string;
}

/**
 * Ordena alfabéticamente las claves y genera la firma HMAC-SHA256 exigida por Flow.cl
 */
export function signFlowParams(params: Record<string, any>, secretKey: string): string {
  const keys = Object.keys(params).sort();
  let toSign = '';
  for (const key of keys) {
    toSign += `${key}${params[key]}`;
  }
  return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}
