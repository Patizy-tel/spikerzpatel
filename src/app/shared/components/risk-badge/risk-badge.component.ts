import { Component, computed, input } from '@angular/core';
import { RiskLevel } from '../../../core/models';

@Component({
  selector: 'app-risk-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="badgeClasses()">
      <span class="badge-dot"></span>
      <span class="badge-text">{{ label() || risk() }}</span>
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
      transition: all 0.2s ease;
      cursor: default;
    }

    .badge:hover {
      transform: scale(1.05);
    }

    .badge-dot {
      width: 0.375rem;
      height: 0.375rem;
      border-radius: var(--radius-full);
      animation: badgePulse 2s ease-in-out infinite;
    }

    @keyframes badgePulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.2);
      }
    }

    .badge-text {
      line-height: 1;
    }

    .badge-critical {
      color: var(--color-critical);
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border: 1px solid #fecaca;
      box-shadow: 0 1px 2px rgba(220, 38, 38, 0.1);
    }

    .badge-critical .badge-dot {
      background-color: var(--color-critical);
      box-shadow: 0 0 4px var(--color-critical);
    }

    .badge-critical:hover {
      box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
    }

    .badge-high {
      color: var(--color-high);
      background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
      border: 1px solid #fed7aa;
      box-shadow: 0 1px 2px rgba(249, 115, 22, 0.1);
    }

    .badge-high .badge-dot {
      background-color: var(--color-high);
      box-shadow: 0 0 4px var(--color-high);
    }

    .badge-high:hover {
      box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
    }

    .badge-medium {
      color: var(--color-medium);
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1px solid #bfdbfe;
      box-shadow: 0 1px 2px rgba(59, 130, 246, 0.1);
    }

    .badge-medium .badge-dot {
      background-color: var(--color-medium);
      box-shadow: 0 0 4px var(--color-medium);
    }

    .badge-medium:hover {
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    }

    .badge-low {
      color: var(--color-low);
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1px solid #bbf7d0;
      box-shadow: 0 1px 2px rgba(34, 197, 94, 0.1);
    }

    .badge-low .badge-dot {
      background-color: var(--color-low);
      box-shadow: 0 0 4px var(--color-low);
    }

    .badge-low:hover {
      box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
    }
  `,
})
export class RiskBadgeComponent {
  risk = input.required<RiskLevel>();
  label = input<string>();

  badgeClasses = computed(() => `badge-${this.risk()}`);
}
