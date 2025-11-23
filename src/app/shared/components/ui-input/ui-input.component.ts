import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
export type InputState = 'default' | 'error' | 'success';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="input-wrapper" [class.disabled]="disabled" [class.focused]="isFocused()">
      @if (label) {
        <label [for]="inputId" class="input-label">
          {{ label }}
          @if (required) {
            <span class="required">*</span>
          }
        </label>
      }

      <div class="input-container" [class]="state">
        @if (iconLeft) {
          <mat-icon class="icon-left">{{ iconLeft }}</mat-icon>
        }

        <input
          [id]="inputId"
          [type]="actualType()"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [value]="value"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        />

        @if (type === 'password') {
          <button type="button" class="toggle-password" (click)="togglePassword()">
            <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        }

        @if (iconRight && type !== 'password') {
          <mat-icon class="icon-right">{{ iconRight }}</mat-icon>
        }
      </div>

      @if (hint || errorMessage) {
        <span class="input-hint" [class.error]="state === 'error'">
          {{ state === 'error' ? errorMessage : hint }}
        </span>
      }
    </div>
  `,
  styles: `
    @reference "tailwindcss";

    .input-wrapper {
      @apply flex flex-col gap-1.5;
    }

    .input-label {
      @apply text-sm font-medium text-slate-700;
    }

    .required {
      @apply text-red-500 ml-0.5;
    }

    .input-container {
      @apply relative flex items-center;
    }

    .input-container input {
      @apply w-full py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-800
             outline-none transition-all duration-200;
    }

    .input-container input:focus {
      @apply border-emerald-500 ring-2 ring-emerald-500/20;
    }

    .input-container input:disabled {
      @apply bg-slate-50 text-slate-400 cursor-not-allowed;
    }

    .input-container input::placeholder {
      @apply text-slate-400;
    }

    /* With icons */
    .input-container .icon-left {
      @apply absolute left-3 text-slate-400 text-lg w-5 h-5 pointer-events-none;
    }
    .input-container:has(.icon-left) input {
      @apply pl-10;
    }

    .input-container .icon-right {
      @apply absolute right-3 text-slate-400 text-lg w-5 h-5 pointer-events-none;
    }
    .input-container:has(.icon-right) input {
      @apply pr-10;
    }

    /* Password toggle */
    .toggle-password {
      @apply absolute right-2 p-1 bg-transparent border-none text-slate-400 cursor-pointer
             rounded transition-colors hover:text-slate-600;
    }
    .toggle-password mat-icon {
      @apply text-lg w-5 h-5;
    }
    .input-container:has(.toggle-password) input {
      @apply pr-10;
    }

    /* States */
    .input-container.error input {
      @apply border-red-500 focus:border-red-500 focus:ring-red-500/20;
    }

    .input-container.success input {
      @apply border-emerald-500;
    }

    .input-hint {
      @apply text-xs text-slate-500;
    }

    .input-hint.error {
      @apply text-red-500;
    }

    /* Disabled wrapper */
    .input-wrapper.disabled {
      @apply opacity-60;
    }
  `,
})
export class UiInputComponent implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() hint?: string;
  @Input() errorMessage?: string;
  @Input() state: InputState = 'default';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() inputId = `input-${Math.random().toString(36).slice(2, 9)}`;

  @Output() valueChange = new EventEmitter<string>();

  value = '';
  showPassword = signal(false);
  isFocused = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  actualType = () => {
    if (this.type === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type;
  };

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
