/**
 * Simulación del cordón del fotocheck con integración de Verlet.
 * El punto 0 está fijo arriba; el último punto es el gancho de la tarjeta (más pesado).
 * Además del cordón, controla el giro de la tarjeta sobre su eje vertical (rotY).
 */

interface Pt {
  x: number;
  y: number;
  px: number;
  py: number;
  inv: number;
}

const CARD_INV_MASS = 0.35;

export class LanyardSim {
  pts: Pt[] = [];
  segLen = 0;
  ropeLen = 0;

  rotY = 0;
  velY = 0;
  private flipTarget: number | null = null;

  dragging = false;
  pointerVel = { x: 0, y: 0 };

  get anchor(): Pt {
    return this.pts[0];
  }

  get end(): Pt {
    return this.pts[this.pts.length - 1];
  }

  /** Reinicia el cordón. `swingIn` lo coloca de lado para que entre balanceándose. */
  reset(anchorX: number, anchorY: number, length: number, segments = 12, swingIn = false): void {
    this.ropeLen = length;
    this.segLen = length / segments;
    this.pts = Array.from({ length: segments + 1 }, (_, i) => {
      const t = i * this.segLen;
      // Entrada balanceándose desde ~40°: llamativa, pero sin salirse del escenario.
      const x = swingIn ? anchorX + t * 0.64 : anchorX;
      const y = swingIn ? anchorY + t * 0.77 : anchorY + t;
      return { x, y, px: x, py: y, inv: i === 0 ? 0 : i === segments ? CARD_INV_MASS : 1 };
    });
  }

  setAnchor(x: number, y: number): void {
    const a = this.anchor;
    a.x = a.px = x;
    a.y = a.py = y;
  }

  /** Mueve el gancho mientras se arrastra, sin estirar el cordón más de la cuenta. */
  dragTo(x: number, y: number, dvx: number, dvy: number): void {
    const a = this.anchor;
    const dx = x - a.x;
    const dy = y - a.y;
    const d = Math.hypot(dx, dy);
    const max = this.ropeLen * 1.2;
    if (d > max) {
      x = a.x + (dx / d) * max;
      y = a.y + (dy / d) * max;
    }
    const e = this.end;
    e.x = e.px = x;
    e.y = e.py = y;
    this.pointerVel.x = this.pointerVel.x * 0.6 + dvx * 0.4;
    this.pointerVel.y = this.pointerVel.y * 0.6 + dvy * 0.4;
  }

  grab(): void {
    this.dragging = true;
    this.end.inv = 0;
    this.pointerVel = { x: 0, y: 0 };
    this.flipTarget = null;
  }

  release(): void {
    this.dragging = false;
    const e = this.end;
    e.inv = CARD_INV_MASS;
    // Lanza la tarjeta con la velocidad del puntero y le da giro según el movimiento horizontal.
    e.px = e.x - this.pointerVel.x * 0.9;
    e.py = e.y - this.pointerVel.y * 0.9;
    this.velY += Math.max(-46, Math.min(46, this.pointerVel.x * 1.6));
  }

  flip(direction = 1): void {
    const base = Math.round(this.rotY / 180) * 180;
    this.flipTarget = base + 180 * direction;
  }

  /** Pequeño empujón (brisa) para que nunca quede totalmente quieto. */
  nudge(force: number): void {
    this.end.px -= force;
  }

  step(): void {
    const g = 0.6;
    const damping = 0.982;

    for (let i = 1; i < this.pts.length; i++) {
      const p = this.pts[i];
      if (p.inv === 0) continue;
      const vx = (p.x - p.px) * damping;
      const vy = (p.y - p.py) * damping;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + g;
    }

    for (let k = 0; k < 16; k++) {
      for (let i = 0; i < this.pts.length - 1; i++) {
        const a = this.pts[i];
        const b = this.pts[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.0001;
        const total = a.inv + b.inv;
        if (!total) continue;
        const diff = (d - this.segLen) / d;
        a.x += dx * diff * (a.inv / total);
        a.y += dy * diff * (a.inv / total);
        b.x -= dx * diff * (b.inv / total);
        b.y -= dy * diff * (b.inv / total);
      }
    }

    // Giro sobre el eje Y: resorte hacia la cara más cercana (frente o reverso).
    if (this.flipTarget !== null) {
      this.velY += (this.flipTarget - this.rotY) * 0.07;
      this.velY *= 0.84;
      if (Math.abs(this.flipTarget - this.rotY) < 0.4 && Math.abs(this.velY) < 0.2) {
        this.rotY = this.flipTarget;
        this.velY = 0;
        this.flipTarget = null;
      }
    } else if (!this.dragging) {
      if (Math.abs(this.velY) < 4) {
        const nearest = Math.round(this.rotY / 180) * 180;
        this.velY += (nearest - this.rotY) * 0.04;
      }
      this.velY *= 0.95;
    } else {
      this.velY *= 0.9;
    }
    this.rotY += this.velY;
  }

  /** Ángulo de la tarjeta (grados) según el último tramo del cordón. */
  cardAngle(): number {
    const n = this.pts.length;
    const a = this.pts[n - 3] ?? this.pts[0];
    const b = this.pts[n - 1];
    return (-Math.atan2(b.x - a.x, b.y - a.y) * 180) / Math.PI;
  }

  /** Inclinación hacia la cámara según la velocidad vertical. */
  cardTilt(): number {
    const e = this.end;
    const vy = this.dragging ? this.pointerVel.y : e.y - e.py;
    return Math.max(-24, Math.min(24, -vy * 1.4));
  }

  /** Giro mostrado (en arrastre se inclina un poco hacia donde se mueve). */
  displayRotY(): number {
    return this.rotY + (this.dragging ? Math.max(-28, Math.min(28, this.pointerVel.x * 1.5)) : 0);
  }

  energy(): number {
    let e = Math.abs(this.velY) + (this.flipTarget !== null ? 1 : 0);
    for (const p of this.pts) e += Math.abs(p.x - p.px) + Math.abs(p.y - p.py);
    return e;
  }

  /** Curva suave del cordón para el SVG. */
  path(): string {
    const p = this.pts;
    let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i].x + p[i + 1].x) / 2;
      const my = (p[i].y + p[i + 1].y) / 2;
      d += ` Q${p[i].x.toFixed(1)} ${p[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    const last = p[p.length - 1];
    return `${d} L${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  }
}
