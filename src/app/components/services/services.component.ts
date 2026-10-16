import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RevealDirective, SplitDirective, TiltDirective } from '../../directives/motion.directives';
import { FeedbackService } from '../../services/feedback.service';
import { CAPABILITIES } from '../../data/profile.data';

@Component({
  selector: 'app-services',
  imports: [RevealDirective, SplitDirective, TiltDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  private feedback = inject(FeedbackService);
  readonly caps = CAPABILITIES;
  readonly open = signal<string | null>(null);

  toggle(id: string): void {
    this.open.update((current) => (current === id ? null : id));
    this.feedback.haptic(8);
  }
}
