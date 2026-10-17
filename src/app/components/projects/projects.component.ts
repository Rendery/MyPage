import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { BienestarDemoComponent } from './bienestar-demo.component';
import { RevealDirective, SplitDirective, TiltDirective } from '../../directives/motion.directives';
import { ModeService } from '../../services/mode.service';
import { I18nService } from '../../i18n/i18n.service';
import { PROJECTS } from '../../data/profile.data';

@Component({
  selector: 'app-projects',
  imports: [BienestarDemoComponent, RevealDirective, SplitDirective, TiltDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  readonly mode = inject(ModeService);
  readonly i18n = inject(I18nService);
  readonly projects = PROJECTS;
  readonly atStart = signal(true);
  readonly atEnd = signal(false);

  private rail = viewChild.required<ElementRef<HTMLElement>>('rail');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const rail = this.rail().nativeElement;
      const update = () => {
        this.atStart.set(rail.scrollLeft < 8);
        this.atEnd.set(rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8);
      };
      update();
      rail.addEventListener('scroll', update, { passive: true });

      // Arrastrar con el mouse para desplazar (en táctil ya es nativo).
      let startX = 0;
      let startLeft = 0;
      let dragging = false;
      let moved = false;
      const down = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        dragging = true;
        moved = false;
        startX = e.clientX;
        startLeft = rail.scrollLeft;
        rail.classList.add('grabbing');
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        rail.scrollLeft = startLeft - dx;
      };
      const up = () => {
        dragging = false;
        rail.classList.remove('grabbing');
      };
      const click = (e: MouseEvent) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      };
      rail.addEventListener('pointerdown', down);
      addEventListener('pointermove', move);
      addEventListener('pointerup', up);
      rail.addEventListener('click', click, true);

      destroyRef.onDestroy(() => {
        rail.removeEventListener('scroll', update);
        rail.removeEventListener('pointerdown', down);
        removeEventListener('pointermove', move);
        removeEventListener('pointerup', up);
        rail.removeEventListener('click', click, true);
      });
    });
  }

  scroll(dir: 1 | -1): void {
    const rail = this.rail().nativeElement;
    const card = rail.querySelector<HTMLElement>('.proj');
    rail.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: 'smooth' });
  }
}
