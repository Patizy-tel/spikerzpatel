import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)"
    >
      @if (loading) {
        <span class="loading-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
      } @else {
        @if (iconLeft) {
          <mat-icon class="icon-left">{{ iconLeft }}</mat-icon>
        }
        <span class="btn-content"><ng-content /></span>
        @if (iconRight) {
          <mat-icon class="icon-right">{{ iconRight }}</mat-icon>
        }
      }
    </button>
  `,
  styles: `
    @reference "tailwindcss";

    button {
      @apply inline-flex items-center justify-center gap-2 font-medium rounded-lg cursor-pointer
             transition-all duration-200 border-none outline-none select-none;
    }

    button:disabled {
      @apply opacity-50 cursor-not-allowed;
    }

    button:focus-visible {
      @apply ring-2 ring-offset-2 ring-emerald-500;
    }

    /* Sizes */
    .size-sm {
      @apply text-xs py-1.5 px-3;
    }
    .size-sm mat-icon {
      @apply text-sm w-3.5 h-3.5;
    }

    .size-md {
      @apply text-sm py-2 px-4;
    }
    .size-md mat-icon {
      @apply text-base w-4 h-4;
    }

    .size-lg {
      @apply text-base py-2.5 px-6;
    }
    .size-lg mat-icon {
      @apply text-lg w-5 h-5;
    }

    /* Variants */
    .variant-primary {
      @apply bg-emerald-500 text-white;
    }
    .variant-primary:hover:not(:disabled) {
      @apply bg-emerald-600 -translate-y-0.5 shadow-lg shadow-emerald-500/30;
    }

    .variant-secondary {
      @apply bg-white text-slate-600 border border-slate-200;
    }
    .variant-secondary:hover:not(:disabled) {
      @apply bg-slate-50 border-slate-300;
    }

    .variant-danger {
      @apply bg-red-500 text-white;
    }
    .variant-danger:hover:not(:disabled) {
      @apply bg-red-600 -translate-y-0.5 shadow-lg shadow-red-500/30;
    }

    .variant-ghost {
      @apply bg-transparent text-slate-600;
    }
    .variant-ghost:hover:not(:disabled) {
      @apply bg-slate-100;
    }

    .variant-success {
      @apply bg-emerald-500 text-white;
    }
    .variant-success:hover:not(:disabled) {
      @apply bg-emerald-600;
    }

    /* Full width */
    .full-width {
      @apply w-full;
    }

    /* Loading animation */
    .loading-dots {
      @apply flex gap-1;
    }
    .dot {
      @apply w-1.5 h-1.5 bg-current rounded-full;
      animation: bounce 0.6s ease-in-out infinite;
    }
    .dot:nth-child(2) { animation-delay: 0.1s; }
    .dot:nth-child(3) { animation-delay: 0.2s; }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
  `,
})
export class UiButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return [
      `variant-${this.variant}`,
      `size-${this.size}`,
      this.fullWidth ? 'full-width' : '',
    ].filter(Boolean).join(' ');
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
