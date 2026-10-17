import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { AvatarComponent } from '../avatar/avatar.component';
import { CountUpDirective, MagneticDirective } from '../../directives/motion.directives';
import { MotionService } from '../../services/motion.service';
import { FeedbackService } from '../../services/feedback.service';
import { ModeService } from '../../services/mode.service';
import { I18nService } from '../../i18n/i18n.service';
import { PROFILE, STATS } from '../../data/profile.data';

gsap.registerPlugin(Draggable, InertiaPlugin);

// Mismas posiciones en ambas versiones; solo cambia el texto (así no se recrean los elementos arrastrables).
// (los textos de la versión simple están en i18n → ui.hero.chipsSimple, en el mismo orden).
const CHIP_SLOTS = [
  { x: 4, y: 18, d: 0.9, tone: 'lime', tecnico: 'Claude Code' },
  { x: 78, y: 10, d: 0.7, tone: 'cyan', tecnico: 'Codex' },
  { x: 84, y: 46, d: 1.1, tone: '', tecnico: 'TypeScript' },
  { x: 0, y: 56, d: 0.8, tone: 'orange', tecnico: 'Python' },
  { x: 74, y: 74, d: 1.2, tone: '', tecnico: 'React' },
  { x: 8, y: 82, d: 0.6, tone: 'violet', tecnico: 'PostgreSQL' },
];

type OrientationPermission = { requestPermission?: () => Promise<'granted' | 'denied'> };

@Component({
  selector: 'app-hero',
  imports: [AvatarComponent, CountUpDirective, MagneticDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private motion = inject(MotionService);
  private feedback = inject(FeedbackService);
  private zone = inject(NgZone);
  private host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  readonly mode = inject(ModeService);
  readonly i18n = inject(I18nService);
  readonly profile = PROFILE;
  readonly stats = STATS;
  readonly chips = CHIP_SLOTS;
  readonly roles = computed(() => (this.mode.simple() ? this.i18n.c().profile.simpleRoles : this.i18n.c().profile.roles));

  readonly roleIndex = signal(0);
  readonly bubble = signal<string | null>(null);
  readonly gyroAvailable = signal(false);
  private lineIndex = 0;
  private bubbleTimer?: ReturnType<typeof setTimeout>;

  private scene = viewChild.required<ElementRef<HTMLElement>>('scene');
  private rot = viewChild.required<ElementRef<HTMLElement>>('rot');
  private avatar = viewChild.required(AvatarComponent, { read: ElementRef });

  constructor() {
    const destroyRef = inject(DestroyRef);
    const cleanups: Array<() => void> = [];

    const roleTimer = setInterval(() => this.roleIndex.update((i) => (i + 1) % this.roles().length), 2600);
    cleanups.push(() => clearInterval(roleTimer));

    afterNextRender(() => {
      this.zone.runOutsideAngular(() => {
        cleanups.push(this.setupParallax(), this.setupScroll(), this.setupChips());
      });
      const perm = (window as unknown as { DeviceOrientationEvent?: OrientationPermission }).DeviceOrientationEvent;
      this.gyroAvailable.set(!this.motion.finePointer && !!perm?.requestPermission);
    });

    // Cada frase nueva del rotador entra desde abajo.
    effect(() => {
      this.roleIndex();
      if (this.motion.reduced) return;
      this.rot().nativeElement.animate(
        [
          { opacity: 0, transform: 'translateY(60%)', filter: 'blur(6px)' },
          { opacity: 1, transform: 'none', filter: 'blur(0)' },
        ],
        { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    });

    // Entrada del hero cuando termina la intro de carga.
    effect(() => {
      if (!this.motion.introDone()) return;
      this.zone.runOutsideAngular(() => this.playIntro());
    });

    destroyRef.onDestroy(() => {
      cleanups.forEach((fn) => fn());
      clearTimeout(this.bubbleTimer);
    });
  }

  go(id: string): void {
    this.motion.scrollTo(`#${id}`);
  }

  /** Tocar al personaje: salta y dice algo. */
  poke(): void {
    const lines = this.mode.simple() ? this.i18n.c().ui.hero.linesSimple : this.i18n.c().ui.hero.linesTech;
    this.bubble.set(lines[this.lineIndex % lines.length]);
    this.lineIndex++;
    this.feedback.haptic(10);
    clearTimeout(this.bubbleTimer);
    this.bubbleTimer = setTimeout(() => this.bubble.set(null), 3200);
    if (!this.motion.reduced) {
      gsap.fromTo(
        this.avatar().nativeElement,
        { y: 0, scaleY: 1 },
        { keyframes: [{ y: 6, scaleY: 0.96, duration: 0.1 }, { y: -36, scaleY: 1.03, duration: 0.25, ease: 'power2.out' }, { y: 0, scaleY: 1, duration: 0.5, ease: 'bounce.out' }] },
      );
    }
  }

  /** iOS exige permiso explícito para leer el giroscopio. */
  async enableGyro(): Promise<void> {
    const perm = (window as unknown as { DeviceOrientationEvent?: OrientationPermission }).DeviceOrientationEvent;
    try {
      const res = await perm?.requestPermission?.();
      if (res === 'granted') {
        this.feedback.toast(this.i18n.c().ui.hero.gyroToast, '✦');
        this.gyroAvailable.set(false);
      }
    } catch {
      this.gyroAvailable.set(false);
    }
  }

  private playIntro(): void {
    if (this.motion.reduced) return;
    const q = gsap.utils.selector(this.host);
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from(q('.h-line > span'), { yPercent: 110, duration: 1.2, stagger: 0.09 })
      .from(q('.hero-avatar'), { y: 120, opacity: 0, scale: 0.85, duration: 1.4 }, 0.1)
      .from(q('.layer:not(.avatar-layer)'), { opacity: 0, scale: 0.7, duration: 1.6, stagger: 0.1 }, 0)
      .from(q('.chip-layer'), { opacity: 0, scale: 0, duration: 0.9, stagger: 0.07, ease: 'back.out(2)' }, 0.5)
      .from(q('.h-reveal'), { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.35);
  }

  private setupParallax(): () => void {
    if (this.motion.reduced) return () => {};
    const layers = Array.from(this.scene().nativeElement.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
      depth: Number(el.dataset['depth']),
      x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }),
    }));
    const apply = (nx: number, ny: number) => layers.forEach((l) => (l.x(nx * 40 * l.depth), l.y(ny * 26 * l.depth)));

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      apply(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      apply(gsap.utils.clamp(-0.5, 0.5, e.gamma / 50), gsap.utils.clamp(-0.5, 0.5, (e.beta - 45) / 60));
    };
    addEventListener('pointermove', onPointer, { passive: true });
    addEventListener('deviceorientation', onTilt, { passive: true });
    return () => {
      removeEventListener('pointermove', onPointer);
      removeEventListener('deviceorientation', onTilt);
    };
  }

  private setupScroll(): () => void {
    if (this.motion.reduced) return () => {};
    const ctx = gsap.context(() => {
      const st = { trigger: this.host, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.giant-name', { xPercent: -18, ease: 'none', scrollTrigger: st });
      // Solo desplazamiento: escalar en cada frame obligaba a volver a dibujar la foto y las burbujas.
      gsap.to('.scene-inner', { yPercent: 14, ease: 'none', scrollTrigger: st });
      gsap.to('.hero-copy-fade', { y: -60, opacity: 0.2, ease: 'none', scrollTrigger: st });
    }, this.host);
    return () => ctx.revert();
  }

  private setupChips(): () => void {
    const scene = this.scene().nativeElement;
    const draggables = Draggable.create(scene.querySelectorAll('.float-chip'), {
      bounds: scene,
      inertia: true,
      edgeResistance: 0.75,
      zIndexBoost: true,
      onPress: () => this.feedback.haptic(6),
      onDragStart: function (this: Draggable) {
        (this.target as HTMLElement).classList.add('grabbing');
      },
      onRelease: function (this: Draggable) {
        (this.target as HTMLElement).classList.remove('grabbing');
      },
    });
    return () => draggables.forEach((d) => d.kill());
  }
}
