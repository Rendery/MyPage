import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { ThemeService } from '../../services/theme.service';
import { UiService } from '../../services/ui.service';
import { ModeService } from '../../services/mode.service';
import { I18nService } from '../../i18n/i18n.service';
import { PROFILE, SECTIONS } from '../../data/profile.data';

type Group = 'go' | 'actions' | 'links';

interface Command {
  id: string;
  group: Group;
  label: string;
  icon: string;
  hint?: string;
  keywords?: string;
  run: () => void;
}

const plain = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

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
  readonly i18n = inject(I18nService);
  private theme = inject(ThemeService);
  private feedback = inject(FeedbackService);
  private mode = inject(ModeService);

  readonly query = signal('');
  readonly index = signal(0);
  private input = viewChild<ElementRef<HTMLInputElement>>('input');

  /** Los comandos se arman en el idioma actual. */
  private readonly commands = computed<Command[]>(() => {
    const c = this.i18n.c();
    const t = c.ui.palette;
    return [
      ...SECTIONS.filter((s) => !(s.id === 'stack' && this.mode.simple())).map<Command>((s) => ({
        id: `go-${s.id}`,
        group: 'go',
        label: c.sections[s.id],
        icon: s.icon,
        run: () => this.ui.go(s.id),
      })),
      {
        id: 'badge',
        group: 'actions',
        label: t.badge,
        icon: '🪪',
        keywords: 'empresa company empresa badge cracha fotocheck',
        run: () => {
          this.ui.go('fotocheck');
          setTimeout(() => document.querySelector<HTMLInputElement>('#fotocheck input[type=text]')?.focus({ preventScroll: true }), 1300);
        },
      },
      { id: 'mode', group: 'actions', label: t.mode, icon: '⇄', keywords: 'tecnico technical simple modo mode version', run: () => this.mode.toggle() },
      ...this.i18n.langs
        .filter((l) => l.id !== this.i18n.lang())
        .map<Command>((l) => ({
          id: `lang-${l.id}`,
          group: 'actions',
          label: t.lang(l.name),
          icon: '🌐',
          hint: l.short,
          keywords: 'idioma language lingua',
          run: () => this.i18n.set(l.id),
        })),
      { id: 'theme', group: 'actions', label: t.theme, icon: '◐', keywords: 'dark light tema theme', run: () => this.theme.toggle() },
      { id: 'email', group: 'actions', label: t.email, icon: '⧉', hint: PROFILE.email, keywords: 'email mail correo', run: () => this.feedback.copy(PROFILE.email, c.ui.contact.mailCopied) },
      { id: 'cv', group: 'actions', label: t.cv, icon: '↓', keywords: 'cv curriculum resume pdf', run: () => this.download() },
      {
        id: 'rainbow',
        group: 'actions',
        label: t.rainbow,
        icon: '🌈',
        keywords: 'konami',
        run: () => {
          this.theme.toggleRainbow();
          this.feedback.confetti();
        },
      },
      { id: 'linkedin', group: 'links', label: 'LinkedIn', icon: 'in', hint: 'linkedin.com/in/edery…', run: () => open(PROFILE.linkedin, '_blank', 'noopener') },
      { id: 'github', group: 'links', label: 'GitHub', icon: '⌥', hint: 'github.com/EderyRAV', run: () => open(PROFILE.github, '_blank', 'noopener') },
      { id: 'whatsapp', group: 'links', label: 'WhatsApp', icon: '✆', hint: PROFILE.phone, run: () => open(PROFILE.whatsapp, '_blank', 'noopener') },
    ];
  });

  readonly results = computed(() => {
    const q = plain(this.query()).trim();
    const all = this.commands();
    if (!q) return all;
    return all.filter((c) => plain(`${c.label} ${this.groupLabel(c.group)} ${c.keywords ?? ''} ${c.hint ?? ''}`).includes(q));
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

  groupLabel(group: Group): string {
    const t = this.i18n.c().ui.palette;
    return group === 'go' ? t.go : group === 'actions' ? t.actions : t.links;
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
    this.feedback.toast(this.i18n.c().ui.palette.downloading, '↓');
  }

  private scrollActive(): void {
    setTimeout(() => document.querySelector('.pal-item.active')?.scrollIntoView({ block: 'nearest' }));
  }
}
