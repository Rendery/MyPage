import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, computed, inject, input, signal } from '@angular/core';

export type AvatarPose = 'hero' | 'pointing' | 'coding' | 'celebrate';

let uid = 0;

/**
 * Mi personaje de cuerpo completo.
 * Usa /images/avatar/{pose}.png (generada con ChatGPT, ver docs/PROMPTS-IMAGENES.md);
 * si aún no existe, dibuja un personaje vectorial equivalente.
 */
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"pose-" + pose()', '[class.is-image]': 'state() === "ok"' },
})
export class AvatarComponent {
  readonly pose = input<AvatarPose>('hero');
  /** La cabeza/cuerpo sigue al puntero. */
  readonly track = input(false);
  readonly alt = input('Edery Abanto de cuerpo completo');

  readonly state = signal<'loading' | 'ok' | 'missing'>('loading');
  /** Primero la versión WebP liviana (scripts/optimize_avatars.py); si no existe, el PNG original. */
  private readonly format = signal<'webp' | 'png'>('webp');
  readonly src = computed(() => `/images/avatar/${this.pose()}.${this.format()}`);
  readonly pid = `chk-${++uid}`;

  /** Referencia a un gradiente propio de esta instancia (los ids del SVG deben ser únicos en la página). */
  f(key: string): string {
    return `url(#${this.pid}-${key})`;
  }

  onError(): void {
    if (this.format() === 'webp') this.format.set('png');
    else this.state.set('missing');
  }

  constructor() {
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const zone = inject(NgZone);
    let off: (() => void) | undefined;

    afterNextRender(() => {
      if (!this.track() || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      zone.runOutsideAngular(() => {
        let tx = 0;
        let ty = 0;
        let cx = 0;
        let cy = 0;
        let raf = 0;
        const loop = () => {
          cx += (tx - cx) * 0.08;
          cy += (ty - cy) * 0.08;
          host.style.setProperty('--hx', cx.toFixed(3));
          host.style.setProperty('--hy', cy.toFixed(3));
          raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
        };
        const move = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)));
          ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.2)) / (innerHeight / 2)));
          if (!raf) raf = requestAnimationFrame(loop);
        };
        addEventListener('pointermove', move, { passive: true });
        off = () => {
          removeEventListener('pointermove', move);
          cancelAnimationFrame(raf);
        };
      });
    });

    inject(DestroyRef).onDestroy(() => off?.());
  }
}
