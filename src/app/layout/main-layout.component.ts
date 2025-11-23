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
    <div class="flex min-h-screen min-h-dvh bg-slate-50">
      <!-- Mobile Header -->
      <header class="mobile-header hidden md:!hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-[100] px-4 items-center justify-between">
        <button class="flex items-center justify-center w-10 h-10 border-none bg-transparent rounded-lg text-slate-800 cursor-pointer hover:bg-slate-100" (click)="toggleSidebar()">
          <mat-icon>{{ isSidebarOpen() ? 'close' : 'menu' }}</mat-icon>
        </button>
        <span class="font-semibold text-base text-slate-800">Security Dashboard</span>
        <button class="flex items-center justify-center w-10 h-10 border-none bg-transparent rounded-lg text-slate-800 cursor-pointer hover:bg-slate-100">
          <mat-icon>notifications</mat-icon>
        </button>
      </header>

      <!-- Sidebar Overlay -->
      @if (isSidebarOpen()) {
        <div class="sidebar-overlay hidden md:!hidden fixed inset-0 bg-black/50 z-[150] animate-fade-in" (click)="closeSidebar()"></div>
      }

      <!-- Sidebar -->
      <aside class="sidebar flex flex-col w-60 h-screen h-dvh bg-white border-r border-slate-200 shrink-0" [class.open]="isSidebarOpen()">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <mat-icon class="text-emerald-500 !text-2xl !w-6 !h-6">shield</mat-icon>
            <span class="text-lg font-bold text-slate-800">SPIKERZ</span>
          </div>
          <button class="flex items-center justify-center w-8 h-8 border-none bg-emerald-500 text-white rounded-full cursor-pointer transition-all duration-200 hover:bg-emerald-600 hover:scale-105">
            <mat-icon>chevron_left</mat-icon>
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto p-4 px-2 flex flex-col gap-1">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
              class="nav-item flex items-center gap-2 py-2 px-4 rounded-lg no-underline text-slate-500 text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-slate-100 hover:text-slate-800"
              (click)="closeSidebar()"
            >
              <mat-icon class="icon-md">{{ item.icon }}</mat-icon>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="p-4 border-t border-slate-200">
          <div class="flex items-center gap-2">
            <div class="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full text-slate-500 shrink-0">
              <mat-icon>person</mat-icon>
            </div>
            <div class="flex flex-col flex-1 min-w-0">
              <span class="text-sm font-medium text-slate-800 truncate">Patel Tanaka</span>
              <span class="text-xs text-slate-400">Security Analyst</span>
            </div>
            <button class="flex items-center justify-center w-8 h-8 border-none bg-transparent text-slate-500 cursor-pointer rounded transition-all duration-200 hover:bg-slate-100" routerLink="/settings">
              <mat-icon>tune</mat-icon>
            </button>
          </div>
          <button class="flex items-center justify-center gap-2 w-full mt-2 py-2 px-4 border border-red-500/30 bg-red-500/10 text-red-500 text-caption font-medium cursor-pointer rounded-lg transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/50" (click)="logout()">
            <mat-icon class="icon-sm">logout</mat-icon>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden">
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    @reference "tailwindcss";

    /* Only keeping styles that can't be done with Tailwind */
    .nav-item.active {
      @apply bg-emerald-500 text-white;
    }

    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .animate-fade-in {
      animation: fade-in 0.2s ease;
    }

    /* Responsive - mobile behavior */
    @media (max-width: 768px) {
      .mobile-header {
        display: flex !important;
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
        display: block !important;
      }

      .sidebar .collapse-btn {
        display: none;
      }

      .flex.min-h-screen {
        flex-direction: column;
        padding-top: 3.5rem;
      }

      main {
        width: 100%;
      }
    }

    /* Safe area for notched devices */
    @supports (padding: env(safe-area-inset-left)) {
      .sidebar {
        padding-left: env(safe-area-inset-left);
      }

      .mobile-header {
        padding-left: calc(1rem + env(safe-area-inset-left));
        padding-right: calc(1rem + env(safe-area-inset-right));
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
