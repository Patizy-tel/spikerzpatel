import { Component, computed, input } from '@angular/core';
import { AssetTag } from '../../../core/models';

@Component({
  selector: 'app-tag-badge',
  standalone: true,
  template: `
    <span class="tag-badge" [class]="tagClasses()">
      {{ tag().label }}
    </span>
  `,
  styles: `
    .tag-badge {
      display: inline-flex;
      align-items: center;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .tag-default {
      color: var(--color-text-secondary);
      background-color: var(--color-bg-tertiary);
    }

    .tag-warning {
      color: #b45309;
      background-color: #fef3c7;
    }

    .tag-error {
      color: var(--color-critical);
      background-color: #fee2e2;
    }

    .tag-success {
      color: #15803d;
      background-color: #dcfce7;
    }

    .tag-info {
      color: #1d4ed8;
      background-color: #dbeafe;
    }
  `,
})
export class TagBadgeComponent {
  tag = input.required<AssetTag>();

  tagClasses = computed(() => `tag-${this.tag().type}`);
}
