import { Injectable, NgZone, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

/** Scroll suave (Lenis) sincronizado con GSAP/ScrollTrigger, y helpers de navegación. */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private zone = inject(NgZone);
  private lenis?: Lenis;
  private scrollListeners = new Set<(velocity: number, progress: number) => void>();

  readonly reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  /** Se activa cuando termina la intro de carga: el hero arranca su animación de entrada. */
  readonly introDone = signal(false);

  init(): void {
    document.documentElement.classList.add('js-motion');
    // La intro y el hero siempre arrancan arriba; el ancla de la URL se aplica al terminar la intro.
    history.scrollRestoration = 'manual';
    scrollTo(0, 0);
    if (this.reduced) return;

    this.zone.runOutsideAngular(() => {
      this.lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false });
      this.lenis.on('scroll', (l: Lenis) => {
        ScrollTrigger.update();
        this.scrollListeners.forEach((fn) => fn(l.velocity, l.progress));
      });
      gsap.ticker.add((time) => this.lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    });
  }

  /** Recibe velocidad y progreso de scroll (fuera de la zona de Angular). Devuelve la función para desuscribirse. */
  onScroll(fn: (velocity: number, progress: number) => void): () => void {
    this.scrollListeners.add(fn);
    if (!this.lenis) {
      const native = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        fn(0, max > 0 ? scrollY / max : 0);
      };
      addEventListener('scroll', native, { passive: true });
      return () => {
        this.scrollListeners.delete(fn);
        removeEventListener('scroll', native);
      };
    }
    return () => this.scrollListeners.delete(fn);
  }

  scrollTo(target: string | number | HTMLElement, offset = -8): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, { offset, duration: 1.4 });
      return;
    }
    if (typeof target === 'number') {
      scrollTo({ top: target, behavior: this.reduced ? 'auto' : 'smooth' });
      return;
    }
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: this.reduced ? 'auto' : 'smooth' });
  }

  /** Bloquea el scroll del fondo (modales, paleta de comandos). */
  lock(locked: boolean): void {
    if (this.lenis) {
      locked ? this.lenis.stop() : this.lenis.start();
    }
    document.documentElement.style.overflow = locked ? 'hidden' : '';
  }

  refresh(): void {
    ScrollTrigger.refresh();
  }
}
