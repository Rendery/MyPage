import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ES, { Content } from './es';
import EN from './en';
import PT from './pt';

export type Lang = 'es' | 'en' | 'pt';

export const LANGS: { id: Lang; short: string; name: string; locale: string; html: string }[] = [
  { id: 'es', short: 'ES', name: 'Español', locale: 'es-PE', html: 'es' },
  { id: 'en', short: 'EN', name: 'English', locale: 'en-US', html: 'en' },
  { id: 'pt', short: 'PT', name: 'Português (BR)', locale: 'pt-BR', html: 'pt-BR' },
];

const CONTENT: Record<Lang, Content> = { es: ES, en: EN, pt: PT };

function parseLang(value: string | null | undefined): Lang | null {
  const v = (value ?? '').toLowerCase();
  if (v.startsWith('pt') || v === 'br') return 'pt';
  if (v.startsWith('en')) return 'en';
  if (v.startsWith('es')) return 'es';
  return null;
}

/**
 * Idioma de la web en tiempo de ejecución (español, inglés y portugués de Brasil).
 * Se elige con ?lang=en|pt|es, se recuerda en el navegador y, si no, se toma del idioma del navegador.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private zone = inject(NgZone);

  readonly langs = LANGS;
  readonly lang = signal<Lang>('es');
  /** Todos los textos del idioma actual. */
  readonly c = computed(() => CONTENT[this.lang()]);
  readonly meta = computed(() => LANGS.find((l) => l.id === this.lang())!);

  private monthFormat = computed(() => new Intl.DateTimeFormat(this.meta().locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }));

  constructor() {
    const fromUrl = parseLang(new URLSearchParams(location.search).get('lang'));
    let stored: Lang | null = null;
    try {
      stored = parseLang(localStorage.getItem('ea-lang'));
    } catch {
      /* sin almacenamiento */
    }
    const fromBrowser = navigator.languages?.map((l) => parseLang(l)).find(Boolean) ?? null;
    this.apply(fromUrl ?? stored ?? fromBrowser ?? 'es');
  }

  set(lang: Lang): void {
    if (lang === this.lang()) return;
    this.apply(lang);
    try {
      localStorage.setItem('ea-lang', lang);
    } catch {
      /* sin almacenamiento */
    }
    // Los textos cambian de largo: se recalculan las posiciones de las animaciones de scroll.
    setTimeout(() => this.zone.runOutsideAngular(() => ScrollTrigger.refresh()), 80);
  }

  /** Nombre de una tecnología o etiqueta en el idioma actual (la mayoría no cambia). */
  term(name: string): string {
    return this.c().terms[name] ?? name;
  }

  /** "2024-06" → "jun. 2024" / "Jun 2024" / "jun. de 2024". */
  month(iso: string): string {
    const [y, m] = iso.split('-').map(Number);
    return this.monthFormat().format(new Date(Date.UTC(y, m - 1, 1)));
  }

  private apply(lang: Lang): void {
    this.lang.set(lang);
    const meta = LANGS.find((l) => l.id === lang)!;
    const content = CONTENT[lang];
    document.documentElement.lang = meta.html;
    document.title = content.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.meta.description);
  }
}
