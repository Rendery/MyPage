import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, effect, inject } from '@angular/core';
import { LoaderComponent } from './components/shell/loader.component';
import { NavComponent } from './components/shell/nav.component';
import { PaletteComponent } from './components/shell/palette.component';
import { CursorComponent } from './components/shell/cursor.component';
import { HeroComponent } from './components/hero/hero.component';
import { BadgeComponent } from './components/badge/badge.component';
import { ServicesComponent } from './components/services/services.component';
import { ScenesComponent } from './components/scenes/scenes.component';
import { AiLabComponent } from './components/ai-lab/ai-lab.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { StackComponent } from './components/stack/stack.component';
import { EducationComponent } from './components/education/education.component';
import { ContactComponent } from './components/contact/contact.component';
import { MotionService } from './services/motion.service';
import { FeedbackService } from './services/feedback.service';
import { ThemeService } from './services/theme.service';
import { ModeService } from './services/mode.service';
import { I18nService } from './i18n/i18n.service';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

@Component({
  selector: 'app-root',
  imports: [
    LoaderComponent,
    NavComponent,
    PaletteComponent,
    CursorComponent,
    HeroComponent,
    BadgeComponent,
    ServicesComponent,
    ScenesComponent,
    AiLabComponent,
    ExperienceComponent,
    ProjectsComponent,
    StackComponent,
    EducationComponent,
    ContactComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'konami($event)' },
})
export class AppComponent {
  readonly feedback = inject(FeedbackService);
  readonly mode = inject(ModeService);
  readonly i18n = inject(I18nService);
  private theme = inject(ThemeService);
  private konamiIndex = 0;

  constructor() {
    // Se inicia antes que los hijos para que el scroll suave exista desde la intro.
    const motion = inject(MotionService);
    motion.init();

    this.pauseOffscreenAnimations();

    // Enlaces compartidos como ...#fotocheck: baja a la sección cuando termina la intro.
    let jumped = false;
    effect(() => {
      if (!motion.introDone() || jumped) return;
      jumped = true;
      const hash = location.hash;
      if (hash.length > 1 && document.querySelector(hash)) setTimeout(() => motion.scrollTo(hash), 700);
    });
  }

  /** Marca las secciones fuera de pantalla para pausar sus animaciones CSS infinitas (ver styles.scss). */
  private pauseOffscreenAnimations(): void {
    const destroyRef = inject(DestroyRef);
    let io: IntersectionObserver | undefined;
    const observeAll = () => {
      io?.disconnect();
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.target.toggleAttribute('data-offscreen', !e.isIntersecting)),
        { rootMargin: '150px 0px' },
      );
      document.querySelectorAll('main > *').forEach((el) => io!.observe(el));
    };
    afterNextRender(observeAll);
    // Al cambiar de versión se reemplazan algunas secciones.
    effect(() => {
      this.mode.mode();
      setTimeout(observeAll, 60);
    });
    destroyRef.onDestroy(() => io?.disconnect());
  }

  konami(e: KeyboardEvent): void {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    this.konamiIndex = key === KONAMI[this.konamiIndex] ? this.konamiIndex + 1 : key === KONAMI[0] ? 1 : 0;
    if (this.konamiIndex === KONAMI.length) {
      this.konamiIndex = 0;
      this.theme.toggleRainbow();
      this.feedback.confetti();
      this.feedback.toast(this.theme.rainbow() ? this.i18n.c().ui.rainbowOn : this.i18n.c().ui.rainbowOff, '🎮');
    }
  }
}
