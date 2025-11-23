import { Component, OnInit, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface VulnerabilityItem {
  id: string;
  cveId: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  affectedAssets: number;
  status: 'open' | 'in_progress' | 'resolved';
  discoveredDate: string;
  lastSeen: string;
}

type SeverityKey = 'critical' | 'high' | 'medium' | 'low';

interface SeverityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface SeverityFilter {
  label: string;
  value: SeverityKey;
}

@Component({
  selector: 'app-vulnerabilities-list',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <div class="vulnerabilities-container" [class.loaded]="isLoaded()">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">Vulnerabilities</h1>
          <p class="page-subtitle">{{ filteredVulnerabilities().length }} vulnerabilities found</p>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary">
            <mat-icon>file_download</mat-icon>
            Export
          </button>
          <button class="action-btn primary">
            <mat-icon>radar</mat-icon>
            Run Scan
          </button>
        </div>
      </header>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <mat-icon>search</mat-icon>
          <input
            type="text"
            placeholder="Search CVE ID, title..."
            [value]="searchTerm()"
            (input)="onSearch($event)"
          />
        </div>
        <div class="filter-chips">
          @for (filter of severityFilters; track filter.value) {
            <button
              class="filter-chip"
              [class.active]="selectedSeverity() === filter.value"
              [class]="filter.value"
              (click)="selectSeverity(filter.value)"
            >
              <span class="chip-dot"></span>
              {{ filter.label }}
              <span class="chip-count">{{ getCounts()[filter.value] }}</span>
            </button>
          }
        </div>
        <div class="status-filters">
          @for (status of statusFilters; track status.value) {
            <button
              class="status-chip"
              [class.active]="selectedStatus() === status.value"
              (click)="selectStatus(status.value)"
            >
              {{ status.label }}
            </button>
          }
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-item critical">
          <span class="stat-value">{{ getCounts().critical }}</span>
          <span class="stat-label">Critical</span>
        </div>
        <div class="stat-item high">
          <span class="stat-value">{{ getCounts().high }}</span>
          <span class="stat-label">High</span>
        </div>
        <div class="stat-item medium">
          <span class="stat-value">{{ getCounts().medium }}</span>
          <span class="stat-label">Medium</span>
        </div>
        <div class="stat-item low">
          <span class="stat-value">{{ getCounts().low }}</span>
          <span class="stat-label">Low</span>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <div class="table-header">
          <span class="col-cve">CVE ID</span>
          <span class="col-title">Title</span>
          <span class="col-severity">Severity</span>
          <span class="col-cvss">CVSS</span>
          <span class="col-assets">Assets</span>
          <span class="col-status">Status</span>
          <span class="col-date">Discovered</span>
          <span class="col-actions">Actions</span>
        </div>

        <div class="table-body">
          @for (vuln of filteredVulnerabilities(); track vuln.id; let i = $index) {
            <a
              [routerLink]="['/cve', vuln.cveId]"
              class="table-row"
              [style.animation-delay]="(i * 50) + 'ms'"
            >
              <span class="col-cve">
                <mat-icon class="cve-icon">bug_report</mat-icon>
                {{ vuln.cveId }}
              </span>
              <span class="col-title">{{ vuln.title }}</span>
              <span class="col-severity">
                <span class="severity-badge" [class]="vuln.severity">
                  {{ vuln.severity }}
                </span>
              </span>
              <span class="col-cvss">
                <span class="cvss-score" [class]="getCvssClass(vuln.cvss)">
                  {{ vuln.cvss.toFixed(1) }}
                </span>
              </span>
              <span class="col-assets">
                <mat-icon>devices</mat-icon>
                {{ vuln.affectedAssets }}
              </span>
              <span class="col-status">
                <span class="status-badge" [class]="vuln.status">
                  {{ formatStatus(vuln.status) }}
                </span>
              </span>
              <span class="col-date">{{ vuln.discoveredDate }}</span>
              <span class="col-actions">
                <button class="icon-btn" (click)="$event.preventDefault()">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </span>
            </a>
          }
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <span class="page-info">Showing 1-{{ filteredVulnerabilities().length }} of {{ vulnerabilities.length }}</span>
        <div class="page-controls">
          <button class="page-btn" disabled>
            <mat-icon>chevron_left</mat-icon>
          </button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .vulnerabilities-container {
      padding: var(--spacing-lg);
      max-width: 1400px;
      margin: 0 auto;
      opacity: 0;
      animation: fadeIn 0.4s ease forwards;
    }

    .vulnerabilities-container.loaded {
      opacity: 1;
    }

    @keyframes fadeIn {
      to { opacity: 1; }
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
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

    .action-btn.primary {
      background-color: var(--color-critical);
      color: white;
    }

    .action-btn.primary:hover {
      background-color: #b91c1c;
    }

    /* Filters */
    .filters-bar {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: var(--spacing-md);
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      flex: 1;
      max-width: 20rem;
    }

    .search-box mat-icon {
      color: var(--color-text-muted);
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .search-box input {
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.875rem;
      color: var(--color-text-primary);
      width: 100%;
    }

    .filter-chips {
      display: flex;
      gap: var(--spacing-xs);
    }

    .filter-chip {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: var(--spacing-xs) var(--spacing-sm);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      background: var(--color-bg-primary);
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .chip-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--radius-full);
    }

    .filter-chip.critical .chip-dot { background-color: var(--color-critical); }
    .filter-chip.high .chip-dot { background-color: var(--color-high); }
    .filter-chip.medium .chip-dot { background-color: var(--color-medium); }
    .filter-chip.low .chip-dot { background-color: var(--color-success); }

    .filter-chip.active {
      border-color: currentColor;
    }

    .filter-chip.active.critical { background-color: #fef2f2; color: var(--color-critical); }
    .filter-chip.active.high { background-color: #fff7ed; color: var(--color-high); }
    .filter-chip.active.medium { background-color: #eff6ff; color: var(--color-medium); }
    .filter-chip.active.low { background-color: #f0fdf4; color: var(--color-success); }

    .chip-count {
      background-color: var(--color-bg-tertiary);
      padding: 0.125rem 0.375rem;
      border-radius: var(--radius-full);
      font-size: 0.6875rem;
    }

    .filter-chip.active .chip-count {
      background-color: rgba(255,255,255,0.3);
    }

    .status-filters {
      display: flex;
      gap: var(--spacing-xs);
      margin-left: auto;
    }

    .status-chip {
      padding: var(--spacing-xs) var(--spacing-sm);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-bg-primary);
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .status-chip.active {
      background-color: var(--color-text-primary);
      color: white;
      border-color: var(--color-text-primary);
    }

    /* Stats Bar */
    .stats-bar {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-md);
      border-left: 3px solid;
    }

    .stat-item.critical { border-color: var(--color-critical); }
    .stat-item.high { border-color: var(--color-high); }
    .stat-item.medium { border-color: var(--color-medium); }
    .stat-item.low { border-color: var(--color-success); }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    /* Table */
    .table-container {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 10rem 1fr 6rem 4rem 5rem 7rem 6rem 4rem;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--color-bg-secondary);
      border-bottom: 1px solid var(--color-border);
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table-body {
      max-height: 32rem;
      overflow-y: auto;
    }

    .table-row {
      display: grid;
      grid-template-columns: 10rem 1fr 6rem 4rem 5rem 7rem 6rem 4rem;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--color-border);
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      opacity: 0;
      animation: slideIn 0.3s ease forwards;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-0.5rem);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .table-row:hover {
      background-color: var(--color-bg-secondary);
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .col-cve {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-info);
    }

    .cve-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: var(--color-text-muted);
    }

    .col-title {
      font-size: 0.875rem;
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .severity-badge {
      display: inline-flex;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-full);
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .severity-badge.critical { background-color: #fef2f2; color: var(--color-critical); }
    .severity-badge.high { background-color: #fff7ed; color: var(--color-high); }
    .severity-badge.medium { background-color: #eff6ff; color: var(--color-medium); }
    .severity-badge.low { background-color: #f0fdf4; color: var(--color-success); }

    .cvss-score {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2.5rem;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.8125rem;
      font-weight: 700;
    }

    .cvss-score.critical { background-color: var(--color-critical); color: white; }
    .cvss-score.high { background-color: var(--color-high); color: white; }
    .cvss-score.medium { background-color: var(--color-medium); color: white; }
    .cvss-score.low { background-color: var(--color-success); color: white; }

    .col-assets {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .col-assets mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .status-badge {
      display: inline-flex;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.6875rem;
      font-weight: 500;
    }

    .status-badge.open { background-color: #fef2f2; color: var(--color-critical); }
    .status-badge.in_progress { background-color: #fefce8; color: #ca8a04; }
    .status-badge.resolved { background-color: #f0fdf4; color: var(--color-success); }

    .col-date {
      font-size: 0.8125rem;
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
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      margin-top: var(--spacing-md);
    }

    .page-info {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
    }

    .page-controls {
      display: flex;
      gap: var(--spacing-xs);
    }

    .page-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      height: 2rem;
      padding: 0 var(--spacing-sm);
      border: 1px solid var(--color-border);
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-sm);
      font-size: 0.8125rem;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .page-btn:hover:not(:disabled) {
      background-color: var(--color-bg-secondary);
    }

    .page-btn.active {
      background-color: var(--color-text-primary);
      color: white;
      border-color: var(--color-text-primary);
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .table-header,
      .table-row {
        grid-template-columns: 8rem 1fr 5rem 4rem 5rem;
      }

      .col-status,
      .col-date,
      .col-actions {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .vulnerabilities-container {
        padding: var(--spacing-md);
      }

      .filters-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        max-width: none;
      }

      .filter-chips {
        overflow-x: auto;
        padding-bottom: var(--spacing-xs);
      }

      .status-filters {
        margin-left: 0;
      }

      .stats-bar {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }

      .table-header {
        display: none;
      }

      .table-row {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .col-cve {
        font-size: 0.9375rem;
      }

      .col-title {
        white-space: normal;
      }
    }
  `,
})
export class VulnerabilitiesListComponent implements OnInit {
  isLoaded = signal(false);
  searchTerm = signal('');
  selectedSeverity = signal<string | null>(null);
  selectedStatus = signal<string | null>(null);

  severityFilters: SeverityFilter[] = [
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  statusFilters = [
    { label: 'All', value: null },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Resolved', value: 'resolved' },
  ];

  vulnerabilities: VulnerabilityItem[] = [
    { id: '1', cveId: 'CVE-2024-6387', title: 'OpenSSH Remote Code Execution', severity: 'critical', cvss: 9.8, affectedAssets: 4, status: 'open', discoveredDate: '2024-07-01', lastSeen: '2 hours ago' },
    { id: '2', cveId: 'CVE-2024-5678', title: 'SSL/TLS Certificate Validation Bypass', severity: 'high', cvss: 8.1, affectedAssets: 12, status: 'in_progress', discoveredDate: '2024-06-15', lastSeen: '1 day ago' },
    { id: '3', cveId: 'CVE-2024-4321', title: 'Apache HTTP Server Buffer Overflow', severity: 'critical', cvss: 9.1, affectedAssets: 3, status: 'open', discoveredDate: '2024-06-20', lastSeen: '5 hours ago' },
    { id: '4', cveId: 'CVE-2024-3456', title: 'PostgreSQL SQL Injection', severity: 'high', cvss: 7.5, affectedAssets: 2, status: 'resolved', discoveredDate: '2024-05-10', lastSeen: '1 week ago' },
    { id: '5', cveId: 'CVE-2024-2345', title: 'Nginx Information Disclosure', severity: 'medium', cvss: 5.3, affectedAssets: 8, status: 'open', discoveredDate: '2024-06-25', lastSeen: '3 hours ago' },
    { id: '6', cveId: 'CVE-2024-1234', title: 'Redis Authentication Bypass', severity: 'critical', cvss: 9.8, affectedAssets: 1, status: 'resolved', discoveredDate: '2024-04-15', lastSeen: '2 weeks ago' },
    { id: '7', cveId: 'CVE-2024-9876', title: 'Linux Kernel Privilege Escalation', severity: 'high', cvss: 7.8, affectedAssets: 15, status: 'in_progress', discoveredDate: '2024-07-05', lastSeen: '1 hour ago' },
    { id: '8', cveId: 'CVE-2024-8765', title: 'Docker Container Escape', severity: 'critical', cvss: 9.0, affectedAssets: 6, status: 'open', discoveredDate: '2024-07-02', lastSeen: '4 hours ago' },
    { id: '9', cveId: 'CVE-2024-7654', title: 'MySQL Denial of Service', severity: 'medium', cvss: 6.5, affectedAssets: 4, status: 'in_progress', discoveredDate: '2024-06-18', lastSeen: '12 hours ago' },
    { id: '10', cveId: 'CVE-2024-6543', title: 'Node.js Path Traversal', severity: 'low', cvss: 4.3, affectedAssets: 2, status: 'resolved', discoveredDate: '2024-05-20', lastSeen: '3 weeks ago' },
  ];

  filteredVulnerabilities = computed(() => {
    let result = this.vulnerabilities;

    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(v =>
        v.cveId.toLowerCase().includes(search) ||
        v.title.toLowerCase().includes(search)
      );
    }

    const severity = this.selectedSeverity();
    if (severity) {
      result = result.filter(v => v.severity === severity);
    }

    const status = this.selectedStatus();
    if (status) {
      result = result.filter(v => v.status === status);
    }

    return result;
  });

  ngOnInit(): void {
    setTimeout(() => this.isLoaded.set(true), 100);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  selectSeverity(value: string): void {
    this.selectedSeverity.set(this.selectedSeverity() === value ? null : value);
  }

  selectStatus(value: string | null): void {
    this.selectedStatus.set(value);
  }

  getCounts(): SeverityCounts {
    return {
      critical: this.vulnerabilities.filter(v => v.severity === 'critical').length,
      high: this.vulnerabilities.filter(v => v.severity === 'high').length,
      medium: this.vulnerabilities.filter(v => v.severity === 'medium').length,
      low: this.vulnerabilities.filter(v => v.severity === 'low').length,
    };
  }

  getCvssClass(cvss: number): string {
    if (cvss >= 9.0) return 'critical';
    if (cvss >= 7.0) return 'high';
    if (cvss >= 4.0) return 'medium';
    return 'low';
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
