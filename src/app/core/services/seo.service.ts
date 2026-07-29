import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  private defaultConfig: SeoConfig = {
    title: 'La Profe GPT | Portafolio Docente 2026, ECEP y Dossier CPEIP',
    description: 'La Profe GPT ofrece asistentes virtuales con IA, dossiers descargables y biblioteca de materiales para docentes de Chile que preparan el Portafolio Docente 2026 y la Prueba ECEP.',
    keywords: 'Portafolio Docente 2026, ECEP 2026, La Profe GPT, CPEIP, Evaluación Docente Chile, Dossier ECEP, Educación Básica, Educación Media, Educación Parvularia, Diferencial PIE',
    url: 'https://laprofegpt.cl/',
    image: 'https://laprofegpt.cl/assets/images/og-image.jpg'
  };

  updateSeo(config: Partial<SeoConfig> = {}) {
    const fullConfig: SeoConfig = { ...this.defaultConfig, ...config };

    // Título de la página
    this.titleService.setTitle(fullConfig.title);

    // Meta tags estándar
    this.metaService.updateTag({ name: 'description', content: fullConfig.description });
    if (fullConfig.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: fullConfig.keywords });
    }

    // Open Graph (Facebook, WhatsApp, LinkedIn)
    this.metaService.updateTag({ property: 'og:title', content: fullConfig.title });
    this.metaService.updateTag({ property: 'og:description', content: fullConfig.description });
    this.metaService.updateTag({ property: 'og:url', content: fullConfig.url || this.defaultConfig.url! });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'La Profe GPT' });
    this.metaService.updateTag({ property: 'og:locale', content: 'es_CL' });
    if (fullConfig.image) {
      this.metaService.updateTag({ property: 'og:image', content: fullConfig.image });
    }

    // Twitter Cards
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullConfig.title });
    this.metaService.updateTag({ name: 'twitter:description', content: fullConfig.description });
    if (fullConfig.image) {
      this.metaService.updateTag({ name: 'twitter:image', content: fullConfig.image });
    }
  }
}
