import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { MagneticDirective, RevealDirective, SplitDirective } from '../../directives/motion.directives';
import { FeedbackService } from '../../services/feedback.service';
import { MotionService } from '../../services/motion.service';
import { PROFILE } from '../../data/profile.data';

@Component({
  selector: 'app-contact',
  imports: [AvatarComponent, MagneticDirective, RevealDirective, SplitDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private feedback = inject(FeedbackService);
  private motion = inject(MotionService);
  readonly profile = PROFILE;
  readonly year = new Date().getFullYear();

  readonly name = signal('');
  readonly company = signal('');
  readonly message = signal('');

  readonly mailto = computed(() => {
    const who = [this.name().trim(), this.company().trim()].filter(Boolean).join(' · ');
    const subject = who ? `Contacto desde tu CV web — ${who}` : 'Contacto desde tu CV web';
    const body = `${this.message().trim() || 'Hola Edery, me gustaría conversar contigo.'}\n\n${who}`;
    return `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.trim())}`;
  });

  copyEmail(): void {
    this.feedback.copy(PROFILE.email, 'Correo');
  }

  send(): void {
    location.href = this.mailto();
    this.feedback.toast('Abriendo tu correo…', '✉');
  }

  top(): void {
    this.motion.scrollTo(0);
  }
}
