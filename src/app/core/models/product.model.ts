export interface Product {
  id: string;
  name: string;
  category: 'portafolio' | 'ecep' | 'dossier' | 'biblioteca';
  categoryLabel: string;
  priceCLP: number;
  flowToken: string;
  emoji: string;
  description: string;
}

export type CategoryFilter = 'all' | 'portafolio' | 'ecep' | 'dossier' | 'biblioteca';
