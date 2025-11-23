import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export type CardVariant = 'default' | 'outlined' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cardClasses">
      @if (hasHeader) {
        <div class="card-header">
          <ng-content select="[card-header]" />
        </div>
      }

      <div class="card-body">
        <ng-content />
      </div>

      @if (hasFooter) {
        <div class="card-footer">
          <ng-content select="[card-footer]" />
        </div>
      }
    </div>
  `,
  styles: `
    @reference "tailwindcss";

    .card {
      @apply bg-white rounded-xl overflow-hidden;
    }

    /* Variants */
    .variant-default {
      @apply border border-slate-200;
    }

    .variant-outlined {
      @apply border-2 border-slate-200;
    }

    .variant-elevated {
      @apply shadow-lg border border-slate-100;
    }

    /* Padding */
    .padding-none .card-body { @apply p-0; }
    .padding-sm .card-body { @apply p-4; }
    .padding-md .card-body { @apply p-6; }
    .padding-lg .card-body { @apply p-8; }

    /* Header */
    .card-header {
      @apply px-6 py-4 border-b border-slate-200 bg-slate-50/50;
    }
    .padding-sm .card-header { @apply px-4 py-3; }
    .padding-lg .card-header { @apply px-8 py-5; }

    /* Footer */
    .card-footer {
      @apply px-6 py-4 border-t border-slate-200 bg-slate-50/30;
    }
    .padding-sm .card-footer { @apply px-4 py-3; }
    .padding-lg .card-footer { @apply px-8 py-5; }

    /* Hover effect */
    .hoverable {
      @apply transition-all duration-200 cursor-pointer;
    }
    .hoverable:hover {
      @apply -translate-y-0.5 shadow-lg;
    }

    /* Full height */
    .full-height {
      @apply h-full;
    }
  `,
})
export class UiCardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() padding: CardPadding = 'md';
  @Input() hoverable = false;
  @Input() fullHeight = false;
  @Input() hasHeader = false;
  @Input() hasFooter = false;

  get cardClasses(): string {
    return [
      'card',
      `variant-${this.variant}`,
      `padding-${this.padding}`,
      this.hoverable ? 'hoverable' : '',
      this.fullHeight ? 'full-height' : '',
    ].filter(Boolean).join(' ');
  }
}
