import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { RevealDirective, SplitDirective } from '../../directives/motion.directives';
import { FeedbackService } from '../../services/feedback.service';
import { MotionService } from '../../services/motion.service';
import { METHODS, STACK, StackCategory } from '../../data/profile.data';

const CATS: StackCategory[] = ['Frontend', 'Backend', 'Datos', 'Automatización', 'QA', 'Cloud', 'IA', 'Móvil'];

@Component({
  selector: 'app-stack',
  imports: [RevealDirective, SplitDirective],
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackComponent {
  private motion = inject(MotionService);
  private feedback = inject(FeedbackService);
  private zone = inject(NgZone);

  readonly cats = CATS;
  readonly methods = METHODS;
  readonly all = STACK;
  readonly filter = signal<StackCategory | 'Todo'>('Todo');
  readonly counts = computed(() => Object.fromEntries(CATS.map((c) => [c, STACK.filter((s) => s.cat === c).length])) as Record<StackCategory, number>);
  readonly rowA = STACK.slice(0, Math.ceil(STACK.length / 2));
  readonly rowB = STACK.slice(Math.ceil(STACK.length / 2));

  private grid = viewChild.required<ElementRef<HTMLElement>>('grid');
  private marquee = viewChild.required<ElementRef<HTMLElement>>('marquee');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // Las cintas aceleran y cambian de sentido según la velocidad del scroll.
      if (this.motion.reduced) return;
      this.zone.runOutsideAngular(() => {
        const tracks = Array.from(this.marquee().nativeElement.querySelectorAll<HTMLElement>('.track'));
        const tweens = tracks.map((t, i) =>
          gsap.to(t, { xPercent: i % 2 ? 0 : -50, startAt: { xPercent: i % 2 ? -50 : 0 }, duration: 40, ease: 'none', repeat: -1 }),
        );
        let boost = 1;
        const off = this.motion.onScroll((velocity) => {
          boost = gsap.utils.clamp(-6, 6, velocity / 8);
        });
        const tick = () => {
          boost += (Math.sign(boost || 1) - boost) * 0.05;
          tweens.forEach((tw) => tw.timeScale(boost));
        };
        gsap.ticker.add(tick);
        destroyRef.onDestroy(() => {
          off();
          gsap.ticker.remove(tick);
          tweens.forEach((tw) => tw.kill());
        });
      });
    });
  }

  setFilter(f: StackCategory | 'Todo'): void {
    if (f === this.filter()) return;
    this.feedback.haptic(6);
    const tiles = this.grid().nativeElement.querySelectorAll('.tile');
    const state = this.motion.reduced ? null : Flip.getState(tiles);
    this.filter.set(f);
    if (!state) return;
    // Espera a que Angular aplique las clases y anima el cambio de layout.
    requestAnimationFrame(() =>
      this.zone.runOutsideAngular(() =>
        Flip.from(state, {
          duration: 0.6,
          ease: 'power3.inOut',
          scale: true,
          absolute: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5 }),
          onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.6, duration: 0.4 }),
        }),
      ),
    );
  }

  visible(cat: StackCategory): boolean {
    return this.filter() === 'Todo' || this.filter() === cat;
  }
}
