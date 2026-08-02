import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

interface BgShape {
  symbol: string;
  top: string;
  left: string;
  size: string;
  color: string;
  animation: string;
}

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-profe-cream relative overflow-hidden py-10 sm:py-16">

      <!-- Background Floating Shapes -->
      <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <span 
          *ngFor="let shape of bgShapes" 
          [ngClass]="[shape.size, shape.color, shape.animation]"
          [style.top]="shape.top"
          [style.left]="shape.left"
          class="absolute select-none opacity-40">
          {{ shape.symbol }}
        </span>
      </div>

      <div class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-16">

        <!-- ========================================================= -->
        <!-- 1. HERO HEADER                                           -->
        <!-- ========================================================= -->
        <div class="text-center max-w-4xl mx-auto space-y-4">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-profe-purple-light/70 shadow-xs">
            <span class="text-profe-pink font-black text-xs tracking-widest uppercase">
              \ \ Conócenos / /
            </span>
          </div>
          
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-profe-purple-dark tracking-tight leading-tight">
            Transformando la Evaluación Docente en Chile con Inteligencia Artificial.
          </h1>
          
          <p class="text-sm sm:text-lg font-semibold text-profe-muted max-w-2xl mx-auto leading-relaxed">
            Conoce la historia, nuestra misión y los pilares que hacen de <span class="text-profe-pink font-extrabold">La Profe GPT</span> la plataforma preferida por cientos de profesores.
          </p>
        </div>


        <!-- ========================================================= -->
        <!-- 2. NUESTRA HISTORIA (TARJETA PRINCIPAL RECURSO)           -->
        <!-- ========================================================= -->
        <div class="bg-gradient-to-br from-white/95 via-[#FDF5FF]/90 to-[#FFF0F3]/70 backdrop-blur-md rounded-3xl p-8 sm:p-12 lg:p-16 border-2 border-profe-purple-light/70 shadow-xl relative overflow-hidden text-center max-w-5xl mx-auto">
          
          <!-- Elementos decorativos de fondo -->
          <div class="absolute -top-12 -left-12 w-48 h-48 bg-profe-purple-light/40 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-profe-pink-light/60 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Subtítulo -->
          <div class="inline-flex items-center gap-2 mb-3">
            <span class="text-profe-pink font-black text-xs sm:text-sm tracking-widest uppercase">
              \ \ Nuestra historia / /
            </span>
          </div>

          <!-- Título Principal -->
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-profe-purple-dark tracking-tight mb-8">
            Nuestra historia
          </h2>

          <!-- Párrafos descriptivos -->
          <div class="max-w-3xl mx-auto space-y-6 text-sm sm:text-base lg:text-lg font-semibold text-profe-text leading-relaxed mb-10">
            <p>
              Desde 2025 hemos acompañado a cientos de profesoras y profesores de Chile en su proceso de Evaluación Docente. Nacimos con una misión clara: <strong class="font-extrabold text-profe-pink">entregar apoyo pedagógico real</strong>, con herramientas de inteligencia artificial especializadas por nivel y modalidad, para que cada docente pueda preparar su Portafolio con más claridad, menos estrés y sin riesgo de plagio.
            </p>
            <p>
              Sabemos lo que significa enfrentar este proceso sola o solo. Por eso creamos asistentes que conocen el <strong class="font-extrabold text-profe-purple-dark">Marco para la Buena Enseñanza</strong>, interpretan los manuales <strong class="font-extrabold text-profe-purple-dark">CPEIP 2026</strong> y entienden lo que se espera ver en tu evidencia, según tu nivel: <span class="font-extrabold text-profe-purple">Básica, Media, Diferencial o Parvularia</span>.
            </p>
          </div>

          <!-- Grid de Badges / Píldoras -->
          <div class="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
            
            <!-- Badge 1: Apoyando docentes -->
            <div class="bg-white/90 border border-profe-purple-light/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-full px-5 py-2.5 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-[#EDE9FF] text-[#6B4FBB] flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span class="text-xs sm:text-sm font-extrabold text-profe-purple-dark">Apoyando docentes desde 2025</span>
            </div>

            <!-- Badge 2: Alineados al MBE y CPEIP -->
            <div class="bg-white/90 border border-emerald-200 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-full px-5 py-2.5 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span class="text-xs sm:text-sm font-extrabold text-profe-purple-dark">Alineados al MBE y CPEIP</span>
            </div>

            <!-- Badge 3: Sin riesgo de plagio -->
            <div class="bg-white/90 border border-profe-pink-light shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-full px-5 py-2.5 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-[#FFF0F3] text-profe-pink flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-xs sm:text-sm font-extrabold text-profe-purple-dark">Sin riesgo de plagio</span>
            </div>

            <!-- Badge 4: Contexto educativo chileno -->
            <div class="bg-white/90 border border-sky-200 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-full px-5 py-2.5 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-xs sm:text-sm font-extrabold text-profe-purple-dark">Contexto educativo chileno</span>
            </div>

            <!-- Badge 5: Desde el celular -->
            <div class="bg-white/90 border border-amber-200 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-full px-5 py-2.5 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-xs sm:text-sm font-extrabold text-profe-purple-dark">Desde el celular</span>
            </div>

            <!-- Badge 6: Acceso rápido por correo -->
            <div class="bg-white/90 border border-profe-purple-light/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-full px-5 py-2.5 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-[#EDE9FF] text-[#6B4FBB] flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-xs sm:text-sm font-extrabold text-profe-purple-dark">Acceso rápido por correo</span>
            </div>

          </div>

        </div>


        <!-- ========================================================= -->
        <!-- 3. CIFRAS & IMPACTO DE LA PLATAFORMA                     -->
        <!-- ========================================================= -->
        <div class="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div class="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-profe-purple-light/60 text-center shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all">
            <span class="text-3xl sm:text-4xl font-black text-profe-purple block mb-1">+500</span>
            <span class="text-xs sm:text-sm font-bold text-profe-muted">Docentes acompañados en Chile</span>
          </div>

          <div class="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-profe-pink-light/60 text-center shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all">
            <span class="text-3xl sm:text-4xl font-black text-profe-pink block mb-1">100%</span>
            <span class="text-xs sm:text-sm font-bold text-profe-muted">Alineado a CPEIP & MBE 2026</span>
          </div>

          <div class="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-profe-purple-light/60 text-center shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all">
            <span class="text-3xl sm:text-4xl font-black text-[#8B5CF6] block mb-1">0%</span>
            <span class="text-xs sm:text-sm font-bold text-profe-muted">Riesgo de plagio (Apoyo pedagógico)</span>
          </div>

          <div class="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-profe-pink-light/60 text-center shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all">
            <span class="text-3xl sm:text-4xl font-black text-profe-purple-dark block mb-1">24/7</span>
            <span class="text-xs sm:text-sm font-bold text-profe-muted">Acceso extendido hasta abril 2027</span>
          </div>

        </div>


        <!-- ========================================================= -->
        <!-- 4. MISIÓN Y VISIÓN                                        -->
        <!-- ========================================================= -->
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="bg-white/90 backdrop-blur-md rounded-3xl p-8 border-2 border-profe-purple-light/60 shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-[#EDE9FF] text-profe-purple flex items-center justify-center text-xl mb-4 shadow-xs">
                🎯
              </div>
              <h3 class="text-2xl font-black text-profe-purple-dark mb-3">Nuestra Misión</h3>
              <p class="text-sm sm:text-base font-semibold text-profe-muted leading-relaxed">
                Empoderar a las y los docentes de Chile brindándoles herramientas digitales pedagógicas e inteligentes que simplifiquen su trabajo diario, reduzcan el estrés asociado a la Evaluación Docente y fomenten una preparación sólida y ética.
              </p>
            </div>
          </div>

          <div class="bg-white/90 backdrop-blur-md rounded-3xl p-8 border-2 border-profe-pink-light/60 shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-profe-pink flex items-center justify-center text-xl mb-4 shadow-xs">
                🚀
              </div>
              <h3 class="text-2xl font-black text-profe-pink-dark mb-3">Nuestra Visión</h3>
              <p class="text-sm sm:text-base font-semibold text-profe-muted leading-relaxed">
                Convertirnos en el ecosistema digital de referencia pedagógica para la comunidad educativa en Chile, democratizando la innovación tecnológica para que cada profesor disponga de una tutoría accesible, clara y personalizada.
              </p>
            </div>
          </div>

        </div>


        <!-- ========================================================= -->
        <!-- 5. NUESTROS PILARES DE TRABAJO                           -->
        <!-- ========================================================= -->
        <div class="max-w-5xl mx-auto space-y-8">
          <div class="text-center space-y-2">
            <span class="text-profe-pink font-black text-xs tracking-widest uppercase block">
              \ \ ¿Por qué elegirnos? / /
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-profe-purple-dark tracking-tight">
              Los pilares que guían nuestro compromiso docente
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-profe-purple-light/60 shadow-xs hover:shadow-lg transition-all flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#EDE9FF] text-profe-purple flex items-center justify-center flex-shrink-0 text-xl font-bold">
                1
              </div>
              <div>
                <h3 class="font-extrabold text-lg text-profe-purple-dark mb-1">Especialización por Nivel</h3>
                <p class="text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed">
                  Contamos con asistentes configurados para Educación Parvularia, Básica, Media y Diferencial, entendiendo las particularidades de cada contexto.
                </p>
              </div>
            </div>

            <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-profe-pink-light/60 shadow-xs hover:shadow-lg transition-all flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-profe-pink flex items-center justify-center flex-shrink-0 text-xl font-bold">
                2
              </div>
              <div>
                <h3 class="font-extrabold text-lg text-profe-purple-dark mb-1">Rúbricas CPEIP 2026</h3>
                <p class="text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed">
                  Todos nuestros contenidos y orientaciones se basan estrictamente en el Marco para la Buena Enseñanza y manuales oficiales vigentes.
                </p>
              </div>
            </div>

            <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-profe-pink-light/60 shadow-xs hover:shadow-lg transition-all flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-profe-pink flex items-center justify-center flex-shrink-0 text-xl font-bold">
                3
              </div>
              <div>
                <h3 class="font-extrabold text-lg text-profe-purple-dark mb-1">Orientación Ética Anti-Plagio</h3>
                <p class="text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed">
                  Fomentamos el pensamiento crítico del docente. Los asistentes orientan e inspiran, garantizando que el portafolio refleje la voz real del docente.
                </p>
              </div>
            </div>

            <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-profe-purple-light/60 shadow-xs hover:shadow-lg transition-all flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#EDE9FF] text-profe-purple flex items-center justify-center flex-shrink-0 text-xl font-bold">
                4
              </div>
              <div>
                <h3 class="font-extrabold text-lg text-profe-purple-dark mb-1">Acceso Inmediato & Flexible</h3>
                <p class="text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed">
                  Ingresa desde tu celular o computador las 24 horas del día. Tus accesos llegan directamente a tu correo tras realizar el pedido.
                </p>
              </div>
            </div>

          </div>
        </div>


        <!-- ========================================================= -->
        <!-- 6. PREGUNTAS FRECUENTES SOBRE NOSOTROS                    -->
        <!-- ========================================================= -->
        <div class="max-w-4xl mx-auto space-y-8">
          <div class="text-center space-y-2">
            <span class="text-profe-pink font-black text-xs tracking-widest uppercase block">
              \ \ Preguntas Frecuentes / /
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-profe-purple-dark tracking-tight">
              Respuestas a las dudas más comunes
            </h2>
          </div>

          <div class="space-y-4">
            <div 
              *ngFor="let faq of faqs(); let i = index" 
              class="bg-white/90 backdrop-blur-md rounded-2xl border border-profe-purple-light/60 shadow-xs overflow-hidden transition-all">
              
              <button 
                (click)="toggleFaq(i)"
                class="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-sm sm:text-base text-profe-purple-dark hover:text-profe-pink transition-colors">
                <span>{{ faq.question }}</span>
                <span class="text-xl font-extrabold transition-transform duration-300" [class.rotate-45]="faq.isOpen">+</span>
              </button>

              <div 
                *ngIf="faq.isOpen" 
                class="px-5 pb-5 text-xs sm:text-sm font-semibold text-profe-muted leading-relaxed border-t border-profe-purple-light/40 pt-3">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>


        <!-- ========================================================= -->
        <!-- 7. BANNER CTA FINAL                                       -->
        <!-- ========================================================= -->
        <div class="max-w-5xl mx-auto">
          <div class="bg-gradient-to-r from-profe-purple via-[#8B5CF6] to-profe-pink rounded-3xl p-8 sm:p-12 shadow-xl text-center text-white space-y-6 relative overflow-hidden">
            
            <div class="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 class="text-3xl sm:text-4xl font-black leading-tight">
                ¿Lista o listo para potenciar tu Evaluación Docente 2026?
              </h2>
              <p class="text-sm sm:text-base font-bold text-white/90">
                Únete a los cientos de profesores en Chile que ya están preparando sus evidencias con tranquilidad y claridad.
              </p>
              
              <div class="pt-4">
                <a 
                  routerLink="/catalogo"
                  class="inline-flex items-center gap-2 bg-white text-profe-purple-dark hover:bg-profe-pink-light hover:text-profe-pink font-black text-sm sm:text-base py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <span>Ver catálogo de programas</span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  `
})
export class AboutPageComponent {
  private seoService = inject(SeoService);

  bgShapes: BgShape[] = [
    { symbol: '✦', top: '5%', left: '8%', size: 'text-4xl', color: 'text-profe-pink/50', animation: 'animate-sparkle' },
    { symbol: '♡', top: '12%', left: '85%', size: 'text-3xl', color: 'text-profe-purple/35', animation: 'animate-pulse-heart' },
    { symbol: '✨', top: '25%', left: '4%', size: 'text-3xl', color: 'text-profe-pink/40', animation: 'animate-sparkle' },
    { symbol: '♥', top: '45%', left: '92%', size: 'text-4xl', color: 'text-profe-pink/35', animation: 'animate-pulse-heart' },
    { symbol: '✦', top: '70%', left: '6%', size: 'text-5xl', color: 'text-profe-purple/40', animation: 'animate-sparkle' },
    { symbol: '✨', top: '88%', left: '88%', size: 'text-3xl', color: 'text-profe-pink/45', animation: 'animate-sparkle' }
  ];

  faqs = signal<FaqItem[]>([
    {
      question: '¿Qué es La Profe GPT y cómo nació?',
      answer: 'Nacimos en 2025 con el objetivo de acompañar a las y los docentes de Chile en su proceso de Evaluación Docente mediante inteligencia artificial especializada en el currículum y normativas del CPEIP.',
      isOpen: false
    },
    {
      question: '¿Cómo garantizan que no exista riesgo de plagio?',
      answer: 'Nuestros asistentes no redactan automáticamente tus respuestas. Funcionan como tutores pedagógicos que te guían, explican las rúbricas y te orientan sobre cómo estructurar tu propia evidencia de forma auténtica.',
      isOpen: false
    },
    {
      question: '¿Los contenidos están alineados al CPEIP 2026?',
      answer: 'Sí. Todos nuestros asistentes y dossiers están actualizados según el Marco para la Buena Enseñanza y los manuales de portafolio oficiales emitidos por el CPEIP.',
      isOpen: false
    },
    {
      question: '¿Hasta cuándo tendré acceso a los programas adquiridos?',
      answer: 'Tendrás acceso continuo a tus programas y asistentes hasta abril de 2027, permitiéndote consultar los materiales cuantas veces lo necesites.',
      isOpen: false
    }
  ]);

  constructor() {
    this.seoService.updateSeo({
      title: 'Sobre mí | La Profe GPT - Nuestra Historia & Misión',
      description: 'Conoce nuestra historia. Apoyamos a docentes de Chile en su proceso de Evaluación Docente con herramientas de inteligencia artificial alineadas al CPEIP.'
    });
  }

  toggleFaq(index: number) {
    this.faqs.update(items => {
      items[index].isOpen = !items[index].isOpen;
      return [...items];
    });
  }
}
