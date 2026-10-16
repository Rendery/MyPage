import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import qrcode from 'qrcode-generator';
import { AvatarComponent } from '../avatar/avatar.component';
import { MagneticDirective, RevealDirective, SplitDirective } from '../../directives/motion.directives';
import { FeedbackService } from '../../services/feedback.service';
import { MotionService } from '../../services/motion.service';
import { PROFILE } from '../../data/profile.data';
import { LanyardSim } from './lanyard-sim';

const ROLES = ['Practicante de Software', 'Desarrollador Full Stack', 'QA y Automatización', 'Automatización e IA'];
const SWATCHES = ['#FF6B2C', '#2F6BFF', '#E3262F', '#00A86B', '#7B3FE4', '#111318'];
const DEFAULT_COMPANY = 'Tu empresa';

function hash(text: string): number {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function readableOn(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? '#0A0C10' : '#FFFFFF';
}

@Component({
  selector: 'app-badge',
  imports: [AvatarComponent, MagneticDirective, RevealDirective, SplitDirective],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  private zone = inject(NgZone);
  private motion = inject(MotionService);
  private feedback = inject(FeedbackService);

  readonly profile = PROFILE;
  readonly roles = ROLES;
  readonly swatches = SWATCHES;

  readonly company = signal('');
  readonly role = signal(ROLES[1]);
  readonly color = signal(SWATCHES[0]);
  readonly hired = signal(false);
  /** Foto del fotocheck: primero la versión WebP liviana, luego el PNG original. */
  private readonly photoSources = ['/images/avatar/badge-photo.webp', '/images/avatar/badge-photo.png'];
  private readonly photoIndex = signal(0);
  readonly photo = computed(() => this.photoSources[this.photoIndex()] ?? null);

  readonly displayCompany = computed(() => this.company().trim() || DEFAULT_COMPANY);
  readonly onColor = computed(() => readableOn(this.color()));
  readonly initials = computed(() => {
    const words = this.displayCompany().split(/\s+/).filter(Boolean);
    return (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
  });
  readonly badgeId = computed(() => `EA-${new Date().getFullYear()}-${String(hash(this.displayCompany()) % 10000).padStart(4, '0')}`);
  readonly bars = computed(() => {
    let h = hash(this.displayCompany() + this.role());
    const bars: { x: number; w: number }[] = [];
    let x = 0;
    while (x < 96) {
      const w = 1 + (h % 3);
      bars.push({ x, w });
      x += w + 1 + ((h >> 3) % 3);
      h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0;
    }
    return bars;
  });
  readonly strapText = computed(() => `${this.displayCompany().toUpperCase()} ✦ EDERY ABANTO ✦ `.repeat(10));
  readonly since = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

  readonly shareUrl = computed(() => {
    const params = new URLSearchParams();
    if (this.company().trim()) params.set('empresa', this.company().trim());
    params.set('color', this.color().replace('#', ''));
    params.set('rol', String(ROLES.indexOf(this.role())));
    return `${location.origin}${location.pathname}?${params.toString()}#fotocheck`;
  });

  readonly qr = computed(() => {
    const qr = qrcode(0, 'M');
    qr.addData(this.shareUrl());
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return { d, size: n };
  });

  readonly mailto = computed(() => {
    const c = this.displayCompany();
    const subject = `Propuesta de ${c} para Edery`;
    const body = `Hola Edery,\n\nTe escribo de ${c}. Vimos tu fotocheck y nos gustaría conversar contigo sobre el puesto de ${this.role()}.\n\nSaludos,`;
    return `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  readonly whatsapp = computed(() => `${PROFILE.whatsapp}?text=${encodeURIComponent(`Hola Edery 👋 Te escribo de ${this.displayCompany()}.`)}`);

  private stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private card = viewChild.required<ElementRef<HTMLElement>>('card');
  private strap = viewChild.required<ElementRef<SVGPathElement>>('strapPath');

  private sim = new LanyardSim();
  private kick?: () => void;

  constructor() {
    this.readUrl();
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const stop = this.zone.runOutsideAngular(() => this.startPhysics());
      destroyRef.onDestroy(stop);
    });
  }

  setCompany(value: string): void {
    this.company.set(value.slice(0, 26));
    this.hired.set(false);
  }

  setRole(role: string): void {
    this.role.set(role);
    this.feedback.haptic(8);
    this.kick?.();
  }

  setColor(color: string): void {
    this.color.set(color);
    this.feedback.haptic(8);
    this.kick?.();
  }

  flip(): void {
    this.sim.flip();
    this.feedback.haptic(10);
    this.kick?.();
  }

  hire(event: MouseEvent): void {
    this.hired.set(true);
    const r = this.card().nativeElement.getBoundingClientRect();
    this.feedback.confetti(r.left + r.width / 2, r.top + r.height / 3);
    this.feedback.haptic([20, 40, 30]);
    this.feedback.toast(`¡Gracias, ${this.displayCompany()}! Conversemos 🤝`, '🎉');
    if (Math.cos((this.sim.rotY * Math.PI) / 180) < 0) this.sim.flip();
    this.sim.nudge(10);
    this.kick?.();
    (event.currentTarget as HTMLElement | null)?.blur();
  }

  async share(): Promise<void> {
    const url = this.shareUrl();
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share && !this.motion.finePointer) {
      try {
        await nav.share({ title: 'Fotocheck de Edery Abanto', text: `Así se vería Edery en ${this.displayCompany()}`, url });
        return;
      } catch {
        /* el usuario canceló: se copia el enlace */
      }
    }
    await this.feedback.copy(url, 'Enlace del fotocheck');
  }

  onCardKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.flip();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      this.sim.nudge(e.key === 'ArrowLeft' ? 14 : -14);
      this.kick?.();
    }
  }

  photoFallback(): void {
    this.photoIndex.update((i) => i + 1);
  }

  private readUrl(): void {
    const params = new URLSearchParams(location.search);
    const empresa = params.get('empresa');
    const color = params.get('color');
    const rol = Number(params.get('rol'));
    if (empresa) {
      this.company.set(empresa.slice(0, 26));
      setTimeout(() => this.feedback.toast(`¡Hola, equipo de ${this.displayCompany()}! 👋`, '🪪'), 2600);
    }
    if (color && /^[0-9a-f]{6}$/i.test(color)) this.color.set(`#${color}`);
    if (ROLES[rol]) this.role.set(ROLES[rol]);
  }

  /** Bucle de físicas: solo corre mientras la sección está visible y la tarjeta se mueve. */
  private startPhysics(): () => void {
    const stage = this.stage().nativeElement;
    const card = this.card().nativeElement;
    const strap = this.strap().nativeElement;
    const sim = this.sim;
    const reduced = this.motion.reduced;

    let raf = 0;
    let visible = false;
    let entered = false;
    let idleFrames = 0;
    let breeze = 0;
    let cardW = 0;

    const layout = (swingIn = false) => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      cardW = card.offsetWidth;
      const mobile = w < 560;
      const anchorX = w * (mobile ? 0.62 : 0.68);
      sim.reset(anchorX, -24, Math.max(150, h * (mobile ? 0.24 : 0.27)), 12, swingIn);
    };

    const render = () => {
      strap.setAttribute('d', sim.path());
      const e = sim.end;
      const rz = sim.cardAngle();
      const ry = sim.displayRotY();
      card.style.transform = `translate3d(${(e.x - cardW / 2).toFixed(1)}px, ${(e.y - 6).toFixed(1)}px, 0) rotate(${rz.toFixed(2)}deg) rotateX(${sim.cardTilt().toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      card.style.setProperty('--sheen', `${(((ry % 360) + 360) % 360) / 3.6 + rz * 2}%`);
      card.classList.toggle('show-back', Math.cos((ry * Math.PI) / 180) < 0);
    };

    // Paso fijo de 60 Hz: la física se ve igual en pantallas de 60, 120 o 144 Hz.
    const STEP = 1000 / 60;
    let lastT = 0;
    let acc = 0;
    const loop = (t: number) => {
      acc += lastT ? Math.min(t - lastT, 100) : STEP;
      lastT = t;
      let steps = 0;
      while (acc >= STEP && steps < 5) {
        sim.step();
        acc -= STEP;
        steps++;
        breeze++;
        idleFrames = sim.energy() < 0.05 && !sim.dragging ? idleFrames + 1 : 0;
      }
      if (steps === 5) acc = 0;
      if (breeze > 260 && !sim.dragging) {
        breeze = 0;
        sim.nudge((Math.random() - 0.5) * 3);
      }
      render();
      raf = visible && idleFrames < 120 ? requestAnimationFrame(loop) : 0;
      if (!raf) lastT = 0;
    };

    const kick = () => {
      idleFrames = 0;
      if (reduced) {
        for (let i = 0; i < 240; i++) sim.step();
        render();
        return;
      }
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };
    this.kick = kick;

    layout();
    render();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !entered && !reduced) {
        entered = true;
        layout(true);
      }
      if (visible) kick();
    });
    io.observe(stage);

    const ro = new ResizeObserver(() => {
      layout();
      kick();
    });
    ro.observe(stage);

    // --- Arrastre con mouse o dedo ---
    let start = { x: 0, y: 0, t: 0 };
    let grabOffset = { x: 0, y: 0 };
    let last = { x: 0, y: 0 };

    const local = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      card.setPointerCapture(e.pointerId);
      const p = local(e);
      start = { ...p, t: performance.now() };
      last = p;
      grabOffset = { x: p.x - sim.end.x, y: p.y - sim.end.y };
      sim.grab();
      stage.classList.add('dragging');
      this.feedback.haptic(6);
      kick();
    };
    const move = (e: PointerEvent) => {
      if (!sim.dragging) return;
      const p = local(e);
      sim.dragTo(p.x - grabOffset.x, p.y - grabOffset.y, p.x - last.x, p.y - last.y);
      last = p;
    };
    const up = (e: PointerEvent) => {
      if (!sim.dragging) return;
      const p = local(e);
      const tap = Math.hypot(p.x - start.x, p.y - start.y) < 6 && performance.now() - start.t < 320;
      if (tap) sim.pointerVel = { x: 0, y: 0 };
      sim.release();
      stage.classList.remove('dragging');
      if (tap) this.zone.run(() => this.flip());
      kick();
    };

    card.addEventListener('pointerdown', down);
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerup', up);
    card.addEventListener('pointercancel', up);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      card.removeEventListener('pointerdown', down);
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerup', up);
      card.removeEventListener('pointercancel', up);
    };
  }
}
