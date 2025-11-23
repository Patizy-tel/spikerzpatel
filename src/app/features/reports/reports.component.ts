import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  lastGenerated?: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  nextRun: string;
  recipients: number;
  status: 'active' | 'paused';
}

interface RecentReport {
  id: string;
  name: string;
  generatedAt: string;
  size: string;
  format: 'pdf' | 'csv' | 'xlsx';
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="reports-container" [class.loaded]="isLoaded()">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">Reports</h1>
          <p class="page-subtitle">Generate and schedule security reports</p>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary">
            <mat-icon>schedule</mat-icon>
            Schedule Report
          </button>
          <button class="action-btn primary">
            <mat-icon>add</mat-icon>
            New Report
          </button>
        </div>
      </header>

      <!-- Report Templates -->
      <section class="section">
        <h2 class="section-title">
          <mat-icon>description</mat-icon>
          Report Templates
        </h2>
        <div class="templates-grid">
          @for (template of reportTemplates; track template.id; let i = $index) {
            <div class="template-card" [style.animation-delay]="(i * 80) + 'ms'">
              <div class="template-icon" [class]="template.category">
                <mat-icon>{{ template.icon }}</mat-icon>
              </div>
              <div class="template-content">
                <h3 class="template-name">{{ template.name }}</h3>
                <p class="template-desc">{{ template.description }}</p>
                @if (template.lastGenerated) {
                  <span class="last-generated">Last: {{ template.lastGenerated }}</span>
                }
              </div>
              <button class="generate-btn">
                <mat-icon>play_arrow</mat-icon>
                Generate
              </button>
            </div>
          }
        </div>
      </section>

      <!-- Two Column Layout -->
      <div class="two-column">
        <!-- Scheduled Reports -->
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">
              <mat-icon>schedule</mat-icon>
              Scheduled Reports
            </h2>
            <button class="text-btn">View All</button>
          </div>
          <div class="scheduled-list">
            @for (report of scheduledReports; track report.id; let i = $index) {
              <div class="scheduled-item" [style.animation-delay]="(i * 60 + 300) + 'ms'">
                <div class="scheduled-info">
                  <span class="scheduled-name">{{ report.name }}</span>
                  <div class="scheduled-meta">
                    <span class="meta-item">
                      <mat-icon>repeat</mat-icon>
                      {{ report.frequency }}
                    </span>
                    <span class="meta-item">
                      <mat-icon>group</mat-icon>
                      {{ report.recipients }} recipients
                    </span>
                  </div>
                </div>
                <div class="scheduled-actions">
                  <span class="next-run">Next: {{ report.nextRun }}</span>
                  <span class="status-badge" [class]="report.status">{{ report.status }}</span>
                  <button class="icon-btn">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Recent Reports -->
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">
              <mat-icon>history</mat-icon>
              Recent Reports
            </h2>
            <button class="text-btn">View All</button>
          </div>
          <div class="recent-list">
            @for (report of recentReports; track report.id; let i = $index) {
              <div class="recent-item" [style.animation-delay]="(i * 60 + 300) + 'ms'">
                <div class="file-icon" [class]="report.format">
                  <mat-icon>{{ getFormatIcon(report.format) }}</mat-icon>
                </div>
                <div class="recent-info">
                  <span class="recent-name">{{ report.name }}</span>
                  <span class="recent-meta">{{ report.generatedAt }} · {{ report.size }}</span>
                </div>
                <div class="recent-actions">
                  <button class="icon-btn" title="Download">
                    <mat-icon>download</mat-icon>
                  </button>
                  <button class="icon-btn" title="Share">
                    <mat-icon>share</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>
        </section>
      </div>

      <!-- Compliance Section -->
      <section class="section compliance-section">
        <h2 class="section-title">
          <mat-icon>verified</mat-icon>
          Compliance Reports
        </h2>
        <div class="compliance-grid">
          <div class="compliance-card">
            <div class="compliance-header">
              <span class="compliance-label">SOC 2</span>
              <span class="compliance-status passed">
                <mat-icon>check_circle</mat-icon>
                Compliant
              </span>
            </div>
            <div class="compliance-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 94%"></div>
              </div>
              <span class="progress-text">94% Complete</span>
            </div>
            <button class="compliance-btn">Generate Report</button>
          </div>
          <div class="compliance-card">
            <div class="compliance-header">
              <span class="compliance-label">PCI DSS</span>
              <span class="compliance-status warning">
                <mat-icon>warning</mat-icon>
                Action Required
              </span>
            </div>
            <div class="compliance-progress">
              <div class="progress-bar">
                <div class="progress-fill warning" style="width: 78%"></div>
              </div>
              <span class="progress-text">78% Complete</span>
            </div>
            <button class="compliance-btn">Generate Report</button>
          </div>
          <div class="compliance-card">
            <div class="compliance-header">
              <span class="compliance-label">HIPAA</span>
              <span class="compliance-status passed">
                <mat-icon>check_circle</mat-icon>
                Compliant
              </span>
            </div>
            <div class="compliance-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 100%"></div>
              </div>
              <span class="progress-text">100% Complete</span>
            </div>
            <button class="compliance-btn">Generate Report</button>
          </div>
          <div class="compliance-card">
            <div class="compliance-header">
              <span class="compliance-label">ISO 27001</span>
              <span class="compliance-status passed">
                <mat-icon>check_circle</mat-icon>
                Compliant
              </span>
            </div>
            <div class="compliance-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 91%"></div>
              </div>
              <span class="progress-text">91% Complete</span>
            </div>
            <button class="compliance-btn">Generate Report</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: `
    .reports-container {
      padding: var(--spacing-lg);
      max-width: 1400px;
      margin: 0 auto;
      opacity: 0;
      animation: fadeIn 0.4s ease forwards;
    }

    .reports-container.loaded { opacity: 1; }

    @keyframes fadeIn { to { opacity: 1; } }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);
      flex-wrap: wrap;
      gap: var(--spacing-md);
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

    .action-btn.primary {
      background-color: #9333ea;
      color: white;
    }

    .action-btn.primary:hover {
      background-color: #7e22ce;
    }

    /* Sections */
    .section {
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
      margin: 0 0 var(--spacing-md);
    }

    .section-title mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--color-text-muted);
    }

    .section-header .section-title {
      margin: 0;
    }

    .text-btn {
      background: none;
      border: none;
      color: var(--color-info);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      padding: 0;
    }

    .text-btn:hover {
      color: #2563eb;
    }

    /* Templates Grid */
    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
      gap: var(--spacing-md);
    }

    .template-card {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(0.5rem);
      animation: slideUp 0.4s ease forwards;
    }

    @keyframes slideUp {
      to { opacity: 1; transform: translateY(0); }
    }

    .template-card:hover {
      transform: translateY(-0.125rem);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .template-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--radius-md);
      flex-shrink: 0;
    }

    .template-icon.vulnerability { background: linear-gradient(135deg, #fef2f2, #fecaca); color: var(--color-critical); }
    .template-icon.asset { background: linear-gradient(135deg, #eff6ff, #bfdbfe); color: var(--color-info); }
    .template-icon.compliance { background: linear-gradient(135deg, #f0fdf4, #bbf7d0); color: var(--color-success); }
    .template-icon.executive { background: linear-gradient(135deg, #faf5ff, #e9d5ff); color: #9333ea; }

    .template-content {
      flex: 1;
      min-width: 0;
    }

    .template-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem;
    }

    .template-desc {
      font-size: 0.8125rem;
      color: var(--color-text-secondary);
      margin: 0;
      line-height: 1.4;
    }

    .last-generated {
      font-size: 0.6875rem;
      color: var(--color-text-muted);
      margin-top: 0.5rem;
      display: block;
    }

    .generate-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: var(--spacing-xs) var(--spacing-sm);
      background-color: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .generate-btn mat-icon {
      font-size: 0.875rem;
      width: 0.875rem;
      height: 0.875rem;
    }

    .generate-btn:hover {
      background-color: var(--color-info);
      border-color: var(--color-info);
      color: white;
    }

    /* Two Column */
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }

    .two-column .section {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--spacing-lg);
      margin-bottom: 0;
    }

    .two-column .section-title {
      margin: 0;
    }

    /* Scheduled List */
    .scheduled-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .scheduled-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm);
      border-radius: var(--radius-md);
      transition: background-color 0.2s;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    }

    .scheduled-item:hover {
      background-color: var(--color-bg-secondary);
    }

    .scheduled-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .scheduled-meta {
      display: flex;
      gap: var(--spacing-md);
      margin-top: 0.25rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .meta-item mat-icon {
      font-size: 0.875rem;
      width: 0.875rem;
      height: 0.875rem;
    }

    .scheduled-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .next-run {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .status-badge {
      font-size: 0.6875rem;
      font-weight: 500;
      padding: 0.125rem 0.5rem;
      border-radius: var(--radius-full);
      text-transform: capitalize;
    }

    .status-badge.active {
      background-color: #f0fdf4;
      color: var(--color-success);
    }

    .status-badge.paused {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-muted);
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      background: transparent;
      border-radius: var(--radius-sm);
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .icon-btn:hover {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }

    /* Recent List */
    .recent-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .recent-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm);
      border-radius: var(--radius-md);
      transition: background-color 0.2s;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    }

    .recent-item:hover {
      background-color: var(--color-bg-secondary);
    }

    .file-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--radius-md);
      flex-shrink: 0;
    }

    .file-icon.pdf { background-color: #fef2f2; color: var(--color-critical); }
    .file-icon.csv { background-color: #f0fdf4; color: var(--color-success); }
    .file-icon.xlsx { background-color: #f0fdf4; color: #059669; }

    .file-icon mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .recent-info {
      flex: 1;
      min-width: 0;
    }

    .recent-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
      display: block;
    }

    .recent-meta {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .recent-actions {
      display: flex;
      gap: 0;
    }

    /* Compliance */
    .compliance-section {
      margin-top: var(--spacing-xl);
    }

    .compliance-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-md);
    }

    .compliance-card {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--spacing-md);
    }

    .compliance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }

    .compliance-label {
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .compliance-status {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.6875rem;
      font-weight: 500;
    }

    .compliance-status mat-icon {
      font-size: 0.875rem;
      width: 0.875rem;
      height: 0.875rem;
    }

    .compliance-status.passed {
      color: var(--color-success);
    }

    .compliance-status.warning {
      color: var(--color-high);
    }

    .compliance-progress {
      margin-bottom: var(--spacing-md);
    }

    .progress-bar {
      height: 0.375rem;
      background-color: var(--color-bg-tertiary);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: 0.375rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-success), #4ade80);
      border-radius: var(--radius-full);
      transition: width 1s ease;
    }

    .progress-fill.warning {
      background: linear-gradient(90deg, var(--color-high), #fb923c);
    }

    .progress-text {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .compliance-btn {
      width: 100%;
      padding: var(--spacing-sm);
      background-color: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .compliance-btn:hover {
      background-color: var(--color-bg-tertiary);
    }

    /* Responsive */
    @media (max-width: 1280px) {
      .compliance-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .two-column {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .reports-container {
        padding: var(--spacing-md);
      }

      .templates-grid {
        grid-template-columns: 1fr;
      }

      .compliance-grid {
        grid-template-columns: 1fr;
      }

      .template-card {
        flex-direction: column;
      }

      .generate-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `,
})
export class ReportsComponent implements OnInit {
  isLoaded = signal(false);

  reportTemplates: ReportTemplate[] = [
    { id: '1', name: 'Vulnerability Summary', description: 'Overview of all vulnerabilities by severity and status', icon: 'bug_report', category: 'vulnerability', lastGenerated: 'Yesterday' },
    { id: '2', name: 'Asset Inventory', description: 'Complete list of all discovered assets and their status', icon: 'devices', category: 'asset', lastGenerated: '3 days ago' },
    { id: '3', name: 'Executive Summary', description: 'High-level security posture report for leadership', icon: 'assessment', category: 'executive', lastGenerated: 'Last week' },
    { id: '4', name: 'Remediation Progress', description: 'Track patch deployment and remediation efforts', icon: 'healing', category: 'compliance' },
    { id: '5', name: 'Risk Assessment', description: 'Detailed risk analysis by asset and vulnerability', icon: 'security', category: 'vulnerability' },
    { id: '6', name: 'Trend Analysis', description: 'Historical vulnerability trends and patterns', icon: 'trending_up', category: 'executive' },
  ];

  scheduledReports: ScheduledReport[] = [
    { id: '1', name: 'Weekly Security Summary', frequency: 'Weekly', nextRun: 'Monday 9:00 AM', recipients: 5, status: 'active' },
    { id: '2', name: 'Monthly Executive Report', frequency: 'Monthly', nextRun: 'Dec 1, 2024', recipients: 3, status: 'active' },
    { id: '3', name: 'Daily Critical Alerts', frequency: 'Daily', nextRun: 'Tomorrow 6:00 AM', recipients: 8, status: 'active' },
    { id: '4', name: 'Quarterly Compliance', frequency: 'Quarterly', nextRun: 'Jan 1, 2025', recipients: 4, status: 'paused' },
  ];

  recentReports: RecentReport[] = [
    { id: '1', name: 'vulnerability-summary-nov-2024.pdf', generatedAt: '2 hours ago', size: '2.4 MB', format: 'pdf' },
    { id: '2', name: 'asset-inventory-export.csv', generatedAt: 'Yesterday', size: '856 KB', format: 'csv' },
    { id: '3', name: 'executive-summary-q3.pdf', generatedAt: '3 days ago', size: '1.8 MB', format: 'pdf' },
    { id: '4', name: 'compliance-audit-2024.xlsx', generatedAt: 'Last week', size: '3.2 MB', format: 'xlsx' },
  ];

  ngOnInit(): void {
    setTimeout(() => this.isLoaded.set(true), 100);
  }

  getFormatIcon(format: string): string {
    const icons: Record<string, string> = {
      pdf: 'picture_as_pdf',
      csv: 'grid_on',
      xlsx: 'table_chart',
    };
    return icons[format] || 'description';
  }
}
