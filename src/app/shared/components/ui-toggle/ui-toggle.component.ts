import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ToggleSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiToggleComponent),
      multi: true,
    },
  ],
  template: `
    <label class="toggle-wrapper" [class.disabled]="disabled">
      <div class="toggle-content">
        @if (label) {
          <span class="toggle-label">{{ label }}</span>
        }
        @if (description) {
          <span class="toggle-description">{{ description }}</span>
        }
      </div>

      <button
        type="button"
        role="switch"
        [attr.aria-checked]="checked"
        [class]="toggleClasses"
        [disabled]="disabled"
        (click)="toggle()"
      >
        <span class="toggle-slider"></span>
      </button>
    </label>
  `,
  styles: `
    @reference "tailwindcss";

    .toggle-wrapper {
      @apply flex items-center justify-between gap-4 cursor-pointer;
    }

    .toggle-wrapper.disabled {
      @apply opacity-50 cursor-not-allowed;
    }

    .toggle-content {
      @apply flex flex-col gap-0.5;
    }

    .toggle-label {
      @apply text-sm font-medium text-slate-800;
    }

    .toggle-description {
      @apply text-xs text-slate-500;
    }

    /* Toggle switch */
    .toggle-switch {
      @apply relative inline-flex shrink-0 bg-slate-200 rounded-full cursor-pointer
             transition-colors duration-200 border-none outline-none;
    }

    .toggle-switch:focus-visible {
      @apply ring-2 ring-offset-2 ring-emerald-500;
    }

    .toggle-switch:disabled {
      @apply cursor-not-allowed;
    }

    .toggle-switch.checked {
      @apply bg-emerald-500;
    }

    .toggle-slider {
      @apply absolute bg-white rounded-full shadow transition-transform duration-200;
    }

    /* Sizes */
    .size-sm {
      @apply w-9 h-5;
    }
    .size-sm .toggle-slider {
      @apply w-4 h-4 top-0.5 left-0.5;
    }
    .size-sm.checked .toggle-slider {
      @apply translate-x-4;
    }

    .size-md {
      @apply w-11 h-6;
    }
    .size-md .toggle-slider {
      @apply w-5 h-5 top-0.5 left-0.5;
    }
    .size-md.checked .toggle-slider {
      @apply translate-x-5;
    }

    .size-lg {
      @apply w-14 h-7;
    }
    .size-lg .toggle-slider {
      @apply w-6 h-6 top-0.5 left-0.5;
    }
    .size-lg.checked .toggle-slider {
      @apply translate-x-7;
    }
  `,
})
export class UiToggleComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() description?: string;
  @Input() size: ToggleSize = 'md';
  @Input() disabled = false;
  @Input() checked = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  get toggleClasses(): string {
    return [
      'toggle-switch',
      `size-${this.size}`,
      this.checked ? 'checked' : '',
    ].filter(Boolean).join(' ');
  }

  toggle(): void {
    if (this.disabled) return;

    this.checked = !this.checked;
    this.onChange(this.checked);
    this.checkedChange.emit(this.checked);
    this.onTouched();
  }

  // ControlValueAccessor
  writeValue(value: boolean): void {
    this.checked = value ?? false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
