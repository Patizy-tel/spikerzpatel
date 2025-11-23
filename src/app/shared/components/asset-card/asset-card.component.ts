import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Asset } from '../../../core/models';
import { RiskBadgeComponent } from '../risk-badge/risk-badge.component';
import { TagBadgeComponent } from '../tag-badge/tag-badge.component';

@Component({
  selector: 'app-asset-card',
  standalone: true,
  imports: [MatIconModule, RiskBadgeComponent, TagBadgeComponent],
  template: `
    <div class="asset-card" [class.clickable]="clickable()" (click)="onCardClick()">
      <div class="card-header">
        <div class="icon-wrapper" [class]="'icon-' + asset().risk">
          <mat-icon>dns</mat-icon>
        </div>
        <div class="header-content">
          <div class="asset-name">{{ asset().name }}</div>
          <div class="asset-ip">{{ asset().ipAddress }}</div>
        </div>
        @if (showRiskBadge()) {
          <app-risk-badge [risk]="asset().risk" class="ml-auto" />
        }
      </div>

      @if (showTags() && asset().tags.length > 0) {
        <div class="tags-row">
          @for (tag of asset().tags; track tag.label) {
            <app-tag-badge [tag]="tag" />
          }
        </div>
      }

      @if (showIpList()) {
        <div class="ip-list">
          @for (ip of ipAddresses(); track ip) {
            <span class="ip-item">{{ ip }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .asset-card {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      border: 1px solid var(--color-border);
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .asset-card.clickable {
      cursor: pointer;
    }

    .asset-card.clickable:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--color-primary-light);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--radius-md);
    }

    .icon-critical {
      background-color: #fee2e2;
      color: var(--color-critical);
    }

    .icon-high {
      background-color: #ffedd5;
      color: var(--color-high);
    }

    .icon-medium {
      background-color: #fef9c3;
      color: var(--color-medium);
    }

    .icon-low {
      background-color: #dcfce7;
      color: var(--color-low);
    }

    .header-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .asset-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .asset-ip {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-sm);
    }

    .ip-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-sm);
    }

    .ip-item {
      font-size: 0.75rem;
      color: var(--color-info);
      font-weight: 500;
    }

    .ml-auto {
      margin-left: auto;
    }
  `,
})
export class AssetCardComponent {
  asset = input.required<Asset>();
  clickable = input<boolean>(false);
  showTags = input<boolean>(true);
  showRiskBadge = input<boolean>(false);
  showIpList = input<boolean>(false);

  cardClick = output<Asset>();

  ipAddresses = () => ['1.2.3.4', '1.2.3.4', '1.2.3.4'];

  onCardClick(): void {
    if (this.clickable()) {
      this.cardClick.emit(this.asset());
    }
  }
}
