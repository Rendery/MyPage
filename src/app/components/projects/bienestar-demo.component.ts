import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FeedbackService } from '../../services/feedback.service';
import { ModeService } from '../../services/mode.service';
import { BIENESTAR_MODULES, BienestarModule } from '../../data/profile.data';

interface Cita {
  hora: string;
  paciente: string;
  terapeuta: string;
  monto: number;
  pagado: boolean;
}

type Periodo = 'semana' | 'mes';

const CAJA: Record<Periodo, { id: string; label: string; value: number; color: string }[]> = {
  semana: [
    { id: 'efectivo', label: 'Efectivo', value: 1240, color: 'var(--lime)' },
    { id: 'tarjeta', label: 'Tarjeta', value: 2380, color: 'var(--cyan)' },
    { id: 'transferencia', label: 'Transferencia', value: 1760, color: 'var(--violet)' },
    { id: 'extornos', label: 'Extornos', value: -160, color: 'var(--orange)' },
  ],
  mes: [
    { id: 'efectivo', label: 'Efectivo', value: 5120, color: 'var(--lime)' },
    { id: 'tarjeta', label: 'Tarjeta', value: 9860, color: 'var(--cyan)' },
    { id: 'transferencia', label: 'Transferencia', value: 7430, color: 'var(--violet)' },
    { id: 'extornos', label: 'Extornos', value: -640, color: 'var(--orange)' },
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
  readonly modules = BIENESTAR_MODULES;
  readonly active = signal<BienestarModule['id']>('sunat');
  readonly current = computed(() => this.modules.find((m) => m.id === this.active())!);

  // --- SUNAT ---
  readonly tipo = signal<'boleta' | 'factura'>('boleta');
  readonly doc = signal('12345678');
  readonly monto = signal(150);
  readonly correlativo = signal(118);
  readonly comprobante = signal<null | { serie: string; doc: string; total: number; base: number; igv: number }>(null);
  readonly docError = computed(() => {
    const len = this.tipo() === 'boleta' ? 8 : 11;
    if (!new RegExp(`^\\d{${len}}$`).test(this.doc())) return `El ${this.tipo() === 'boleta' ? 'DNI' : 'RUC'} debe tener ${len} dígitos`;
    if (!(this.monto() > 0)) return 'El monto debe ser mayor a 0';
    return null;
  });
  readonly today = new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date());

  // --- AGENDAS ---
  readonly citas = signal<Cita[]>([
    { hora: '09:00', paciente: 'Paciente A. R.', terapeuta: 'Ps. Gómez', monto: 120, pagado: true },
    { hora: '10:30', paciente: 'Paciente B. T.', terapeuta: 'Ps. Ríos', monto: 80, pagado: false },
    { hora: '15:00', paciente: 'Paciente C. M.', terapeuta: 'Ps. Gómez', monto: 120, pagado: true },
    { hora: '17:30', paciente: 'Paciente D. L.', terapeuta: 'Ps. Salas', monto: 100, pagado: false },
  ]);
  readonly pendientes = computed(() => this.citas().filter((c) => !c.pagado));
  readonly mensaje = computed(() => {
    const p = this.pendientes();
    if (!p.length) return 'Todas las citas de mañana están pagadas ✅';
    return ['Recordatorio de citas de mañana 📅', ...p.map((c) => `• ${c.hora} · ${c.paciente} · ${c.terapeuta} · pendiente S/ ${c.monto}`)].join('\n');
  });

  // --- FINANZAS ---
  readonly periodo = signal<Periodo>('semana');
  readonly foco = signal<string | null>(null);
  readonly caja = computed(() => CAJA[this.periodo()]);
  readonly ingresos = computed(() => this.caja().filter((c) => c.value > 0).reduce((s, c) => s + c.value, 0));
  readonly neto = computed(() => this.caja().reduce((s, c) => s + c.value, 0));

  pick(id: BienestarModule['id']): void {
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
    this.feedback.toast('Comprobante generado en PDF (demo)', '🧾');
  }

  togglePago(i: number): void {
    this.citas.update((list) => list.map((c, j) => (j === i ? { ...c, pagado: !c.pagado } : c)));
    this.feedback.haptic(6);
  }

  copiarMensaje(): void {
    this.feedback.copy(this.mensaje(), 'Mensaje para WhatsApp');
  }

  share(value: number): number {
    return Math.max(0, (value / this.ingresos()) * 100);
  }
}
