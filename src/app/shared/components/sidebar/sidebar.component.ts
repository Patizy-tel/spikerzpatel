import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { VulnerabilityStore } from '../../../core/services';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, MatListModule],
  template: `
    <aside class="sidebar">
      <header class="sidebar-header">
        <span class="breadcrumb">{{ breadcrumb() }}</span>
        <button class="collapse-btn">
          <mat-icon>chevron_left</mat-icon>
        </button>
      </header>

      <nav class="sidebar-nav">
        <mat-nav-list>
          @for (item of items(); track item.id) {
            <a
              mat-list-item
              [class.active]="store.activeSidebarItem() === item.id"
              (click)="store.setActiveSidebarItem(item.id)"
            >
              <mat-icon matListItemIcon>{{ item.icon || 'circle' }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
      </nav>

      <footer class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">
            <mat-icon>person</mat-icon>
          </div>
          <div class="user-details">
            <span class="user-name">John Smith</span>
            <span class="user-role">Security Analyst</span>
          </div>
          <button class="settings-btn">
            <mat-icon>tune</mat-icon>
          </button>
        </div>
      </footer>
    </aside>
  `,
  styles: `
    .sidebar {
      display: flex;
      flex-direction: column;
      width: 15rem;
      height: 100vh;
      height: 100dvh;
      background-color: var(--color-bg-primary);
      border-right: 1px solid var(--color-border);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md) var(--spacing-lg);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .breadcrumb {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .collapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      background-color: var(--color-success);
      color: white;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .collapse-btn:hover {
      background-color: #059669;
      transform: scale(1.05);
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-sm) 0;
      -webkit-overflow-scrolling: touch;
    }

    .sidebar-nav a {
      margin: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }

    .sidebar-nav a:hover {
      background-color: var(--color-bg-secondary);
    }

    .sidebar-nav a.active {
      background-color: var(--color-success);
      color: white;
    }

    .sidebar-nav a.active mat-icon {
      color: white;
    }

    .sidebar-footer {
      padding: var(--spacing-md);
      border-top: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      background-color: var(--color-bg-tertiary);
      border-radius: var(--radius-full);
      color: var(--color-text-secondary);
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .settings-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      background: transparent;
      color: var(--color-text-secondary);
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .settings-btn:hover {
      background-color: var(--color-bg-tertiary);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .sidebar {
        width: 17rem;
        max-width: 85vw;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
      }

      .collapse-btn {
        display: none;
      }

      .sidebar-nav a {
        padding: var(--spacing-md);
      }
    }

    /* Safe area for notched devices */
    @supports (padding: env(safe-area-inset-left)) {
      .sidebar {
        padding-left: env(safe-area-inset-left);
      }
    }
  `,
})
export class SidebarComponent {
  store = inject(VulnerabilityStore);

  breadcrumb = input<string>('Vulnerabilities');
  items = input<SidebarItem[]>([]);
}
