import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { MagneticDirective, RevealDirective, SplitDirective } from '../../directives/motion.directives';
import { FeedbackService } from '../../services/feedback.service';
import { MotionService } from '../../services/motion.service';
import { ModeService } from '../../services/mode.service';
import { I18nService } from '../../i18n/i18n.service';
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
  readonly mode = inject(ModeService);
  readonly i18n = inject(I18nService);
  readonly profile = PROFILE;
  readonly year = new Date().getFullYear();

  readonly name = signal('');
  readonly company = signal('');
  readonly message = signal('');

  readonly mailto = computed(() => {
    const t = this.i18n.c().ui.contact;
    const who = [this.name().trim(), this.company().trim()].filter(Boolean).join(' · ');
    const body = `${this.message().trim() || t.defaultBody}\n\n${who}`;
    return `mailto:${PROFILE.email}?subject=${encodeURIComponent(t.subject(who))}&body=${encodeURIComponent(body.trim())}`;
  });

  copyEmail(): void {
    this.feedback.copy(PROFILE.email, this.i18n.c().ui.contact.mailCopied);
  }

  send(): void {
    location.href = this.mailto();
    this.feedback.toast(this.i18n.c().ui.contact.opening, '✉');
  }

  top(): void {
    this.motion.scrollTo(0);
  }
}
