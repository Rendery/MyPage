import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { RevealDirective, SplitDirective } from '../../directives/motion.directives';
import { FeedbackService } from '../../services/feedback.service';
import { MotionService } from '../../services/motion.service';
import { AI_TOOLKIT, Agent, LineKind, PRINCIPLES, SCENARIOS, SCRIPTS, Scenario } from './ai-scripts';

interface ShownLine {
  k: LineKind;
  t: string;
  typing?: boolean;
}

@Component({
  selector: 'app-ai-lab',
  imports: [AvatarComponent, RevealDirective, SplitDirective],
  templateUrl: './ai-lab.component.html',
  styleUrl: './ai-lab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiLabComponent {
  private motion = inject(MotionService);
  private feedback = inject(FeedbackService);

  readonly scenarios = SCENARIOS;
  readonly principles = PRINCIPLES;
  readonly toolkit = AI_TOOLKIT;

  readonly agent = signal<Agent>('claude');
  readonly scenario = signal<Scenario>('sunat');
  readonly lines = signal<ShownLine[]>([]);
  readonly running = signal(false);

  private body = viewChild.required<ElementRef<HTMLElement>>('body');
  private terminal = viewChild.required<ElementRef<HTMLElement>>('terminal');
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          this.play();
        },
        { threshold: 0.35 },
      );
      io.observe(this.terminal().nativeElement);
      destroyRef.onDestroy(() => io.disconnect());
    });

    // Mantiene la terminal desplazada a la última línea.
    effect(() => {
      this.lines();
      const el = this.body().nativeElement;
      queueMicrotask(() => (el.scrollTop = el.scrollHeight));
    });

    destroyRef.onDestroy(() => this.clear());
  }

  pickAgent(agent: Agent): void {
    if (agent === this.agent() && this.running()) return;
    this.agent.set(agent);
    this.feedback.haptic(8);
    this.play();
  }

  pickScenario(s: Scenario): void {
    this.scenario.set(s);
    this.feedback.haptic(8);
    this.play();
  }

  play(): void {
    this.clear();
    const script = SCRIPTS[this.agent()][this.scenario()];

    if (this.motion.reduced) {
      this.lines.set(script.map((l) => ({ ...l })));
      return;
    }

    this.running.set(true);
    let t = 250;
    for (const line of script) {
      if (line.k === 'prompt' || line.k === 'user') {
        const speed = line.k === 'prompt' ? 45 : 20;
        this.at(t, () => this.lines.update((ls) => [...ls, { k: line.k, t: '', typing: true }]));
        for (let c = 1; c <= line.t.length; c++) {
          this.at(t + c * speed, () => this.setLast({ k: line.k, t: line.t.slice(0, c), typing: true }));
        }
        t += line.t.length * speed + 380;
        this.at(t, () => this.setLast({ k: line.k, t: line.t }));
      } else {
        t += line.k === 'tool' ? 560 : line.k === 'dim' ? 160 : 320;
        this.at(t, () => this.lines.update((ls) => [...ls, { ...line }]));
      }
    }
    this.at(t + 200, () => this.running.set(false));
  }

  private setLast(line: ShownLine): void {
    this.lines.update((ls) => [...ls.slice(0, -1), line]);
  }

  private at(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }

  private clear(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.lines.set([]);
    this.running.set(false);
  }
}
