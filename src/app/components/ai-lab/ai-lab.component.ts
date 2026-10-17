import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { RevealDirective, SplitDirective } from '../../directives/motion.directives';
import { FeedbackService } from '../../services/feedback.service';
import { ModeService } from '../../services/mode.service';
import { MotionService } from '../../services/motion.service';
import { I18nService } from '../../i18n/i18n.service';
import { Agent, LineKind, SCENARIO_IDS, Scenario } from './ai-scripts';

interface ShownLine {
  k: LineKind | string;
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
  readonly mode = inject(ModeService);
  readonly i18n = inject(I18nService);

  readonly scenarioIds = SCENARIO_IDS;
  readonly toolkit = computed(() => (this.mode.simple() ? this.i18n.c().ai.toolkitSimple : this.i18n.c().ai.toolkit));

  // --- Versión técnica: terminal con Claude Code / Codex ---
  readonly agent = signal<Agent>('claude');
  readonly scenario = signal<Scenario>('sunat');
  readonly lines = signal<ShownLine[]>([]);
  readonly running = signal(false);

  // --- Versión simple: los 4 pasos de cómo trabajo con IA ---
  readonly request = signal(0);
  /** -1 = recién llega el pedido; 0..3 = paso en curso; 4 = entregado. */
  readonly step = signal(-1);

  private visual = viewChild.required<ElementRef<HTMLElement>>('visual');
  private body = viewChild<ElementRef<HTMLElement>>('body');
  private timers: ReturnType<typeof setTimeout>[] = [];
  private visible = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const io = new IntersectionObserver(
        ([entry]) => {
          const wasVisible = this.visible;
          this.visible = entry.isIntersecting;
          if (this.visible && !wasVisible && !this.timers.length) this.start();
        },
        { threshold: 0.3 },
      );
      io.observe(this.visual().nativeElement);
      destroyRef.onDestroy(() => io.disconnect());
    });

    // Al cambiar de versión arranca la animación que corresponde.
    effect(() => {
      this.mode.mode();
      this.i18n.lang();
      queueMicrotask(() => {
        this.clear();
        if (this.visible) this.start();
      });
    });

    // Mantiene la terminal desplazada a la última línea.
    effect(() => {
      this.lines();
      const el = this.body()?.nativeElement;
      if (el) queueMicrotask(() => (el.scrollTop = el.scrollHeight));
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

  pickRequest(i: number): void {
    this.request.set(i);
    this.feedback.haptic(8);
    this.playSimple();
  }

  play(): void {
    this.clear();
    const script = this.i18n.c().ai.scripts[this.agent()][this.scenario()];

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

  /** Pedido → 4 pasos que se van marcando → resultado entregado; luego pasa al siguiente pedido. */
  playSimple(): void {
    this.clear();
    const steps = this.i18n.c().ai.simpleSteps.length;
    const requests = this.i18n.c().ai.simpleRequests.length;
    if (this.motion.reduced) {
      this.step.set(steps);
      return;
    }
    this.running.set(true);
    this.step.set(-1);
    for (let i = 0; i < steps; i++) this.at(900 + i * 1100, () => this.step.set(i));
    const done = 900 + steps * 1100;
    this.at(done, () => this.step.set(steps));
    this.at(done + 3600, () => {
      this.request.update((r) => (r + 1) % requests);
      this.playSimple();
    });
  }

  private start(): void {
    this.mode.simple() ? this.playSimple() : this.play();
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
