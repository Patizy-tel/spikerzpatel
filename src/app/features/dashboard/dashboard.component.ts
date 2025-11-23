import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface StatCard {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: 'critical' | 'high' | 'medium' | 'success';
}

interface ActivityItem {
  id: string;
  type: 'vulnerability' | 'asset' | 'remediation' | 'alert';
  title: string;
  description: string;
  time: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

interface TrendData {
  month: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <div class="p-6 max-w-[1400px] mx-auto animate-fade-in" [class.loaded]="isLoaded()">
      <!-- Header -->
      <header class="flex justify-between items-start mb-8 gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 m-0">Security Dashboard</h1>
          <p class="text-sm text-slate-400 mt-1">Real-time vulnerability and asset monitoring</p>
        </div>
        <div class="flex gap-2">
          <button class="flex items-center gap-1 py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 border-none bg-white text-slate-500 border border-slate-200 hover:bg-slate-50">
            <mat-icon class="icon-sm">file_download</mat-icon>
            Export
          </button>
          <button class="flex items-center gap-1 py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 border-none bg-emerald-500 text-white hover:bg-emerald-600 hover:-translate-y-0.5">
            <mat-icon class="icon-sm">refresh</mat-icon>
            Sync Now
          </button>
        </div>
      </header>

      <!-- Stats Cards -->
      <section class="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 mb-8">
        @for (stat of statCards; track stat.title; let i = $index) {
          <div
            class="stat-card bg-white rounded-xl p-6 border border-slate-200 flex gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            [style.animation-delay]="(i * 100) + 'ms'"
          >
            <div class="stat-icon flex items-center justify-center w-12 h-12 rounded-lg shrink-0" [class]="stat.color">
              <mat-icon>{{ stat.icon }}</mat-icon>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">{{ stat.title }}</span>
              <span class="text-3xl font-bold text-slate-800 leading-tight">{{ animatedValues()[i] }}</span>
              <div class="flex items-center gap-1 text-xs mt-1" [class]="stat.changeType === 'increase' ? 'text-red-500' : 'text-emerald-500'">
                <mat-icon class="!text-sm !w-3.5 !h-3.5">{{ stat.changeType === 'increase' ? 'trending_up' : 'trending_down' }}</mat-icon>
                <span>{{ stat.change }}% from last month</span>
              </div>
            </div>
          </div>
        }
      </section>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-[2fr_1fr] max-lg:grid-cols-1 gap-6 mb-8">
        <!-- Trend Chart -->
        <section class="bg-white rounded-xl p-6 border border-slate-200">
          <div class="flex justify-between items-center mb-4">
            <h2 class="flex items-center gap-2 text-base font-semibold text-slate-800 m-0">
              <mat-icon class="icon-md text-slate-400">show_chart</mat-icon>
              Vulnerability Trend
            </h2>
            <div class="flex gap-4 max-md:hidden">
              <span class="flex items-center gap-1.5 text-xs text-slate-500"><span class="w-2 h-2 rounded-full bg-red-500"></span> Critical</span>
              <span class="flex items-center gap-1.5 text-xs text-slate-500"><span class="w-2 h-2 rounded-full bg-orange-500"></span> High</span>
              <span class="flex items-center gap-1.5 text-xs text-slate-500"><span class="w-2 h-2 rounded-full bg-yellow-500"></span> Medium</span>
              <span class="flex items-center gap-1.5 text-xs text-slate-500"><span class="w-2 h-2 rounded-full bg-green-500"></span> Low</span>
            </div>
          </div>
          <div class="h-48 mt-4">
            <div class="flex justify-between items-end h-full gap-2 px-2">
              @for (data of trendData; track data.month; let i = $index) {
                <div
                  class="bar-group flex flex-col items-center flex-1 h-full relative cursor-pointer"
                  [class.active]="activeBar() === i"
                  [style.animation-delay]="(i * 100 + 400) + 'ms'"
                  (mouseenter)="activeBar.set(i)"
                  (mouseleave)="activeBar.set(null)"
                  (click)="selectBar(i)"
                >
                  <!-- Tooltip -->
                  <div class="bar-tooltip" [class.visible]="activeBar() === i">
                    <div class="text-xs font-semibold text-slate-800 mb-1 pb-1 border-b border-slate-200">{{ data.month }} 2024</div>
                    <div class="flex items-center gap-1.5 text-xs text-slate-500 py-0.5"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span><span>Critical: {{ data.critical }}</span></div>
                    <div class="flex items-center gap-1.5 text-xs text-slate-500 py-0.5"><span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span><span>High: {{ data.high }}</span></div>
                    <div class="flex items-center gap-1.5 text-xs text-slate-500 py-0.5"><span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span><span>Medium: {{ data.medium }}</span></div>
                    <div class="flex items-center gap-1.5 text-xs text-slate-500 py-0.5"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span><span>Low: {{ data.low }}</span></div>
                    <div class="text-xs font-semibold text-slate-800 mt-1 pt-1 border-t border-slate-200">Total: {{ data.critical + data.high + data.medium + data.low }}</div>
                  </div>
                  <div class="stacked-bar flex flex-col-reverse w-full max-w-10 h-[calc(100%-1.5rem)] rounded-t overflow-hidden bg-slate-100">
                    <div class="w-full bg-gradient-to-t from-red-600 to-red-500 transition-all duration-1000" [style.height.%]="data.critical * 2"></div>
                    <div class="w-full bg-gradient-to-t from-orange-500 to-orange-400 transition-all duration-1000" [style.height.%]="data.high * 2"></div>
                    <div class="w-full bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-1000" [style.height.%]="data.medium * 2"></div>
                    <div class="w-full bg-gradient-to-t from-green-500 to-green-400 transition-all duration-1000" [style.height.%]="data.low * 2"></div>
                  </div>
                  <span class="text-xs text-slate-400 mt-1 transition-all duration-200">{{ data.month }}</span>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- Recent Activity -->
        <section class="bg-white rounded-xl p-6 border border-slate-200">
          <div class="flex justify-between items-center mb-4">
            <h2 class="flex items-center gap-2 text-base font-semibold text-slate-800 m-0">
              <mat-icon class="icon-md text-slate-400">history</mat-icon>
              Recent Activity
            </h2>
            <a class="text-caption text-blue-500 no-underline font-medium hover:text-blue-600" routerLink="/vulnerabilities">View All</a>
          </div>
          <div class="flex flex-col gap-2">
            @for (activity of recentActivity; track activity.id; let i = $index) {
              <div class="activity-item flex gap-2 p-2 rounded-lg transition-colors hover:bg-slate-50" [style.animation-delay]="(i * 80 + 300) + 'ms'">
                <div class="activity-icon flex items-center justify-center w-8 h-8 rounded-lg shrink-0" [class]="activity.type">
                  <mat-icon class="!text-base !w-4 !h-4">{{ getActivityIcon(activity.type) }}</mat-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-caption font-semibold text-slate-800">{{ activity.title }}</span>
                    @if (activity.severity) {
                      <span class="severity-badge text-2xs font-semibold py-0.5 px-1.5 rounded-full uppercase" [class]="activity.severity">
                        {{ activity.severity }}
                      </span>
                    }
                  </div>
                  <p class="text-xs text-slate-500 m-0 mt-0.5 truncate max-sm:hidden">{{ activity.description }}</p>
                  <span class="text-xs text-slate-400">{{ activity.time }}</span>
                </div>
              </div>
            }
          </div>
        </section>
      </div>

      <!-- Quick Actions -->
      <section class="bg-white rounded-xl p-6 border border-slate-200">
        <h2 class="flex items-center gap-2 text-base font-semibold text-slate-800 m-0 mb-4">
          <mat-icon class="icon-md text-slate-400">bolt</mat-icon>
          Quick Actions
        </h2>
        <div class="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4">
          <a routerLink="/vulnerabilities" class="flex items-center gap-2 p-4 bg-slate-50 rounded-lg no-underline transition-all duration-300 border border-transparent hover:bg-white hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-md group">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-red-200 text-red-500">
              <mat-icon class="icon-md">bug_report</mat-icon>
            </div>
            <span class="text-sm font-medium text-slate-800 flex-1">View Vulnerabilities</span>
            <mat-icon class="icon-sm text-slate-400 transition-transform duration-200 group-hover:translate-x-1">arrow_forward</mat-icon>
          </a>
          <a routerLink="/assets" class="flex items-center gap-2 p-4 bg-slate-50 rounded-lg no-underline transition-all duration-300 border border-transparent hover:bg-white hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-md group">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-200 text-blue-500">
              <mat-icon class="icon-md">devices</mat-icon>
            </div>
            <span class="text-sm font-medium text-slate-800 flex-1">Manage Assets</span>
            <mat-icon class="icon-sm text-slate-400 transition-transform duration-200 group-hover:translate-x-1">arrow_forward</mat-icon>
          </a>
          <a routerLink="/reports" class="flex items-center gap-2 p-4 bg-slate-50 rounded-lg no-underline transition-all duration-300 border border-transparent hover:bg-white hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-md group">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-purple-200 text-purple-500">
              <mat-icon class="icon-md">assessment</mat-icon>
            </div>
            <span class="text-sm font-medium text-slate-800 flex-1">Generate Report</span>
            <mat-icon class="icon-sm text-slate-400 transition-transform duration-200 group-hover:translate-x-1">arrow_forward</mat-icon>
          </a>
          <a routerLink="/settings" class="flex items-center gap-2 p-4 bg-slate-50 rounded-lg no-underline transition-all duration-300 border border-transparent hover:bg-white hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-md group">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-200 text-emerald-500">
              <mat-icon class="icon-md">settings</mat-icon>
            </div>
            <span class="text-sm font-medium text-slate-800 flex-1">Configuration</span>
            <mat-icon class="icon-sm text-slate-400 transition-transform duration-200 group-hover:translate-x-1">arrow_forward</mat-icon>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: `
    @reference "tailwindcss";

    /* Animations that can't be done with Tailwind */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(1rem); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
      animation: fadeInUp 0.5s ease forwards;
    }

    .stat-card {
      opacity: 0;
      transform: translateY(1rem);
      animation: fadeInUp 0.4s ease forwards;
    }

    .stat-icon.critical { @apply bg-gradient-to-br from-red-50 to-red-200 text-red-500; }
    .stat-icon.high { @apply bg-gradient-to-br from-orange-50 to-orange-200 text-orange-500; }
    .stat-icon.medium { @apply bg-gradient-to-br from-blue-50 to-blue-200 text-blue-500; }
    .stat-icon.success { @apply bg-gradient-to-br from-emerald-50 to-emerald-200 text-emerald-500; }

    .bar-group {
      opacity: 0;
      transform: translateY(1rem);
      animation: fadeInUp 0.5s ease forwards;
    }

    .bar-group:hover .stacked-bar,
    .bar-group.active .stacked-bar {
      transform: scaleY(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .bar-group:hover span:last-child,
    .bar-group.active span:last-child {
      @apply text-slate-800 font-semibold;
    }

    .bar-tooltip {
      @apply absolute bottom-full left-1/2 -translate-x-1/2 translate-y-2 bg-white border border-slate-200 rounded-lg p-2 min-w-[120px] shadow-xl opacity-0 invisible transition-all duration-200 z-50 pointer-events-none;
    }

    .bar-tooltip.visible {
      @apply opacity-100 visible translate-y-0;
    }

    .activity-item {
      opacity: 0;
      transform: translateX(-0.5rem);
      animation: slideIn 0.4s ease forwards;
    }

    @keyframes slideIn {
      to { opacity: 1; transform: translateX(0); }
    }

    .activity-icon.vulnerability { @apply bg-red-50 text-red-500; }
    .activity-icon.asset { @apply bg-blue-50 text-blue-500; }
    .activity-icon.remediation { @apply bg-emerald-50 text-emerald-500; }
    .activity-icon.alert { @apply bg-orange-50 text-orange-500; }

    .severity-badge.critical { @apply bg-red-50 text-red-500; }
    .severity-badge.high { @apply bg-orange-50 text-orange-500; }
    .severity-badge.medium { @apply bg-yellow-50 text-yellow-500; }
    .severity-badge.low { @apply bg-emerald-50 text-emerald-500; }

    @media (max-width: 768px) {
      .p-6 { @apply p-4; }
    }
  `,
})
export class DashboardComponent implements OnInit {
  isLoaded = signal(false);
  animatedValues = signal<number[]>([0, 0, 0, 0]);
  activeBar = signal<number | null>(null);
  selectedBar = signal<number | null>(null);

  statCards: StatCard[] = [
    { title: 'Critical Vulnerabilities', value: 24, change: 12, changeType: 'increase', icon: 'error', color: 'critical' },
    { title: 'High Risk Assets', value: 156, change: 8, changeType: 'increase', icon: 'warning', color: 'high' },
    { title: 'Pending Patches', value: 89, change: 15, changeType: 'decrease', icon: 'build', color: 'medium' },
    { title: 'Remediated', value: 342, change: 23, changeType: 'increase', icon: 'check_circle', color: 'success' },
  ];

  trendData: TrendData[] = [
    { month: 'Jul', critical: 12, high: 18, medium: 24, low: 15 },
    { month: 'Aug', critical: 15, high: 22, medium: 28, low: 18 },
    { month: 'Sep', critical: 18, high: 25, medium: 22, low: 20 },
    { month: 'Oct', critical: 22, high: 28, medium: 18, low: 22 },
    { month: 'Nov', critical: 20, high: 24, medium: 20, low: 25 },
    { month: 'Dec', critical: 24, high: 20, medium: 22, low: 28 },
  ];

  recentActivity: ActivityItem[] = [
    { id: '1', type: 'vulnerability', title: 'CVE-2024-6387 Detected', description: 'Critical OpenSSH vulnerability found on 4 servers', time: '5 min ago', severity: 'critical' },
    { id: '2', type: 'remediation', title: 'Patch Applied', description: 'CVE-2024-1234 remediated on prod-web-01', time: '23 min ago' },
    { id: '3', type: 'asset', title: 'New Asset Discovered', description: 'db-replica-02 added to monitoring', time: '1 hour ago' },
    { id: '4', type: 'alert', title: 'Scan Complete', description: 'Weekly vulnerability scan finished', time: '2 hours ago' },
    { id: '5', type: 'vulnerability', title: 'CVE-2024-5678 Detected', description: 'High severity SSL vulnerability', time: '3 hours ago', severity: 'high' },
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoaded.set(true);
      this.animateValues();
    }, 100);
  }

  private animateValues(): void {
    const targets = this.statCards.map(s => s.value);
    const duration = 1000;
    const steps = 30;
    const increments = targets.map(t => t / steps);
    let current = [0, 0, 0, 0];
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = current.map((c, i) => Math.min(c + increments[i], targets[i]));
      this.animatedValues.set(current.map(Math.floor));

      if (step >= steps) {
        this.animatedValues.set(targets);
        clearInterval(interval);
      }
    }, duration / steps);
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      vulnerability: 'bug_report',
      asset: 'dns',
      remediation: 'healing',
      alert: 'notifications',
    };
    return icons[type] || 'info';
  }

  selectBar(index: number): void {
    this.selectedBar.set(this.selectedBar() === index ? null : index);
  }
}
