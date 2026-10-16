import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { RevealDirective, SplitDirective, TiltDirective } from '../../directives/motion.directives';
import { FeedbackService } from '../../services/feedback.service';
import { MotionService } from '../../services/motion.service';
import { JOBS } from '../../data/profile.data';

@Component({
  selector: 'app-experience',
  imports: [RevealDirective, SplitDirective, TiltDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  private feedback = inject(FeedbackService);
  readonly jobs = JOBS;
  /** El trabajo actual empieza abierto. */
  readonly open = signal<Set<number>>(new Set([0]));

  private timeline = viewChild.required<ElementRef<HTMLElement>>('timeline');

  constructor() {
    const motion = inject(MotionService);
    const zone = inject(NgZone);
    let ctx: gsap.Context | undefined;

    afterNextRender(() => {
      if (motion.reduced) return;
      zone.runOutsideAngular(() => {
        const tl = this.timeline().nativeElement;
        ctx = gsap.context(() => {
          gsap.fromTo(
            '.tl-progress',
            { scaleY: 0 },
            { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 60%', end: 'bottom 60%', scrub: 0.6 } },
          );
          gsap.utils.toArray<HTMLElement>('.tl-dot').forEach((dot) => {
            gsap.from(dot, { scale: 0, duration: 0.6, ease: 'back.out(3)', scrollTrigger: { trigger: dot, start: 'top 65%' } });
          });
        }, tl);
      });
    });

    inject(DestroyRef).onDestroy(() => ctx?.revert());
  }

  toggle(i: number): void {
    this.open.update((set) => {
      const next = new Set(set);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
    this.feedback.haptic(8);
  }
}
