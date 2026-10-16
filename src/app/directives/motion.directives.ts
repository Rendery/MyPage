import { DestroyRef, Directive, ElementRef, NgZone, afterNextRender, inject, input } from '@angular/core';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { MotionService } from '../services/motion.service';

/**
 * Revela el elemento al entrar en pantalla.
 * `appReveal="stagger"` anima a los hijos directos uno tras otro.
 */
@Directive({ selector: '[appReveal]', host: { 'data-reveal': '' } })
export class RevealDirective {
  readonly mode = input<'up' | 'fade' | 'scale' | 'stagger' | 'left' | 'right' | ''>('up', { alias: 'appReveal' });
  readonly delay = input(0, { alias: 'revealDelay' });

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const motion = inject(MotionService);
    const zone = inject(NgZone);
    let ctx: gsap.Context | undefined;

    afterNextRender(() => {
      if (motion.reduced) {
        el.style.opacity = '1';
        return;
      }
      zone.runOutsideAngular(() => {
        ctx = gsap.context(() => {
          const mode = this.mode() || 'up';
          const trigger = { trigger: el, start: 'top 88%', once: true };
          const base = { duration: 1.1, ease: 'expo.out', delay: this.delay(), scrollTrigger: trigger };

          if (mode === 'stagger') {
            gsap.set(el, { opacity: 1 });
            gsap.from(el.children, { ...base, y: 48, opacity: 0, stagger: 0.08 });
            return;
          }
          const from: gsap.TweenVars = {
            up: { y: 56 },
            fade: {},
            scale: { scale: 0.9, y: 30 },
            left: { x: -60 },
            right: { x: 60 },
          }[mode];
          gsap.fromTo(el, { opacity: 0, ...from }, { opacity: 1, x: 0, y: 0, scale: 1, ...base });
        }, el);
      });
    });

    inject(DestroyRef).onDestroy(() => ctx?.revert());
  }
}

/** Títulos que entran letra por letra con máscara. */
@Directive({ selector: '[appSplit]' })
export class SplitDirective {
  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const motion = inject(MotionService);
    const zone = inject(NgZone);
    let split: SplitText | undefined;

    afterNextRender(() => {
      if (motion.reduced) return;
      zone.runOutsideAngular(() => {
        document.fonts.ready.then(() => {
          split = SplitText.create(el, {
            type: 'words,chars',
            mask: 'words',
            wordsClass: 'split-word',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 115,
                rotate: 6,
                duration: 1,
                ease: 'expo.out',
                stagger: 0.018,
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
              }),
          });
        });
      });
    });

    inject(DestroyRef).onDestroy(() => split?.revert());
  }
}

/** Inclinación 3D + spotlight que sigue al puntero (solo con mouse). */
@Directive({ selector: '[appTilt]' })
export class TiltDirective {
  readonly max = input(7, { alias: 'appTilt', transform: (v: number | string) => Number(v) || 7 });

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const motion = inject(MotionService);
    const zone = inject(NgZone);
    const off: Array<() => void> = [];

    afterNextRender(() => {
      if (!motion.finePointer || motion.reduced) return;
      zone.runOutsideAngular(() => {
        gsap.set(el, { transformPerspective: 1000 });
        const rx = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3.out' });
        const ry = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3.out' });

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          rx((0.5 - py) * this.max());
          ry((px - 0.5) * this.max());
          el.style.setProperty('--mx', `${px * 100}%`);
          el.style.setProperty('--my', `${py * 100}%`);
          el.style.setProperty('--spot', '1');
        };
        const leave = () => {
          rx(0);
          ry(0);
          el.style.setProperty('--spot', '0');
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        off.push(() => el.removeEventListener('pointermove', move), () => el.removeEventListener('pointerleave', leave));
      });
    });

    inject(DestroyRef).onDestroy(() => off.forEach((fn) => fn()));
  }
}

/** Botones "magnéticos" que se acercan al cursor. */
@Directive({ selector: '[appMagnetic]' })
export class MagneticDirective {
  readonly strength = input(0.35, { alias: 'appMagnetic', transform: (v: number | string) => Number(v) || 0.35 });

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const motion = inject(MotionService);
    const zone = inject(NgZone);
    const off: Array<() => void> = [];

    afterNextRender(() => {
      if (!motion.finePointer || motion.reduced) return;
      zone.runOutsideAngular(() => {
        const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * this.strength());
          y((e.clientY - (r.top + r.height / 2)) * this.strength());
        };
        const leave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        off.push(() => el.removeEventListener('pointermove', move), () => el.removeEventListener('pointerleave', leave));
      });
    });

    inject(DestroyRef).onDestroy(() => off.forEach((fn) => fn()));
  }
}

/** Número que cuenta desde 0 al entrar en pantalla. */
@Directive({ selector: '[appCountUp]' })
export class CountUpDirective {
  readonly value = input.required<number>({ alias: 'appCountUp' });

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const motion = inject(MotionService);
    const zone = inject(NgZone);
    let ctx: gsap.Context | undefined;

    afterNextRender(() => {
      el.textContent = String(this.value());
      if (motion.reduced) return;
      zone.runOutsideAngular(() => {
        ctx = gsap.context(() => {
          const counter = { n: 0 };
          gsap.to(counter, {
            n: this.value(),
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 95%', once: true },
            onStart: () => (el.textContent = '0'),
            onUpdate: () => (el.textContent = String(Math.round(counter.n))),
          });
        });
      });
    });

    inject(DestroyRef).onDestroy(() => ctx?.revert());
  }
}

export const MOTION_DIRECTIVES = [RevealDirective, SplitDirective, TiltDirective, MagneticDirective, CountUpDirective] as const;
