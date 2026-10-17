import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UiService } from './ui.service';

export type Mode = 'simple' | 'tecnico';

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

/**
 * Versión de la web: "simple" (sin tecnicismos, para cualquier visitante) o "técnica".
 * Se elige con ?modo=tecnico / ?modo=simple, se recuerda en el navegador y por defecto es simple.
 */
@Injectable({ providedIn: 'root' })
export class ModeService {
  private ui = inject(UiService);
  private zone = inject(NgZone);

  readonly mode = signal<Mode>('simple');
  readonly simple = computed(() => this.mode() === 'simple');
  /** true si el visitante llegó sin elegir modo (para mostrarle cómo cambiarlo). */
  readonly firstVisit: boolean;

  constructor() {
    const fromUrl = new URLSearchParams(location.search).get('modo');
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('ea-mode');
    } catch {
      /* sin almacenamiento */
    }
    const initial = fromUrl === 'tecnico' || fromUrl === 'simple' ? fromUrl : stored === 'tecnico' ? 'tecnico' : 'simple';
    this.firstVisit = !fromUrl && !stored;
    this.apply(initial);
  }

  set(mode: Mode): void {
    if (mode === this.mode()) return;

    // Mantiene en pantalla la misma sección aunque cambie el alto de las de arriba.
    const anchor = document.getElementById(this.ui.activeSection());
    const before = anchor?.getBoundingClientRect().top;

    const swap = () => {
      this.apply(mode);
      try {
        localStorage.setItem('ea-mode', mode);
      } catch {
        /* sin almacenamiento */
      }
    };

    const restore = () => {
      if (anchor?.isConnected && before !== undefined) {
        scrollBy({ top: anchor.getBoundingClientRect().top - before, behavior: 'instant' });
      }
      this.zone.runOutsideAngular(() => ScrollTrigger.refresh());
    };

    const doc = document as ViewTransitionDoc;
    if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doc.startViewTransition(() => {
        swap();
        // Angular pinta el cambio en la siguiente detección; la transición espera a esa promesa.
        return new Promise<void>((resolve) => setTimeout(() => (restore(), resolve()), 30));
      });
    } else {
      swap();
      setTimeout(restore, 30);
    }
  }

  toggle(): void {
    this.set(this.simple() ? 'tecnico' : 'simple');
  }

  private apply(mode: Mode): void {
    this.mode.set(mode);
    document.documentElement.setAttribute('data-mode', mode);
  }
}
