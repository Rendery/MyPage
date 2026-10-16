import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>((document.documentElement.getAttribute('data-theme') as Theme) || 'dark');
  readonly rainbow = signal(false);

  /** Cambia el tema con una transición circular desde el punto donde se hizo clic (si el navegador la soporta). */
  toggle(origin?: { x: number; y: number }): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    const doc = document as ViewTransitionDoc;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || reduced) {
      this.apply(next);
      return;
    }

    const x = origin?.x ?? innerWidth / 2;
    const y = origin?.y ?? 0;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = doc.startViewTransition(() => this.apply(next));
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  }

  toggleRainbow(): void {
    const on = !this.rainbow();
    this.rainbow.set(on);
    document.documentElement.setAttribute('data-rainbow', String(on));
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('ea-theme', theme);
    } catch {
      /* almacenamiento bloqueado: el tema vale solo para esta visita */
    }
  }
}
