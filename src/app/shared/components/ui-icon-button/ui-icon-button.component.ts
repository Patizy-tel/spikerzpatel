import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type IconButtonVariant = 'default' | 'primary' | 'danger' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-icon-button',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      [attr.aria-label]="ariaLabel"
      [attr.title]="tooltip"
      (click)="handleClick($event)"
    >
      <mat-icon>{{ icon }}</mat-icon>
    </button>
  `,
  styles: `
    @reference "tailwindcss";

    button {
      @apply inline-flex items-center justify-center rounded-lg cursor-pointer
             transition-all duration-200 border-none outline-none;
    }

    button:disabled {
      @apply opacity-50 cursor-not-allowed;
    }

    button:focus-visible {
      @apply ring-2 ring-offset-2 ring-emerald-500;
    }

    /* Sizes */
    .size-sm {
      @apply w-8 h-8;
    }
    .size-sm mat-icon {
      font-size: var(--icon-sm) !important;
      width: var(--icon-sm) !important;
      height: var(--icon-sm) !important;
    }

    .size-md {
      @apply w-10 h-10;
    }
    .size-md mat-icon {
      @apply text-xl w-5 h-5;
    }

    .size-lg {
      @apply w-12 h-12;
    }
    .size-lg mat-icon {
      @apply text-2xl w-6 h-6;
    }

    /* Variants */
    .variant-default {
      @apply bg-slate-100 text-slate-600;
    }
    .variant-default:hover:not(:disabled) {
      @apply bg-slate-200;
    }

    .variant-primary {
      @apply bg-emerald-500 text-white;
    }
    .variant-primary:hover:not(:disabled) {
      @apply bg-emerald-600;
    }

    .variant-danger {
      @apply bg-red-100 text-red-600;
    }
    .variant-danger:hover:not(:disabled) {
      @apply bg-red-200;
    }

    .variant-ghost {
      @apply bg-transparent text-slate-500;
    }
    .variant-ghost:hover:not(:disabled) {
      @apply bg-slate-100 text-slate-700;
    }

    /* Rounded option */
    .rounded-full {
      @apply rounded-full;
    }
  `,
})
export class UiIconButtonComponent {
  @Input({ required: true }) icon!: string;
  @Input() variant: IconButtonVariant = 'default';
  @Input() size: IconButtonSize = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() rounded = false;
  @Input() ariaLabel?: string;
  @Input() tooltip?: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return [
      `variant-${this.variant}`,
      `size-${this.size}`,
      this.rounded ? 'rounded-full' : '',
    ].filter(Boolean).join(' ');
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
