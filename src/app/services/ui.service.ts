import { Injectable, inject, signal } from '@angular/core';
import { MotionService } from './motion.service';
import { SectionId } from '../data/profile.data';

/** Estado de interfaz compartido: paleta de comandos y sección activa. */
@Injectable({ providedIn: 'root' })
export class UiService {
  private motion = inject(MotionService);

  readonly paletteOpen = signal(false);
  readonly activeSection = signal<SectionId>('inicio');

  openPalette(open = true): void {
    this.paletteOpen.set(open);
    this.motion.lock(open);
  }

  go(id: SectionId): void {
    this.motion.scrollTo(id === 'inicio' ? 0 : `#${id}`);
  }
}
