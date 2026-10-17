import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injector, NgZone, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { MagneticDirective } from '../../directives/motion.directives';
import { MotionService } from '../../services/motion.service';
import { ThemeService } from '../../services/theme.service';
import { UiService } from '../../services/ui.service';
import { Mode, ModeService } from '../../services/mode.service';
import { FeedbackService } from '../../services/feedback.service';
import { SECTIONS, SectionId } from '../../data/profile.data';

const DESKTOP_LINKS: SectionId[] = ['fotocheck', 'servicios', 'ia', 'experiencia', 'proyectos', 'formacion'];
const DOCK: SectionId[] = ['inicio', 'fotocheck', 'ia', 'proyectos', 'contacto'];

@Component({
  selector: 'app-nav',
  imports: [MagneticDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  readonly ui = inject(UiService);
  readonly theme = inject(ThemeService);
  readonly mode = inject(ModeService);
  private feedback = inject(FeedbackService);
  private motion = inject(MotionService);
  private zone = inject(NgZone);
  private injector = inject(Injector);

  readonly links = SECTIONS.filter((s) => DESKTOP_LINKS.includes(s.id));
  readonly dock = SECTIONS.filter((s) => DOCK.includes(s.id));
  readonly hidden = signal(false);
  /** Resalta el interruptor de versión la primera vez que alguien entra. */
  readonly hint = signal(false);
  readonly scrolled = signal(false);
  readonly isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);

  private bar = viewChild.required<ElementRef<HTMLElement>>('progress');

  constructor() {
    const destroyRef = inject(DestroyRef);

    let hinted = false;
    effect(() => {
      if (!this.motion.introDone() || hinted || !this.mode.firstVisit) return;
      hinted = true;
      setTimeout(() => {
        this.hint.set(true);
        this.feedback.toast('Estás en la versión simple. ¿Eres técnico? Cambia arriba a «Técnico» ↑', '👀', 6500);
        setTimeout(() => this.hint.set(false), 6000);
      }, 2500);
    });

    afterNextRender(() => {
      // Sección activa según lo que está en el centro de la pantalla.
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) this.ui.activeSection.set(e.target.id as SectionId);
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      const observeAll = () => {
        io.disconnect();
        SECTIONS.forEach((s) => {
          const el = document.getElementById(s.id);
          if (el) io.observe(el);
        });
      };
      observeAll();
      // Al cambiar de versión algunas secciones se reemplazan: se vuelven a observar.
      const modeWatch = effect(() => {
        this.mode.mode();
        setTimeout(observeAll, 60);
      }, { injector: this.injector });
      destroyRef.onDestroy(() => modeWatch.destroy());

      // Oculta la barra al bajar y la muestra al subir; barra de progreso.
      const bar = this.bar().nativeElement;
      let lastY = scrollY;
      const off = this.zone.runOutsideAngular(() =>
        this.motion.onScroll((_, progress) => {
          bar.style.transform = `scaleX(${progress})`;
          const y = scrollY;
          const down = y > lastY + 4;
          const up = y < lastY - 4;
          if (down || up) {
            const hide = down && y > 300;
            if (hide !== this.hidden()) this.zone.run(() => this.hidden.set(hide));
            lastY = y;
          }
          const sc = y > 24;
          if (sc !== this.scrolled()) this.zone.run(() => this.scrolled.set(sc));
        }),
      );

      destroyRef.onDestroy(() => {
        io.disconnect();
        off();
      });
    });
  }

  go(id: SectionId, event?: Event): void {
    event?.preventDefault();
    this.ui.go(id);
  }

  setMode(mode: Mode): void {
    this.hint.set(false);
    this.mode.set(mode);
  }

  toggleTheme(e: MouseEvent): void {
    this.theme.toggle({ x: e.clientX, y: e.clientY });
  }
}
