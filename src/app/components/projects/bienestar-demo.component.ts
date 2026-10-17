import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FeedbackService } from '../../services/feedback.service';
import { ModeService } from '../../services/mode.service';
import { I18nService } from '../../i18n/i18n.service';
import { BIENESTAR_MODULES, ModuleId } from '../../data/profile.data';

interface Cita {
  hora: string;
  /** Índice del paciente en i18n → ui.demo.patients. */
  paciente: number;
  terapeuta: string;
  monto: number;
  pagado: boolean;
}

type Periodo = 'semana' | 'mes';
type Metodo = 'efectivo' | 'tarjeta' | 'transferencia' | 'extornos';

const CAJA: Record<Periodo, { id: Metodo; value: number; color: string }[]> = {
  semana: [
    { id: 'efectivo', value: 1240, color: 'var(--lime)' },
    { id: 'tarjeta', value: 2380, color: 'var(--cyan)' },
    { id: 'transferencia', value: 1760, color: 'var(--violet)' },
    { id: 'extornos', value: -160, color: 'var(--orange)' },
  ],
  mes: [
    { id: 'efectivo', value: 5120, color: 'var(--lime)' },
    { id: 'tarjeta', value: 9860, color: 'var(--cyan)' },
    { id: 'transferencia', value: 7430, color: 'var(--violet)' },
    { id: 'extornos', value: -640, color: 'var(--orange)' },
  ],
};

/** Mini demos interactivas de los módulos de Bienestar (con datos de ejemplo). */
@Component({
  selector: 'app-bienestar-demo',
  imports: [DecimalPipe],
  templateUrl: './bienestar-demo.component.html',
  styleUrl: './bienestar-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienestarDemoComponent {
  private feedback = inject(FeedbackService);
  readonly mode = inject(ModeService);
  readonly i18n = inject(I18nService);
  readonly modules = BIENESTAR_MODULES;
  readonly active = signal<ModuleId>('sunat');
  readonly current = computed(() => this.modules.find((m) => m.id === this.active())!);

  // --- SUNAT ---
  readonly tipo = signal<'boleta' | 'factura'>('boleta');
  readonly doc = signal('12345678');
  readonly monto = signal(150);
  readonly correlativo = signal(118);
  readonly comprobante = signal<null | { serie: string; doc: string; total: number; base: number; igv: number }>(null);
  readonly docError = computed(() => {
    const t = this.i18n.c().ui.demo;
    const len = this.tipo() === 'boleta' ? 8 : 11;
    if (!new RegExp(`^\\d{${len}}$`).test(this.doc())) return t.errDoc(this.tipo() === 'boleta' ? t.dni : t.ruc, len);
    if (!(this.monto() > 0)) return t.errAmount;
    return null;
  });
  readonly today = computed(() => new Intl.DateTimeFormat(this.i18n.meta().locale, { dateStyle: 'medium' }).format(new Date()));

  // --- AGENDAS ---
  readonly citas = signal<Cita[]>([
    { hora: '09:00', paciente: 0, terapeuta: 'Ps. Gómez', monto: 120, pagado: true },
    { hora: '10:30', paciente: 1, terapeuta: 'Ps. Ríos', monto: 80, pagado: false },
    { hora: '15:00', paciente: 2, terapeuta: 'Ps. Gómez', monto: 120, pagado: true },
    { hora: '17:30', paciente: 3, terapeuta: 'Ps. Salas', monto: 100, pagado: false },
  ]);
  readonly pendientes = computed(() => this.citas().filter((c) => !c.pagado));
  readonly mensaje = computed(() => {
    const t = this.i18n.c().ui.demo;
    const p = this.pendientes();
    if (!p.length) return t.allPaid;
    return [t.reminderTitle, ...p.map((c) => t.pendingLine(c.hora, t.patients[c.paciente], c.terapeuta, c.monto))].join('\n');
  });

  // --- FINANZAS ---
  readonly periodo = signal<Periodo>('semana');
  readonly foco = signal<string | null>(null);
  readonly caja = computed(() => CAJA[this.periodo()]);
  readonly ingresos = computed(() => this.caja().filter((c) => c.value > 0).reduce((s, c) => s + c.value, 0));
  readonly neto = computed(() => this.caja().reduce((s, c) => s + c.value, 0));

  pick(id: ModuleId): void {
    this.active.set(id);
    this.feedback.haptic(8);
  }

  setDoc(value: string): void {
    this.doc.set(value.replace(/\D/g, '').slice(0, 11));
  }

  setMonto(value: string): void {
    this.monto.set(Math.max(0, Math.min(99999, Number(value) || 0)));
  }

  setTipo(t: 'boleta' | 'factura'): void {
    this.tipo.set(t);
    this.doc.set(t === 'boleta' ? '12345678' : '20123456789');
    this.comprobante.set(null);
  }

  generar(): void {
    if (this.docError()) {
      this.feedback.haptic([10, 40, 10]);
      return;
    }
    const n = this.correlativo() + 1;
    this.correlativo.set(n);
    const total = this.monto();
    const base = Math.round((total / 1.18) * 100) / 100;
    const nuevo = {
      serie: `${this.tipo() === 'boleta' ? 'B001' : 'F001'}-${String(n).padStart(6, '0')}`,
      doc: this.doc(),
      total,
      base,
      igv: Math.round((total - base) * 100) / 100,
    };
    // Quita el recibo anterior y luego pinta el nuevo, para que la animación de impresión se repita.
    this.comprobante.set(null);
    setTimeout(() => this.comprobante.set(nuevo));
    this.feedback.haptic(12);
    this.feedback.toast(this.i18n.c().ui.demo.toast, '🧾');
  }

  togglePago(i: number): void {
    this.citas.update((list) => list.map((c, j) => (j === i ? { ...c, pagado: !c.pagado } : c)));
    this.feedback.haptic(6);
  }

  copiarMensaje(): void {
    this.feedback.copy(this.mensaje(), this.i18n.c().ui.demo.copyLabel);
  }

  share(value: number): number {
    return Math.max(0, (value / this.ingresos()) * 100);
  }
}
