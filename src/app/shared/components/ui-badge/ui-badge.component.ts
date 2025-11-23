import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type BadgeVariant = 'default' | 'critical' | 'high' | 'medium' | 'low' | 'success' | 'warning' | 'info';
export type BadgeSize = 'xs' | 'sm' | 'md';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="badgeClasses">
      @if (dot) {
        <span class="badge-dot"></span>
      }
      @if (icon) {
        <mat-icon>{{ icon }}</mat-icon>
      }
      <ng-content />
    </span>
  `,
  styles: `
    @reference "tailwindcss";

    .badge {
      @apply inline-flex items-center gap-1.5 font-medium rounded-full;
    }

    /* Sizes */
    .size-xs {
      font-size: var(--text-2xs);
      @apply py-0.5 px-2;
    }
    .size-xs mat-icon {
      @apply text-xs w-3 h-3;
    }
    .size-xs .badge-dot {
      @apply w-1.5 h-1.5;
    }

    .size-sm {
      @apply text-xs py-0.5 px-2.5;
    }
    .size-sm mat-icon {
      @apply text-sm w-3.5 h-3.5;
    }
    .size-sm .badge-dot {
      @apply w-2 h-2;
    }

    .size-md {
      @apply text-sm py-1 px-3;
    }
    .size-md mat-icon {
      @apply text-base w-4 h-4;
    }
    .size-md .badge-dot {
      @apply w-2 h-2;
    }

    /* Dot */
    .badge-dot {
      @apply rounded-full shrink-0;
    }

    /* Variants */
    .variant-default {
      @apply bg-slate-100 text-slate-700;
    }
    .variant-default .badge-dot {
      @apply bg-slate-500;
    }

    .variant-critical {
      @apply bg-red-100 text-red-700;
    }
    .variant-critical .badge-dot {
      @apply bg-red-500;
    }

    .variant-high {
      @apply bg-orange-100 text-orange-700;
    }
    .variant-high .badge-dot {
      @apply bg-orange-500;
    }

    .variant-medium {
      @apply bg-yellow-100 text-yellow-700;
    }
    .variant-medium .badge-dot {
      @apply bg-yellow-500;
    }

    .variant-low {
      @apply bg-emerald-100 text-emerald-700;
    }
    .variant-low .badge-dot {
      @apply bg-emerald-500;
    }

    .variant-success {
      @apply bg-emerald-100 text-emerald-700;
    }
    .variant-success .badge-dot {
      @apply bg-emerald-500;
    }

    .variant-warning {
      @apply bg-amber-100 text-amber-700;
    }
    .variant-warning .badge-dot {
      @apply bg-amber-500;
    }

    .variant-info {
      @apply bg-blue-100 text-blue-700;
    }
    .variant-info .badge-dot {
      @apply bg-blue-500;
    }

    /* Uppercase option */
    .uppercase {
      @apply uppercase tracking-wider;
    }

    /* Pulse animation for dot */
    .pulse .badge-dot {
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.9); }
    }
  `,
})
export class UiBadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'sm';
  @Input() dot = false;
  @Input() pulse = false;
  @Input() icon?: string;
  @Input() uppercase = false;

  get badgeClasses(): string {
    return [
      'badge',
      `variant-${this.variant}`,
      `size-${this.size}`,
      this.uppercase ? 'uppercase' : '',
      this.pulse ? 'pulse' : '',
    ].filter(Boolean).join(' ');
  }
}
