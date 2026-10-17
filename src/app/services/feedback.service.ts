import { Injectable, NgZone, inject, signal } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';

export interface Toast {
  id: number;
  icon: string;
  text: string;
  ms: number;
}

const CONFETTI_COLORS = ['#c8f031', '#4de1f0', '#ff6b2c', '#9b8cff', '#ff5c9a', '#ffffff'];

/** Toasts, confeti y vibración: la retroalimentación de las interacciones. */
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private zone = inject(NgZone);
  private i18n = inject(I18nService);
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);

  toast(text: string, icon = '✓', ms = 2600): void {
    const id = ++this.nextId;
    this.toasts.update((list) => [...list.slice(-2), { id, icon, text, ms }]);
    setTimeout(() => this.toasts.update((list) => list.filter((t) => t.id !== id)), ms);
  }

  haptic(pattern: number | number[] = 12): void {
    try {
      navigator.vibrate?.(pattern);
    } catch {
      /* sin soporte de vibración */
    }
  }

  async copy(text: string, label: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.toast(this.i18n.c().ui.copied(label), '⧉');
    } catch {
      this.toast(text, 'ℹ');
    }
    this.haptic();
  }

  confetti(x = innerWidth / 2, y = innerHeight / 2, count = 160): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.zone.runOutsideAngular(() => {
      const canvas = document.createElement('canvas');
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      Object.assign(canvas.style, {
        position: 'fixed',
        inset: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '9999',
      });
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);

      const parts = Array.from({ length: count }, () => {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
        const speed = 7 + Math.random() * 11;
        return {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          w: 6 + Math.random() * 7,
          h: 8 + Math.random() * 10,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.4,
          color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
          round: Math.random() < 0.3,
          life: 1,
        };
      });

      const tick = () => {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        let alive = 0;
        for (const p of parts) {
          if (p.life <= 0) continue;
          alive++;
          p.vx *= 0.985;
          p.vy = p.vy * 0.985 + 0.32;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          if (p.y > innerHeight + 40) p.life = 0;
          else p.life -= 0.004;
          ctx.save();
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          if (p.round) {
            ctx.beginPath();
            ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)));
          }
          ctx.restore();
        }
        if (alive) requestAnimationFrame(tick);
        else canvas.remove();
      };
      requestAnimationFrame(tick);
    });
  }
}
