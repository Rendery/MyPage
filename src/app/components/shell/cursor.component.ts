import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { MotionService } from '../../services/motion.service';

/** Cursor personalizado (solo con mouse): punto + anillo que crece y muestra etiquetas `data-cursor`. */
@Component({
  selector: 'app-cursor',
  template: `
    <div class="ring" #ring aria-hidden="true"><span class="label mono" #label></span></div>
    <div class="dot" #dot aria-hidden="true"></div>
  `,
  styles: `
    :host { display: contents; }
    .dot, .ring {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9998;
      pointer-events: none;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .dot {
      width: 8px;
      height: 8px;
      margin: -4px 0 0 -4px;
      background: var(--lime);
    }
    .ring {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      margin: -20px 0 0 -20px;
      border: 1.5px solid color-mix(in srgb, var(--text) 45%, transparent);
      transition: opacity 0.3s, width 0.35s var(--ease-out), height 0.35s var(--ease-out), margin 0.35s var(--ease-out),
        background-color 0.3s, border-color 0.3s;
    }
    .label {
      font-size: 10.5px;
      font-weight: 700;
      color: var(--on-lime);
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s;
    }
    :host(.visible) .dot, :host(.visible) .ring { opacity: 1; }
    :host(.hover) .ring {
      width: 60px;
      height: 60px;
      margin: -30px 0 0 -30px;
      border-color: var(--lime);
    }
    :host(.labeled) .ring {
      width: 84px;
      height: 84px;
      margin: -42px 0 0 -42px;
      background: var(--lime);
      border-color: var(--lime);
    }
    :host(.labeled) .label { opacity: 1; }
    :host(.labeled) .dot { opacity: 0; }
    :host(.down) .ring { scale: 0.8; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursorComponent {
  private dot = viewChild.required<ElementRef<HTMLElement>>('dot');
  private ring = viewChild.required<ElementRef<HTMLElement>>('ring');
  private label = viewChild.required<ElementRef<HTMLElement>>('label');

  constructor() {
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const motion = inject(MotionService);
    const zone = inject(NgZone);
    let off: (() => void) | undefined;

    afterNextRender(() => {
      if (!motion.finePointer || motion.reduced) return;
      document.documentElement.classList.add('has-custom-cursor');

      zone.runOutsideAngular(() => {
        const dot = this.dot().nativeElement;
        const ring = this.ring().nativeElement;
        const label = this.label().nativeElement;
        const dx = gsap.quickTo(dot, 'x', { duration: 0.08 });
        const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
        const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
        const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

        const move = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return;
          host.classList.add('visible');
          dx(e.clientX);
          dy(e.clientY);
          rx(e.clientX);
          ry(e.clientY);
        };
        const over = (e: Event) => {
          const t = e.target as HTMLElement;
          const labeled = t.closest<HTMLElement>('[data-cursor]');
          const interactive = t.closest('a, button, input, textarea, select, label, [role="button"], [role="tab"], [role="option"]');
          host.classList.toggle('labeled', !!labeled);
          host.classList.toggle('hover', !labeled && !!interactive);
          if (labeled) label.textContent = labeled.dataset['cursor'] ?? '';
        };
        const leave = () => host.classList.remove('visible');
        const down = () => host.classList.add('down');
        const up = () => host.classList.remove('down');

        addEventListener('pointermove', move, { passive: true });
        document.addEventListener('pointerover', over, { passive: true });
        document.documentElement.addEventListener('pointerleave', leave);
        addEventListener('pointerdown', down);
        addEventListener('pointerup', up);
        off = () => {
          removeEventListener('pointermove', move);
          document.removeEventListener('pointerover', over);
          document.documentElement.removeEventListener('pointerleave', leave);
          removeEventListener('pointerdown', down);
          removeEventListener('pointerup', up);
          document.documentElement.classList.remove('has-custom-cursor');
        };
      });
    });

    inject(DestroyRef).onDestroy(() => off?.());
  }
}
