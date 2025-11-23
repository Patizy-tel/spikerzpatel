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
    <div class="dashboard-container" [class.loaded]="isLoaded()">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <h1 class="page-title">Security Dashboard</h1>
          <p class="page-subtitle">Real-time vulnerability and asset monitoring</p>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary">
            <mat-icon>file_download</mat-icon>
            Export
          </button>
          <button class="action-btn primary">
            <mat-icon>refresh</mat-icon>
            Sync Now
          </button>
        </div>
      </header>

      <!-- Stats Cards -->
      <section class="stats-grid">
        @for (stat of statCards; track stat.title; let i = $index) {
          <div
            class="stat-card"
            [class]="stat.color"
            [style.animation-delay]="(i * 100) + 'ms'"
          >
            <div class="stat-icon-wrapper" [class]="stat.color">
              <mat-icon>{{ stat.icon }}</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-title">{{ stat.title }}</span>
              <span class="stat-value">{{ animatedValues()[i] }}</span>
              <div class="stat-change" [class]="stat.changeType">
                <mat-icon>{{ stat.changeType === 'increase' ? 'trending_up' : 'trending_down' }}</mat-icon>
                <span>{{ stat.change }}% from last month</span>
              </div>
            </div>
          </div>
        }
      </section>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Trend Chart -->
        <section class="chart-section">
          <div class="section-header">
            <h2 class="section-title">
              <mat-icon>show_chart</mat-icon>
              Vulnerability Trend
            </h2>
            <div class="chart-legend">
              <span class="legend-item critical"><span class="dot"></span> Critical</span>
              <span class="legend-item high"><span class="dot"></span> High</span>
              <span class="legend-item medium"><span class="dot"></span> Medium</span>
              <span class="legend-item low"><span class="dot"></span> Low</span>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-bars">
              @for (data of trendData; track data.month; let i = $index) {
                <div
                  class="bar-group"
                  [class.active]="activeBar() === i"
                  [style.animation-delay]="(i * 100 + 400) + 'ms'"
                  (mouseenter)="activeBar.set(i)"
                  (mouseleave)="activeBar.set(null)"
                  (click)="selectBar(i)"
                >
                  <!-- Tooltip -->
                  <div class="bar-tooltip" [class.visible]="activeBar() === i">
                    <div class="tooltip-title">{{ data.month }} 2024</div>
                    <div class="tooltip-row critical">
                      <span class="tooltip-dot"></span>
                      <span>Critical: {{ data.critical }}</span>
                    </div>
                    <div class="tooltip-row high">
                      <span class="tooltip-dot"></span>
                      <span>High: {{ data.high }}</span>
                    </div>
                    <div class="tooltip-row medium">
                      <span class="tooltip-dot"></span>
                      <span>Medium: {{ data.medium }}</span>
                    </div>
                    <div class="tooltip-row low">
                      <span class="tooltip-dot"></span>
                      <span>Low: {{ data.low }}</span>
                    </div>
                    <div class="tooltip-total">
                      Total: {{ data.critical + data.high + data.medium + data.low }}
                    </div>
                  </div>
                  <div class="stacked-bar">
                    <div class="bar-segment critical" [style.height.%]="data.critical * 2"></div>
                    <div class="bar-segment high" [style.height.%]="data.high * 2"></div>
                    <div class="bar-segment medium" [style.height.%]="data.medium * 2"></div>
                    <div class="bar-segment low" [style.height.%]="data.low * 2"></div>
                  </div>
                  <span class="bar-label">{{ data.month }}</span>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- Recent Activity -->
        <section class="activity-section">
          <div class="section-header">
            <h2 class="section-title">
              <mat-icon>history</mat-icon>
              Recent Activity
            </h2>
            <a class="view-all-link" routerLink="/vulnerabilities">View All</a>
          </div>
          <div class="activity-list">
            @for (activity of recentActivity; track activity.id; let i = $index) {
              <div
                class="activity-item"
                [style.animation-delay]="(i * 80 + 300) + 'ms'"
              >
                <div class="activity-icon" [class]="activity.type">
                  <mat-icon>{{ getActivityIcon(activity.type) }}</mat-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-header">
                    <span class="activity-title">{{ activity.title }}</span>
                    @if (activity.severity) {
                      <span class="severity-badge" [class]="activity.severity">
                        {{ activity.severity }}
                      </span>
                    }
                  </div>
                  <p class="activity-description">{{ activity.description }}</p>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            }
          </div>
        </section>
      </div>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <h2 class="section-title">
          <mat-icon>bolt</mat-icon>
          Quick Actions
        </h2>
        <div class="actions-grid">
          <a routerLink="/vulnerabilities" class="quick-action-card">
            <div class="action-icon vulnerabilities">
              <mat-icon>bug_report</mat-icon>
            </div>
            <span class="action-label">View Vulnerabilities</span>
            <mat-icon class="arrow">arrow_forward</mat-icon>
          </a>
          <a routerLink="/assets" class="quick-action-card">
            <div class="action-icon assets">
              <mat-icon>devices</mat-icon>
            </div>
            <span class="action-label">Manage Assets</span>
            <mat-icon class="arrow">arrow_forward</mat-icon>
          </a>
          <a routerLink="/reports" class="quick-action-card">
            <div class="action-icon reports">
              <mat-icon>assessment</mat-icon>
            </div>
            <span class="action-label">Generate Report</span>
            <mat-icon class="arrow">arrow_forward</mat-icon>
          </a>
          <a routerLink="/settings" class="quick-action-card">
            <div class="action-icon settings">
              <mat-icon>settings</mat-icon>
            </div>
            <span class="action-label">Configuration</span>
            <mat-icon class="arrow">arrow_forward</mat-icon>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: `
    .dashboard-container {
      padding: var(--spacing-lg);
      max-width: 1400px;
      margin: 0 auto;
      opacity: 0;
      transform: translateY(1rem);
      animation: fadeInUp 0.5s ease forwards;
    }

    .dashboard-container.loaded {
      opacity: 1;
      transform: translateY(0);
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Header */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin: var(--spacing-xs) 0 0;
    }

    .header-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .action-btn mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .action-btn.secondary {
      background-color: var(--color-bg-primary);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
    }

    .action-btn.secondary:hover {
      background-color: var(--color-bg-secondary);
    }

    .action-btn.primary {
      background-color: var(--color-success);
      color: white;
    }

    .action-btn.primary:hover {
      background-color: #059669;
      transform: translateY(-1px);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
    }

    .stat-card {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      border: 1px solid var(--color-border);
      display: flex;
      gap: var(--spacing-md);
      opacity: 0;
      transform: translateY(1rem);
      animation: slideUp 0.4s ease forwards;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-0.25rem);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    @keyframes slideUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .stat-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: var(--radius-md);
      flex-shrink: 0;
    }

    .stat-icon-wrapper.critical {
      background: linear-gradient(135deg, #fef2f2, #fecaca);
      color: var(--color-critical);
    }

    .stat-icon-wrapper.high {
      background: linear-gradient(135deg, #fff7ed, #fed7aa);
      color: var(--color-high);
    }

    .stat-icon-wrapper.medium {
      background: linear-gradient(135deg, #eff6ff, #bfdbfe);
      color: var(--color-medium);
    }

    .stat-icon-wrapper.success {
      background: linear-gradient(135deg, #f0fdf4, #bbf7d0);
      color: var(--color-success);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .stat-title {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-text-primary);
      line-height: 1.2;
    }

    .stat-change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      margin-top: var(--spacing-xs);
    }

    .stat-change mat-icon {
      font-size: 0.875rem;
      width: 0.875rem;
      height: 0.875rem;
    }

    .stat-change.increase {
      color: var(--color-critical);
    }

    .stat-change.decrease {
      color: var(--color-success);
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .section-title mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--color-text-muted);
    }

    /* Chart Section */
    .chart-section {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      border: 1px solid var(--color-border);
    }

    .chart-legend {
      display: flex;
      gap: var(--spacing-md);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    .legend-item .dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--radius-full);
    }

    .legend-item.critical .dot { background-color: var(--color-critical); }
    .legend-item.high .dot { background-color: var(--color-high); }
    .legend-item.medium .dot { background-color: var(--color-medium); }
    .legend-item.low .dot { background-color: var(--color-success); }

    .chart-container {
      height: 12rem;
      margin-top: var(--spacing-md);
    }

    .chart-bars {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 100%;
      gap: var(--spacing-sm);
      padding: 0 var(--spacing-sm);
    }

    .bar-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      height: 100%;
      opacity: 0;
      transform: translateY(1rem);
      animation: slideUp 0.5s ease forwards;
      position: relative;
      cursor: pointer;
    }

    .stacked-bar {
      display: flex;
      flex-direction: column-reverse;
      width: 100%;
      max-width: 2.5rem;
      height: calc(100% - 1.5rem);
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
      overflow: hidden;
      background: var(--color-bg-tertiary);
    }

    .bar-segment {
      width: 100%;
      transition: height 1s ease;
    }

    .bar-segment.critical { background: linear-gradient(180deg, #ef4444, #dc2626); }
    .bar-segment.high { background: linear-gradient(180deg, #fb923c, #f97316); }
    .bar-segment.medium { background: linear-gradient(180deg, #60a5fa, #3b82f6); }
    .bar-segment.low { background: linear-gradient(180deg, #4ade80, #22c55e); }

    .bar-group:hover .stacked-bar,
    .bar-group.active .stacked-bar {
      transform: scaleY(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .bar-group:hover .bar-label,
    .bar-group.active .bar-label {
      color: var(--color-text-primary);
      font-weight: 600;
    }

    .bar-label {
      font-size: 0.6875rem;
      color: var(--color-text-muted);
      margin-top: var(--spacing-xs);
      transition: all 0.2s ease;
    }

    /* Tooltip */
    .bar-tooltip {
      position: absolute;
      bottom: calc(100% + 0.5rem);
      left: 50%;
      transform: translateX(-50%) translateY(0.5rem);
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--spacing-sm);
      min-width: 120px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      z-index: 100;
      pointer-events: none;
    }

    .bar-tooltip.visible {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    .tooltip-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-xs);
      padding-bottom: var(--spacing-xs);
      border-bottom: 1px solid var(--color-border);
    }

    .tooltip-row {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.6875rem;
      color: var(--color-text-secondary);
      padding: 2px 0;
    }

    .tooltip-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .tooltip-row.critical .tooltip-dot { background: var(--color-critical); }
    .tooltip-row.high .tooltip-dot { background: var(--color-high); }
    .tooltip-row.medium .tooltip-dot { background: var(--color-medium); }
    .tooltip-row.low .tooltip-dot { background: var(--color-success); }

    .tooltip-total {
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-top: var(--spacing-xs);
      padding-top: var(--spacing-xs);
      border-top: 1px solid var(--color-border);
    }

    /* Activity Section */
    .activity-section {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      border: 1px solid var(--color-border);
    }

    .view-all-link {
      font-size: 0.8125rem;
      color: var(--color-info);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .view-all-link:hover {
      color: #2563eb;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .activity-item {
      display: flex;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm);
      border-radius: var(--radius-md);
      transition: background-color 0.2s;
      opacity: 0;
      transform: translateX(-0.5rem);
      animation: slideIn 0.4s ease forwards;
    }

    @keyframes slideIn {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .activity-item:hover {
      background-color: var(--color-bg-secondary);
    }

    .activity-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-md);
      flex-shrink: 0;
    }

    .activity-icon mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .activity-icon.vulnerability {
      background-color: #fef2f2;
      color: var(--color-critical);
    }

    .activity-icon.asset {
      background-color: #eff6ff;
      color: var(--color-info);
    }

    .activity-icon.remediation {
      background-color: #f0fdf4;
      color: var(--color-success);
    }

    .activity-icon.alert {
      background-color: #fff7ed;
      color: var(--color-high);
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .activity-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .severity-badge {
      font-size: 0.625rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: var(--radius-full);
      text-transform: uppercase;
    }

    .severity-badge.critical {
      background-color: #fef2f2;
      color: var(--color-critical);
    }

    .severity-badge.high {
      background-color: #fff7ed;
      color: var(--color-high);
    }

    .activity-description {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin: 0.125rem 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .activity-time {
      font-size: 0.6875rem;
      color: var(--color-text-muted);
    }

    /* Quick Actions */
    .quick-actions {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      border: 1px solid var(--color-border);
    }

    .quick-actions .section-title {
      margin-bottom: var(--spacing-md);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-md);
    }

    .quick-action-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }

    .quick-action-card:hover {
      background-color: var(--color-bg-primary);
      border-color: var(--color-border);
      transform: translateY(-0.125rem);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .quick-action-card:hover .arrow {
      transform: translateX(0.25rem);
    }

    .action-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--radius-md);
    }

    .action-icon mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .action-icon.vulnerabilities {
      background: linear-gradient(135deg, #fef2f2, #fecaca);
      color: var(--color-critical);
    }

    .action-icon.assets {
      background: linear-gradient(135deg, #eff6ff, #bfdbfe);
      color: var(--color-info);
    }

    .action-icon.reports {
      background: linear-gradient(135deg, #faf5ff, #e9d5ff);
      color: #9333ea;
    }

    .action-icon.settings {
      background: linear-gradient(135deg, #f0fdf4, #bbf7d0);
      color: var(--color-success);
    }

    .action-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
      flex: 1;
    }

    .quick-action-card .arrow {
      color: var(--color-text-muted);
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      transition: transform 0.2s ease;
    }

    /* Responsive */
    @media (max-width: 1280px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: var(--spacing-md);
      }

      .dashboard-header {
        flex-direction: column;
      }

      .header-actions {
        width: 100%;
      }

      .action-btn {
        flex: 1;
        justify-content: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-card {
        flex-direction: row;
        align-items: center;
      }

      .chart-legend {
        display: none;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .page-title {
        font-size: 1.5rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .activity-description {
        display: none;
      }
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
