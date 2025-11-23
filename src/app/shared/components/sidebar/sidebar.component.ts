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
      height: 100%;
      background-color: var(--color-bg-primary);
      border-right: 1px solid var(--color-border);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md) var(--spacing-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .breadcrumb {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
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
      transition: background-color 0.2s ease;
    }

    .collapse-btn:hover {
      background-color: #059669;
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-sm) 0;
    }

    .sidebar-nav a {
      margin: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-md);
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
    }

    .settings-btn:hover {
      background-color: var(--color-bg-tertiary);
    }
  `,
})
export class SidebarComponent {
  store = inject(VulnerabilityStore);

  breadcrumb = input<string>('Vulnerabilities');
  items = input<SidebarItem[]>([]);
}
