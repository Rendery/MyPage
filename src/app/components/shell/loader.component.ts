import { ChangeDetectionStrategy, Component, ElementRef, NgZone, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { MotionService } from '../../services/motion.service';
import { ModeService } from '../../services/mode.service';

const LINES = {
  tecnico: ['> npx edery@latest', '✓ cargando experiencia.ts', '✓ compilando café → código', '✓ conectando Claude Code + Codex', '✓ imprimiendo tu fotocheck', '✦ listo'],
  simple: ['> ¡Hola! Soy Edery 👋', '✓ preparando mi experiencia', '✓ cargando proyectos reales', '✓ conectando la inteligencia artificial', '✓ imprimiendo tu fotocheck', '✦ listo'],
};

/** Intro tipo terminal. Solo aparece en la primera visita de la sesión. */
@Component({
  selector: 'app-loader',
  template: `
    @if (show()) {
      <div class="loader" #root role="status" aria-label="Cargando">
        <div class="box">
          <div class="term mono">
            @for (l of lines(); track $index; let last = $last) {
              <p [class.ok]="l.startsWith('✓')" [class.done]="l.startsWith('✦')">
                {{ l }}@if (last && !finished()) {<span class="caret"></span>}
              </p>
            }
          </div>
          <div class="bar"><span [style.transform]="'scaleX(' + progress() + ')'"></span></div>
        </div>
        <button type="button" class="skip mono" (click)="finish()">saltar intro →</button>
      </div>
    }
  `,
  styleUrl: './loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  private motion = inject(MotionService);
  private zone = inject(NgZone);
  private mode = inject(ModeService);

  readonly show = signal(true);
  readonly lines = signal<string[]>([]);
  readonly progress = signal(0);
  readonly finished = signal(false);
  private root = viewChild<ElementRef<HTMLElement>>('root');
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    afterNextRender(() => {
      let seen = false;
      try {
        seen = sessionStorage.getItem('ea-intro') === '1';
        sessionStorage.setItem('ea-intro', '1');
      } catch {
        /* sin almacenamiento: se muestra la intro */
      }
      if (seen || this.motion.reduced) {
        this.show.set(false);
        this.motion.introDone.set(true);
        return;
      }
      this.motion.lock(true);
      const lines = LINES[this.mode.mode()];
      lines.forEach((l, i) => {
        this.timers.push(
          setTimeout(() => {
            this.lines.update((ls) => [...ls, l]);
            this.progress.set((i + 1) / lines.length);
          }, 120 + i * 210),
        );
      });
      this.timers.push(setTimeout(() => this.finish(), 120 + lines.length * 210 + 250));
    });
  }

  finish(): void {
    if (this.finished()) return;
    this.finished.set(true);
    this.timers.forEach(clearTimeout);
    this.motion.lock(false);
    this.motion.introDone.set(true);
    const el = this.root()?.nativeElement;
    if (!el) {
      this.show.set(false);
      return;
    }
    this.zone.runOutsideAngular(() =>
      gsap.to(el, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.9,
        ease: 'expo.inOut',
        onComplete: () => this.zone.run(() => this.show.set(false)),
      }),
    );
  }
}
