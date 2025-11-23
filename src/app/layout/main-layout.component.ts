import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../core/services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatListModule],
  template: `
    <div class="app-layout">
      <!-- Mobile Header -->
      <header class="mobile-header">
        <button class="menu-btn" (click)="toggleSidebar()">
          <mat-icon>{{ isSidebarOpen() ? 'close' : 'menu' }}</mat-icon>
        </button>
        <span class="mobile-title">Security Dashboard</span>
        <button class="action-btn">
          <mat-icon>notifications</mat-icon>
        </button>
      </header>

      <!-- Sidebar Overlay -->
      @if (isSidebarOpen()) {
        <div class="sidebar-overlay" (click)="closeSidebar()"></div>
      }

      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="isSidebarOpen()">
        <div class="sidebar-header">
          <div class="logo">
            <mat-icon class="logo-icon">shield</mat-icon>
            <span class="logo-text">SPIKERZ</span>
          </div>
          <button class="collapse-btn">
            <mat-icon>chevron_left</mat-icon>
          </button>
        </div>

        <nav class="sidebar-nav">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
              class="nav-item"
              (click)="closeSidebar()"
            >
              <mat-icon>{{ item.icon }}</mat-icon>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="avatar">
              <mat-icon>person</mat-icon>
            </div>
            <div class="user-details">
              <span class="user-name">Patel Tanaka</span>
              <span class="user-role">Security Analyst</span>
            </div>
            <button class="settings-btn" routerLink="/settings">
              <mat-icon>tune</mat-icon>
            </button>
          </div>
          <button class="logout-btn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    .app-layout {
      display: flex;
      min-height: 100vh;
      min-height: 100dvh;
      background-color: var(--color-bg-secondary);
    }

    /* Mobile Header */
    .mobile-header {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3.5rem;
      background-color: var(--color-bg-primary);
      border-bottom: 1px solid var(--color-border);
      z-index: 100;
      padding: 0 var(--spacing-md);
      align-items: center;
      justify-content: space-between;
    }

    .menu-btn,
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      cursor: pointer;
    }

    .menu-btn:hover,
    .action-btn:hover {
      background-color: var(--color-bg-secondary);
    }

    .mobile-title {
      font-weight: 600;
      font-size: 1rem;
      color: var(--color-text-primary);
    }

    /* Sidebar Overlay */
    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 150;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Sidebar */
    .sidebar {
      display: flex;
      flex-direction: column;
      width: 15rem;
      height: 100vh;
      height: 100dvh;
      background-color: var(--color-bg-primary);
      border-right: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md) var(--spacing-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .logo-icon {
      color: var(--color-success);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .logo-text {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-text-primary);
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
    }

    .collapse-btn:hover {
      background-color: #059669;
      transform: scale(1.05);
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-md) var(--spacing-sm);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .nav-item:hover {
      background-color: var(--color-bg-secondary);
      color: var(--color-text-primary);
    }

    .nav-item.active {
      background-color: var(--color-success);
      color: white;
    }

    .nav-item mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
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
    }

    .settings-btn:hover {
      background-color: var(--color-bg-tertiary);
    }

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      width: 100%;
      margin-top: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid rgba(239, 68, 68, 0.3);
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
    }

    .logout-btn mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .mobile-header {
        display: flex;
      }

      .sidebar {
        position: fixed;
        left: -100%;
        top: 0;
        bottom: 0;
        z-index: 200;
        transition: left 0.3s ease;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
      }

      .sidebar.open {
        left: 0;
      }

      .sidebar-overlay {
        display: block;
      }

      .collapse-btn {
        display: none;
      }

      .app-layout {
        flex-direction: column;
        padding-top: 3.5rem;
      }

      .main-content {
        width: 100%;
      }
    }

    /* Safe area */
    @supports (padding: env(safe-area-inset-left)) {
      .sidebar {
        padding-left: env(safe-area-inset-left);
      }

      .mobile-header {
        padding-left: calc(var(--spacing-md) + env(safe-area-inset-left));
        padding-right: calc(var(--spacing-md) + env(safe-area-inset-right));
      }
    }
  `,
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  isSidebarOpen = signal(false);

  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/vulnerabilities', label: 'Vulnerabilities', icon: 'bug_report' },
    { path: '/assets', label: 'Assets', icon: 'devices' },
    { path: '/cve/CVE-2024-6387', label: 'CVE-2024-6387', icon: 'security' },
    { path: '/reports', label: 'Reports', icon: 'assessment' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];

  toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
