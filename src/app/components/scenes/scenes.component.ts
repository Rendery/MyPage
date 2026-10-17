import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { MagneticDirective, RevealDirective, SplitDirective } from '../../directives/motion.directives';
import { MotionService } from '../../services/motion.service';
import { I18nService } from '../../i18n/i18n.service';

gsap.registerPlugin(TextPlugin);

type Q = (selector: string) => HTMLElement[];

/** Posición del centro de `el` dentro de `root`, sin contar transformaciones (sirve aunque el teléfono esté escalado). */
function localCenter(el: HTMLElement, root: HTMLElement): { x: number; y: number } {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/** Toque de un dedo: se encoge y suelta una onda. */
function tap(finger: HTMLElement): gsap.core.Timeline {
  const ripple = finger.querySelector('.ripple');
  return gsap
    .timeline()
    .to(finger, { scale: 0.78, duration: 0.1, ease: 'power2.out' })
    .fromTo(ripple, { scale: 0.4, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 0.5, ease: 'power2.out' }, '<')
    .to(finger, { scale: 1, duration: 0.25, ease: 'back.out(3)' }, '<0.1');
}

function moveFinger(finger: HTMLElement, target: () => HTMLElement, root: HTMLElement, duration = 0.7): gsap.TweenVars {
  return {
    x: () => localCenter(target(), root).x,
    y: () => localCenter(target(), root).y,
    duration,
    ease: 'power2.inOut',
  };
}

/**
 * "Lo que puedo hacer por tu negocio": versión sin tecnicismos.
 * Cada escena es una animación en bucle que solo corre mientras está en pantalla.
 */
@Component({
  selector: 'app-scenes',
  imports: [MagneticDirective, RevealDirective, SplitDirective],
  templateUrl: './scenes.component.html',
  styleUrl: './scenes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScenesComponent {
  private motion = inject(MotionService);

  readonly i18n = inject(I18nService);
  // Los textos de cada escena están en i18n → scenes.items (y los de cada animación en scenes.bot/app/auto/boleta).
  readonly scenes = [
    { id: 'bot', icon: '💬', real: false },
    { id: 'app', icon: '📱', real: false },
    { id: 'auto', icon: '⚙️', real: false },
    { id: 'boleta', icon: '🧾', real: true },
  ] as const;

  constructor() {
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const zone = inject(NgZone);
    let ctx: gsap.Context | undefined;

    afterNextRender(() => {
      zone.runOutsideAngular(() => {
        ctx = gsap.context(() => {
          const builders: Record<string, (root: HTMLElement, q: Q) => gsap.core.Timeline> = {
            bot: (r, q) => this.botTimeline(r, q),
            app: (r, q) => this.appTimeline(r, q),
            auto: (r, q) => this.autoTimeline(r, q),
            boleta: (r, q) => this.boletaTimeline(r, q),
          };
          host.querySelectorAll<HTMLElement>('.scene-visual').forEach((visual) => {
            const q = gsap.utils.selector(visual) as Q;
            const tl = builders[visual.dataset['scene'] ?? '']?.(visual, q);
            if (!tl) return;
            if (this.motion.reduced) {
              tl.pause('show');
              return;
            }
            ScrollTrigger.create({
              trigger: visual,
              start: 'top 85%',
              end: 'bottom 10%',
              onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
            });
          });
        }, host);
      });
    });

    inject(DestroyRef).onDestroy(() => ctx?.revert());
  }

  goToProjects(): void {
    this.motion.scrollTo('#proyectos');
  }

  /** Chat de WhatsApp: el cliente pregunta de madrugada y el bot agenda la cita. */
  private botTimeline(root: HTMLElement, q: Q): gsap.core.Timeline {
    const show = (sel: string, display = 'block') =>
      gsap.timeline().set(q(sel), { display }).to(q(sel), { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    const typing = (sel: string, seconds: number) =>
      gsap.timeline().set(q(sel), { display: 'inline-flex', opacity: 1, y: 0 }).set(q(sel), { display: 'none' }, `+=${seconds}`);

    return gsap
      .timeline({ repeat: -1, repeatDelay: 0.4, paused: true })
      .set(q('.msg, .typing'), { display: 'none', opacity: 0, y: 12 })
      .set(q('.quick'), { display: 'none', opacity: 0, y: 12 })
      .set(q('.quick span'), { backgroundColor: 'transparent', color: '#128c7e', scale: 1 })
      .set(q('.cal'), { opacity: 0, x: 40, scale: 0.9 })
      .add(show('.m1'), 0.5)
      .add(typing('.ty1', 1.1), '+=0.3')
      .add(show('.m2'))
      .add(show('.quick', 'flex'), '+=0.15')
      .to(q('.quick .pick'), { backgroundColor: '#25d366', color: '#ffffff', scale: 1.08, duration: 0.25 }, '+=0.9')
      .add(show('.m3'), '+=0.35')
      .add(typing('.ty2', 1.2), '+=0.3')
      .add(show('.m4'))
      .to(q('.cal'), { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'back.out(2)' }, '+=0.35')
      .addLabel('show')
      .to({}, { duration: 2.8 })
      .to(q('.msg, .quick, .cal'), { opacity: 0, duration: 0.4 });
  }

  /** App de tienda: elegir un producto, agregarlo al carrito y confirmar el pedido. */
  private appTimeline(root: HTMLElement, q: Q): gsap.core.Timeline {
    const phone = q('.phone')[0];
    const finger = q('.finger')[0];
    const el = (sel: string) => () => q(sel)[0];

    return gsap
      .timeline({ repeat: -1, repeatDelay: 0.3, paused: true, repeatRefresh: true })
      .set(q('.s1'), { xPercent: 0, opacity: 1 })
      .set(q('.s2, .s3'), { xPercent: 100, opacity: 1 })
      .set(q('.cart-n'), { text: '0' })
      .set(q('.check'), { scale: 0 })
      .set(q('.track-fill'), { scaleX: 0 })
      .set(q('.notif'), { opacity: 0, y: -24 })
      .set(finger, { opacity: 0, x: 150, y: 430, scale: 1 })
      .to(finger, { opacity: 1, duration: 0.3 }, 0.5)
      .to(finger, moveFinger(finger, el('.p1'), phone, 0.8))
      .add(tap(finger))
      .to(q('.p1'), { scale: 0.94, yoyo: true, repeat: 1, duration: 0.12 }, '<')
      .to(q('.s1'), { xPercent: -30, opacity: 0, duration: 0.5, ease: 'power3.inOut' }, '+=0.15')
      .to(q('.s2'), { xPercent: 0, duration: 0.5, ease: 'power3.inOut' }, '<')
      .to(finger, moveFinger(finger, el('.add-btn'), phone), '+=0.3')
      .add(tap(finger))
      .to(q('.add-btn'), { scale: 0.94, yoyo: true, repeat: 1, duration: 0.12 }, '<')
      .set(q('.cart-n'), { text: '1' })
      .fromTo(q('.cart-n'), { scale: 1.9 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' }, '<')
      .to(finger, moveFinger(finger, el('.cart'), phone, 0.6), '+=0.35')
      .add(tap(finger))
      .to(q('.s2'), { xPercent: -30, opacity: 0, duration: 0.5, ease: 'power3.inOut' }, '+=0.15')
      .to(q('.s3'), { xPercent: 0, duration: 0.5, ease: 'power3.inOut' }, '<')
      .to(finger, { opacity: 0, duration: 0.3 }, '<')
      .to(q('.check'), { scale: 1, duration: 0.6, ease: 'back.out(3)' })
      .to(q('.track-fill'), { scaleX: 0.5, duration: 1.1, ease: 'power2.inOut' })
      .to(q('.notif'), { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.3')
      .addLabel('show')
      .to({}, { duration: 2.4 })
      .to(q('.notif'), { opacity: 0, duration: 0.3 });
  }

  /** Papeles y Excel desordenados que entran a la "máquina" y salen como un reporte listo. */
  private autoTimeline(root: HTMLElement, q: Q): gsap.core.Timeline {
    const finger = q('.finger')[0];
    const sheets = q('.sheet');
    // Papeles desordenados: a la izquierda en escritorio, arriba en celular (la máquina queda al centro).
    const wide = [
      { left: '3%', top: '16%', rotation: -9 },
      { left: '15%', top: '8%', rotation: 7 },
      { left: '6%', top: '44%', rotation: 5 },
      { left: '20%', top: '38%', rotation: -6 },
      { left: '10%', top: '26%', rotation: 12 },
    ];
    const narrow = [
      { left: '2%', top: '3%', rotation: -9 },
      { left: '26%', top: '7%', rotation: 7 },
      { left: '52%', top: '2%', rotation: 5 },
      { left: '74%', top: '6%', rotation: -6 },
      { left: '38%', top: '18%', rotation: 12 },
    ];
    const isNarrow = () => root.offsetWidth < 480;
    const base = (i: number) => (isNarrow() ? narrow : wide)[i];

    return gsap
      .timeline({ repeat: -1, repeatDelay: 0.3, paused: true, repeatRefresh: true })
      .set(sheets, {
        left: (i: number) => base(i).left,
        top: (i: number) => base(i).top,
        rotation: (i: number) => base(i).rotation,
        y: 0,
        scale: 1,
        opacity: 1,
      })
      .set(q('.report'), { opacity: 0, scale: 0.6 })
      .set(q('.bars i'), { scaleY: 0 })
      .set(q('.r-ok'), { opacity: 0, y: 8 })
      .set(q('.strike'), { scaleX: 0 })
      .set(q('.after'), { opacity: 0.35, scale: 1 })
      .set(finger, { opacity: 0, x: () => root.offsetWidth * 0.5, y: () => root.offsetHeight + 20, scale: 1 })
      .to(sheets, { y: -7, rotation: '+=5', duration: 0.16, yoyo: true, repeat: 5, stagger: 0.06, ease: 'sine.inOut' }, 0.3)
      .to(finger, { opacity: 1, duration: 0.3 }, '-=0.5')
      .to(finger, moveFinger(finger, () => q('.go-btn')[0], root))
      .add(tap(finger))
      .to(q('.go-btn'), { scale: 0.93, yoyo: true, repeat: 1, duration: 0.12 }, '<')
      .to(
        sheets,
        { left: () => (isNarrow() ? '39%' : '44%'), top: () => (isNarrow() ? '43%' : '38%'), scale: 0.15, rotation: 220, opacity: 0, duration: 0.7, stagger: 0.13, ease: 'power3.in' },
        '+=0.1',
      )
      .to(q('.gear'), { rotation: '+=540', duration: 1.6, ease: 'power2.inOut' }, '<')
      .to(finger, { opacity: 0, duration: 0.3 }, '<')
      .to(q('.report'), { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, '-=0.35')
      .to(q('.bars i'), { scaleY: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' })
      .to(q('.r-ok'), { opacity: 1, y: 0, duration: 0.4 })
      .to(q('.strike'), { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '<')
      .to(q('.after'), { opacity: 1, scale: 1.06, duration: 0.45, ease: 'back.out(3)' })
      .addLabel('show')
      .to({}, { duration: 2.6 })
      .to(q('.report'), { opacity: 0, duration: 0.4 });
  }

  /** Caso real de Bienestar: DNI + monto → boleta en PDF → enviada por WhatsApp. */
  private boletaTimeline(root: HTMLElement, q: Q): gsap.core.Timeline {
    const finger = q('.finger')[0];

    return gsap
      .timeline({ repeat: -1, repeatDelay: 0.3, paused: true, repeatRefresh: true })
      .set(q('.t-dni, .t-monto'), { text: '' })
      .set(q('.ticket'), { clipPath: 'inset(0% 0% 100% 0%)', y: -14, opacity: 1 })
      .set(q('.sent'), { opacity: 0, y: 20 })
      .set(finger, { opacity: 0, x: () => root.offsetWidth * 0.3, y: () => root.offsetHeight + 20, scale: 1 })
      .to(q('.t-dni'), { text: '12345678', duration: 0.9, ease: 'none' }, 0.5)
      .to(q('.t-monto'), { text: '150.00', duration: 0.5, ease: 'none' }, '+=0.25')
      .to(finger, { opacity: 1, duration: 0.2 }, '-=0.2')
      .to(finger, moveFinger(finger, () => q('.gen-btn')[0], root, 0.6))
      .add(tap(finger))
      .to(q('.gen-btn'), { scale: 0.95, yoyo: true, repeat: 1, duration: 0.12 }, '<')
      .to(q('.ticket'), { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.3, ease: 'steps(12)' }, '+=0.15')
      .to(finger, { opacity: 0, duration: 0.3 }, '<')
      .to(q('.sent'), { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)' })
      .addLabel('show')
      .to({}, { duration: 2.6 })
      .to(q('.ticket, .sent'), { opacity: 0, duration: 0.4 });
  }
}
