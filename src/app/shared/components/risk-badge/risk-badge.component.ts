import { Component, computed, input } from '@angular/core';
import { RiskLevel } from '../../../core/models';

@Component({
  selector: 'app-risk-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center font-medium"
      [class]="badgeClasses()"
    >
      {{ label() || risk() }}
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    span {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      text-transform: capitalize;
    }

    .badge-critical {
      color: var(--color-critical);
      background-color: color-mix(in srgb, var(--color-critical) 15%, transparent);
    }

    .badge-high {
      color: var(--color-high);
      background-color: color-mix(in srgb, var(--color-high) 15%, transparent);
    }

    .badge-medium {
      color: var(--color-medium);
      background-color: color-mix(in srgb, var(--color-medium) 15%, transparent);
    }

    .badge-low {
      color: var(--color-low);
      background-color: color-mix(in srgb, var(--color-low) 15%, transparent);
    }
  `,
})
export class RiskBadgeComponent {
  risk = input.required<RiskLevel>();
  label = input<string>();

  badgeClasses = computed(() => `badge-${this.risk()}`);
}
