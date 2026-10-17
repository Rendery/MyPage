import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { ThemeService } from '../../services/theme.service';
import { UiService } from '../../services/ui.service';
import { ModeService } from '../../services/mode.service';
import { PROFILE, SECTIONS } from '../../data/profile.data';

interface Command {
  id: string;
  group: 'Ir a' | 'Acciones' | 'Enlaces';
  label: string;
  icon: string;
  hint?: string;
  keywords?: string;
  run: () => void;
}

/** Paleta de comandos (Ctrl/⌘ + K) para navegar y ejecutar acciones con el teclado. */
@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onGlobalKey($event)' },
})
export class PaletteComponent {
  readonly ui = inject(UiService);
  private theme = inject(ThemeService);
  private feedback = inject(FeedbackService);
  private mode = inject(ModeService);

  readonly query = signal('');
  readonly index = signal(0);
  private input = viewChild<ElementRef<HTMLInputElement>>('input');

  private readonly commands: Command[] = [
    ...SECTIONS.map<Command>((s) => ({
      id: `go-${s.id}`,
      group: 'Ir a',
      label: s.label,
      icon: s.icon,
      run: () => this.ui.go(s.id),
    })),
    {
      id: 'badge',
      group: 'Acciones',
      label: 'Ver mi fotocheck con el nombre de tu empresa',
      icon: '🪪',
      keywords: 'empresa contratar badge',
      run: () => {
        this.ui.go('fotocheck');
        setTimeout(() => document.querySelector<HTMLInputElement>('#fotocheck input[type=text]')?.focus({ preventScroll: true }), 1300);
      },
    },
    {
      id: 'mode',
      group: 'Acciones',
      label: 'Cambiar versión: simple / técnica',
      icon: '⇄',
      keywords: 'tecnico tecnica simple modo version',
      run: () => this.mode.toggle(),
    },
    { id: 'theme', group: 'Acciones', label: 'Cambiar tema claro / oscuro', icon: '◐', keywords: 'dark light modo', run: () => this.theme.toggle() },
    { id: 'email', group: 'Acciones', label: 'Copiar mi correo', icon: '⧉', hint: PROFILE.email, keywords: 'email mail', run: () => this.feedback.copy(PROFILE.email, 'Correo') },
    { id: 'cv', group: 'Acciones', label: 'Descargar CV en PDF', icon: '↓', keywords: 'curriculum pdf', run: () => this.download() },
    {
      id: 'rainbow',
      group: 'Acciones',
      label: 'Modo arcoíris (easter egg)',
      icon: '🌈',
      keywords: 'konami secreto',
      run: () => {
        this.theme.toggleRainbow();
        this.feedback.confetti();
      },
    },
    { id: 'linkedin', group: 'Enlaces', label: 'LinkedIn', icon: 'in', hint: 'linkedin.com/in/edery…', run: () => open(PROFILE.linkedin, '_blank', 'noopener') },
    { id: 'github', group: 'Enlaces', label: 'GitHub', icon: '⌥', hint: 'github.com/EderyRAV', run: () => open(PROFILE.github, '_blank', 'noopener') },
    { id: 'whatsapp', group: 'Enlaces', label: 'WhatsApp', icon: '✆', hint: PROFILE.phone, run: () => open(PROFILE.whatsapp, '_blank', 'noopener') },
  ];

  readonly results = computed(() => {
    const q = this.query()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();
    const available = this.commands.filter((c) => !(c.id === 'go-stack' && this.mode.simple()));
    if (!q) return available;
    return available.filter((c) =>
      `${c.label} ${c.group} ${c.keywords ?? ''} ${c.hint ?? ''}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .includes(q),
    );
  });

  constructor() {
    effect(() => {
      if (this.ui.paletteOpen()) {
        this.query.set('');
        this.index.set(0);
        setTimeout(() => this.input()?.nativeElement.focus(), 30);
      }
    });
  }

  onGlobalKey(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    const typing = target.matches('input, textarea, [contenteditable]');
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.ui.openPalette(!this.ui.paletteOpen());
    } else if (e.key === '/' && !typing && !this.ui.paletteOpen()) {
      e.preventDefault();
      this.ui.openPalette();
    } else if (e.key === 'Escape' && this.ui.paletteOpen()) {
      this.close();
    }
  }

  onKey(e: KeyboardEvent): void {
    const n = this.results().length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.index.update((i) => (i + 1) % Math.max(n, 1));
      this.scrollActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.index.update((i) => (i - 1 + n) % Math.max(n, 1));
      this.scrollActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = this.results()[this.index()];
      if (cmd) this.exec(cmd);
    }
  }

  setQuery(v: string): void {
    this.query.set(v);
    this.index.set(0);
  }

  exec(cmd: Command): void {
    this.close();
    // Deja que el scroll se desbloquee antes de navegar.
    setTimeout(() => cmd.run(), 60);
  }

  close(): void {
    this.ui.openPalette(false);
  }

  isFirstOfGroup(i: number): boolean {
    const r = this.results();
    return i === 0 || r[i - 1].group !== r[i].group;
  }

  private download(): void {
    const a = document.createElement('a');
    a.href = PROFILE.cv;
    a.download = 'Edery_Abanto_CV.pdf';
    a.click();
    this.feedback.toast('Descargando CV…', '↓');
  }

  private scrollActive(): void {
    setTimeout(() => document.querySelector('.pal-item.active')?.scrollIntoView({ block: 'nearest' }));
  }
}
