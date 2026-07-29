export interface AttachmentItem {
  path: string;     // Ruta del archivo protegido en el backend (ej: 'assets/documents/guia.pdf')
  fileName: string; // Nombre del archivo adjunto al enviar por correo (ej: 'Guia_2026.pdf')
}

export interface PrivateAsset {
  id: string;
  name: string;
  digitalType?: 'gpt_url' | 'pdf_download' | 'file_attachment' | 'hybrid';
  digitalUrl?: string;          // URL individual (Legacy)
  digitalUrls?: string[];       // Array de múltiples URLs de Custom GPTs
  attachmentPath?: string;      // Ruta individual (Legacy)
  fileName?: string;            // Nombre individual (Legacy)
  attachments?: AttachmentItem[]; // Array de múltiples archivos adjuntos (PDF/Word/Docs)
}

export const PRIVATE_DIGITAL_VAULT: Record<string, PrivateAsset> = {
  // PORTAFOLIO DOCENTE 2026
  'portafolio-basica-2026': {
    id: 'portafolio-basica-2026',
    name: 'Asistente Portafolio Educación Básica 2026',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-portafolio-basica-2026'
  },
  'portafolio-media-2026': {
    id: 'portafolio-media-2026',
    name: 'Asistente Portafolio Educación Media 2026',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-portafolio-media-2026'
  },
  'portafolio-diferencial-pie-2026': {
    id: 'portafolio-diferencial-pie-2026',
    name: 'Asistente Portafolio Diferencial PIE 2026',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-portafolio-pie-2026'
  },
  'portafolio-escuela-especial-2026': {
    id: 'portafolio-escuela-especial-2026',
    name: 'Asistente Portafolio Diferencial Escuela Especial 2026',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-portafolio-escuela-especial-2026'
  },
  'portafolio-parvularia-2026': {
    id: 'portafolio-parvularia-2026',
    name: 'Asistente Portafolio Educación Parvularia 2026',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-portafolio-parvularia-2026'
  },
  'portafolio-tecnico-profesional-2026': {
    id: 'portafolio-tecnico-profesional-2026',
    name: 'Asistente Portafolio Técnico Profesional 2026',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-portafolio-tp-2026'
  },

  // ECEP 2026
  'ecep-basica-2026': {
    id: 'ecep-basica-2026',
    name: 'Asistente ECEP Evaluación Docente 2026 Básica',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-basica-2026'
  },
  'ecep-matematica-2ciclo': {
    id: 'ecep-matematica-2ciclo',
    name: 'Asistente ECEP Matemática Segundo Ciclo',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-matematica-2ciclo'
  },
  'ecep-lenguaje-2ciclo': {
    id: 'ecep-lenguaje-2ciclo',
    name: 'Asistente ECEP Lenguaje y Comunicación Segundo Ciclo',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-lenguaje-2ciclo'
  },
  'ecep-basica-generalista': {
    id: 'ecep-basica-generalista',
    name: 'Asistente ECEP 2026 Educación Básica Generalista',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-basica-generalista'
  },
  'ecep-ciencias-2ciclo': {
    id: 'ecep-ciencias-2ciclo',
    name: 'Asistente ECEP Ciencias Naturales Segundo Ciclo',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-ciencias-2ciclo'
  },
  'ecep-parvularia-2026': {
    id: 'ecep-parvularia-2026',
    name: 'Asistente ECEP 2026 Educación Parvularia',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-parvularia-2026'
  },
  'ecep-educacion-fisica': {
    id: 'ecep-educacion-fisica',
    name: 'Asistente ECEP Educación Física Básica y Media',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-ed-fisica'
  },
  'ecep-historia': {
    id: 'ecep-historia',
    name: 'Asistente ECEP 2026 Historia y Ciencias Sociales',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-historia'
  },
  'ecep-diferencial-visual-auditiva': {
    id: 'ecep-diferencial-visual-auditiva',
    name: 'Asistente ECEP Educación Diferencial Discapacidad Visual y Auditiva',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-visual-auditiva'
  },
  'ecep-diferencial-di-tea-dm': {
    id: 'ecep-diferencial-di-tea-dm',
    name: 'Asistente ECEP Educación Diferencial DI, TEA y DM',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-di-tea-dm'
  },
  'ecep-diferencial-dea-tel': {
    id: 'ecep-diferencial-dea-tel',
    name: 'Asistente ECEP Educación Diferencial DEA y TEL',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-dea-tel'
  },
  'ecep-ingles': {
    id: 'ecep-ingles',
    name: 'Asistente ECEP Inglés Primer y Segundo Ciclo',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-ingles'
  },
  'ecep-tecnico-profesional': {
    id: 'ecep-tecnico-profesional',
    name: 'Asistente ECEP Técnico-Profesional',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-tp'
  },
  'ecep-artes-musica': {
    id: 'ecep-artes-musica',
    name: 'Asistente ECEP Artes Visuales y Música Segundo Ciclo',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-artes-musica'
  },
  'ecep-ciencias-media': {
    id: 'ecep-ciencias-media',
    name: 'Asistente ECEP Ciencias Media Biología, Física y Química',
    digitalType: 'gpt_url',
    digitalUrl: 'https://chatgpt.com/g/g-ecep-ciencias-media'
  },

  // DOSSIERS
  'dossier-ecep-basica-generalista': {
    id: 'dossier-ecep-basica-generalista',
    name: 'Dossier ECEP 2026 – Básica Generalista',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-basica-generalista/view'
  },
  'dossier-ecep-parvularia': {
    id: 'dossier-ecep-parvularia',
    name: 'Dossier ECEP 2026 – Educación Parvularia',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-parvularia/view'
  },
  'dossier-ecep-diferencial-dea-tel': {
    id: 'dossier-ecep-diferencial-dea-tel',
    name: 'Dossier ECEP 2026 – Diferencial DEA y TEL',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-dea-tel/view'
  },
  'dossier-ecep-diferencial-di-tea-dm': {
    id: 'dossier-ecep-diferencial-di-tea-dm',
    name: 'Dossier ECEP 2026 – Diferencial DI, TEA, Disfasia y DM',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-di-tea-dm/view'
  },
  'dossier-ecep-diferencial-visual-auditiva': {
    id: 'dossier-ecep-diferencial-visual-auditiva',
    name: 'Dossier ECEP 2026 – Diferencial Visual y Auditiva',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-visual-auditiva/view'
  },
  'dossier-ecep-lenguaje-basica': {
    id: 'dossier-ecep-lenguaje-basica',
    name: 'Dossier ECEP Lenguaje y Comunicación Educación Básica',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-lenguaje-basica/view'
  },
  'dossier-ecep-lengua-literatura': {
    id: 'dossier-ecep-lengua-literatura',
    name: 'Dossier ECEP 2026 – Lengua y Literatura',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-lengua-literatura/view'
  },
  'dossier-ecep-matematica-basica': {
    id: 'dossier-ecep-matematica-basica',
    name: 'Dossier ECEP 2026 – Matemática Educación Básica',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-matematica-basica/view'
  },
  'dossier-ecep-biologia': {
    id: 'dossier-ecep-biologia',
    name: 'Dossier ECEP 2026 – Biología',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-biologia/view'
  },
  'dossier-ecep-quimica': {
    id: 'dossier-ecep-quimica',
    name: 'Dossier ECEP 2026 – Química',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-quimica/view'
  },
  'dossier-ecep-ciencias-naturales-basica': {
    id: 'dossier-ecep-ciencias-naturales-basica',
    name: 'Dossier ECEP Ciencias Naturales Educación Básica',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-ciencias-basica/view'
  },
  'dossier-ecep-ingles-basica': {
    id: 'dossier-ecep-ingles-basica',
    name: 'Dossier ECEP Inglés Educación Básica',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-ingles-basica/view'
  },
  'dossier-ecep-educacion-fisica-basica': {
    id: 'dossier-ecep-educacion-fisica-basica',
    name: 'Dossier ECEP Educación Física Educación Básica',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-ed-fisica-basica/view'
  },
  'dossier-ecep-educacion-fisica-media': {
    id: 'dossier-ecep-educacion-fisica-media',
    name: 'Dossier ECEP Educación Física Educación Media',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-ed-fisica-media/view'
  },
  'dossier-ecep-historia-basica': {
    id: 'dossier-ecep-historia-basica',
    name: 'Dossier ECEP 2026 Educación Básica Historia',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-historia-basica/view'
  },
  'dossier-ecep-matematica-media': {
    id: 'dossier-ecep-matematica-media',
    name: 'Dossier ECEP 2026 Media Matemática',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/dossier-matematica-media/view'
  },

  // BIBLIOTECA
  'biblioteca-profe-gpt': {
    id: 'biblioteca-profe-gpt',
    name: 'Biblioteca de la Profe GPT',
    digitalType: 'pdf_download',
    digitalUrl: 'https://drive.google.com/file/d/biblioteca-profe-gpt/view'
  }
};
