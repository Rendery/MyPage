import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CountUpDirective, RevealDirective, SplitDirective, TiltDirective } from '../../directives/motion.directives';
import { FeedbackService } from '../../services/feedback.service';
import { ModeService } from '../../services/mode.service';
import { CERTS, EDUCATION, PROFILE } from '../../data/profile.data';

const PAGE = 8;

@Component({
  selector: 'app-education',
  imports: [CountUpDirective, RevealDirective, SplitDirective, TiltDirective],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationComponent {
  private feedback = inject(FeedbackService);
  readonly mode = inject(ModeService);

  readonly education = EDUCATION;
  readonly languages = PROFILE.languages;
  readonly total = CERTS.length;
  readonly orgs = (() => {
    const map = new Map<string, number>();
    CERTS.forEach((c) => map.set(c.org, (map.get(c.org) ?? 0) + 1));
    return [...map.entries()].map(([org, n]) => ({ org, n })).sort((a, b) => b.n - a.n);
  })();

  readonly org = signal<string | null>(null);
  readonly query = signal('');
  readonly expanded = signal(false);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return CERTS.filter((c) => (!this.org() || c.org === this.org()) && (!q || `${c.title} ${c.org}`.toLowerCase().includes(q)));
  });
  readonly shown = computed(() => (this.expanded() || this.org() || this.query() ? this.filtered() : this.filtered().slice(0, PAGE)));

  pickOrg(org: string): void {
    this.org.update((o) => (o === org ? null : org));
    this.feedback.haptic(6);
  }

  copyId(id: string): void {
    this.feedback.copy(id, 'ID de credencial');
  }
}
