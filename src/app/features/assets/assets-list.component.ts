import { Component, OnInit, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Asset {
  id: string;
  name: string;
  ipAddress: string;
  type: 'server' | 'database' | 'network' | 'container' | 'cloud';
  os: string;
  risk: 'critical' | 'high' | 'medium' | 'low';
  vulnerabilities: number;
  lastScanned: string;
  status: 'online' | 'offline' | 'maintenance';
  department: string;
}

@Component({
  selector: 'app-assets-list',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="assets-container" [class.loaded]="isLoaded()">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">Asset Inventory</h1>
          <p class="page-subtitle">{{ filteredAssets().length }} assets discovered</p>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary">
            <mat-icon>file_download</mat-icon>
            Export
          </button>
          <button class="action-btn primary">
            <mat-icon>add</mat-icon>
            Add Asset
          </button>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon total">
            <mat-icon>devices</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ assets.length }}</span>
            <span class="stat-label">Total Assets</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon online">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getStatusCount('online') }}</span>
            <span class="stat-label">Online</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon at-risk">
            <mat-icon>warning</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getAtRiskCount() }}</span>
            <span class="stat-label">At Risk</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon scanned">
            <mat-icon>radar</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ assets.length }}</span>
            <span class="stat-label">Scanned Today</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <mat-icon>search</mat-icon>
          <input
            type="text"
            placeholder="Search assets..."
            [value]="searchTerm()"
            (input)="onSearch($event)"
          />
        </div>
        <div class="filter-group">
          <span class="filter-label">Type:</span>
          <div class="filter-chips">
            @for (type of assetTypes; track type.value) {
              <button
                class="filter-chip"
                [class.active]="selectedType() === type.value"
                (click)="selectType(type.value)"
              >
                <mat-icon>{{ type.icon }}</mat-icon>
                {{ type.label }}
              </button>
            }
          </div>
        </div>
        <div class="view-toggle">
          <button class="view-btn" [class.active]="viewMode() === 'grid'" (click)="viewMode.set('grid')">
            <mat-icon>grid_view</mat-icon>
          </button>
          <button class="view-btn" [class.active]="viewMode() === 'list'" (click)="viewMode.set('list')">
            <mat-icon>view_list</mat-icon>
          </button>
        </div>
      </div>

      <!-- Assets Grid/List -->
      @if (viewMode() === 'grid') {
        <div class="assets-grid">
          @for (asset of filteredAssets(); track asset.id; let i = $index) {
            <div class="asset-card" [style.animation-delay]="(i * 50) + 'ms'">
              <div class="card-header">
                <div class="asset-icon" [class]="asset.type">
                  <mat-icon>{{ getAssetIcon(asset.type) }}</mat-icon>
                </div>
                <span class="status-dot" [class]="asset.status"></span>
              </div>
              <div class="card-body">
                <h3 class="asset-name">{{ asset.name }}</h3>
                <p class="asset-ip">{{ asset.ipAddress }}</p>
                <div class="asset-meta">
                  <span class="meta-item">
                    <mat-icon>computer</mat-icon>
                    {{ asset.os }}
                  </span>
                  <span class="meta-item">
                    <mat-icon>business</mat-icon>
                    {{ asset.department }}
                  </span>
                </div>
              </div>
              <div class="card-footer">
                <div class="risk-indicator" [class]="asset.risk">
                  <span class="risk-dot"></span>
                  {{ asset.risk }} risk
                </div>
                <div class="vuln-count" [class.has-vulns]="asset.vulnerabilities > 0">
                  <mat-icon>bug_report</mat-icon>
                  {{ asset.vulnerabilities }}
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="assets-table">
          <div class="table-header">
            <span class="col-name">Asset</span>
            <span class="col-ip">IP Address</span>
            <span class="col-type">Type</span>
            <span class="col-os">OS</span>
            <span class="col-risk">Risk</span>
            <span class="col-vulns">Vulns</span>
            <span class="col-status">Status</span>
            <span class="col-scanned">Last Scanned</span>
          </div>
          <div class="table-body">
            @for (asset of filteredAssets(); track asset.id; let i = $index) {
              <div class="table-row" [style.animation-delay]="(i * 30) + 'ms'">
                <span class="col-name">
                  <div class="asset-icon small" [class]="asset.type">
                    <mat-icon>{{ getAssetIcon(asset.type) }}</mat-icon>
                  </div>
                  <div class="name-info">
                    <span class="name">{{ asset.name }}</span>
                    <span class="dept">{{ asset.department }}</span>
                  </div>
                </span>
                <span class="col-ip">{{ asset.ipAddress }}</span>
                <span class="col-type">{{ asset.type }}</span>
                <span class="col-os">{{ asset.os }}</span>
                <span class="col-risk">
                  <span class="risk-badge" [class]="asset.risk">{{ asset.risk }}</span>
                </span>
                <span class="col-vulns" [class.has-vulns]="asset.vulnerabilities > 0">
                  {{ asset.vulnerabilities }}
                </span>
                <span class="col-status">
                  <span class="status-badge" [class]="asset.status">
                    <span class="status-dot"></span>
                    {{ asset.status }}
                  </span>
                </span>
                <span class="col-scanned">{{ asset.lastScanned }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .assets-container {
      padding: var(--spacing-lg);
      max-width: 1400px;
      margin: 0 auto;
      opacity: 0;
      animation: fadeIn 0.4s ease forwards;
    }

    .assets-container.loaded { opacity: 1; }

    @keyframes fadeIn { to { opacity: 1; } }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
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
      background-color: var(--color-info);
      color: white;
    }

    .action-btn.primary:hover {
      background-color: #2563eb;
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: var(--radius-md);
    }

    .stat-icon.total { background: linear-gradient(135deg, #eff6ff, #bfdbfe); color: var(--color-info); }
    .stat-icon.online { background: linear-gradient(135deg, #f0fdf4, #bbf7d0); color: var(--color-success); }
    .stat-icon.at-risk { background: linear-gradient(135deg, #fef2f2, #fecaca); color: var(--color-critical); }
    .stat-icon.scanned { background: linear-gradient(135deg, #faf5ff, #e9d5ff); color: #9333ea; }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    /* Filters */
    .filters-bar {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: var(--spacing-lg);
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      min-width: 16rem;
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

    .filter-group {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .filter-label {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
    }

    .filter-chips {
      display: flex;
      gap: var(--spacing-xs);
    }

    .filter-chip {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: var(--spacing-xs) var(--spacing-sm);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-bg-primary);
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-chip mat-icon {
      font-size: 0.875rem;
      width: 0.875rem;
      height: 0.875rem;
    }

    .filter-chip.active {
      background-color: var(--color-info);
      color: white;
      border-color: var(--color-info);
    }

    .view-toggle {
      display: flex;
      gap: 0;
      margin-left: auto;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .view-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      background: var(--color-bg-primary);
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .view-btn.active {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }

    /* Assets Grid */
    .assets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
      gap: var(--spacing-md);
    }

    .asset-card {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--spacing-md);
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(0.5rem);
      animation: slideUp 0.4s ease forwards;
    }

    @keyframes slideUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .asset-card:hover {
      transform: translateY(-0.25rem);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-sm);
    }

    .asset-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--radius-md);
    }

    .asset-icon.server { background: linear-gradient(135deg, #eff6ff, #bfdbfe); color: var(--color-info); }
    .asset-icon.database { background: linear-gradient(135deg, #faf5ff, #e9d5ff); color: #9333ea; }
    .asset-icon.network { background: linear-gradient(135deg, #f0fdf4, #bbf7d0); color: var(--color-success); }
    .asset-icon.container { background: linear-gradient(135deg, #fefce8, #fef08a); color: #ca8a04; }
    .asset-icon.cloud { background: linear-gradient(135deg, #ecfeff, #a5f3fc); color: #0891b2; }

    .asset-icon.small {
      width: 2rem;
      height: 2rem;
    }

    .asset-icon.small mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .status-dot {
      width: 0.625rem;
      height: 0.625rem;
      border-radius: var(--radius-full);
    }

    .status-dot.online { background-color: var(--color-success); }
    .status-dot.offline { background-color: var(--color-text-muted); }
    .status-dot.maintenance { background-color: var(--color-high); }

    .asset-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .asset-ip {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
      font-family: var(--font-mono);
      margin: 0.25rem 0;
    }

    .asset-meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: var(--spacing-sm);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    .meta-item mat-icon {
      font-size: 0.875rem;
      width: 0.875rem;
      height: 0.875rem;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--spacing-md);
      padding-top: var(--spacing-sm);
      border-top: 1px solid var(--color-border);
    }

    .risk-indicator {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .risk-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--radius-full);
    }

    .risk-indicator.critical { color: var(--color-critical); }
    .risk-indicator.critical .risk-dot { background-color: var(--color-critical); }
    .risk-indicator.high { color: var(--color-high); }
    .risk-indicator.high .risk-dot { background-color: var(--color-high); }
    .risk-indicator.medium { color: var(--color-medium); }
    .risk-indicator.medium .risk-dot { background-color: var(--color-medium); }
    .risk-indicator.low { color: var(--color-success); }
    .risk-indicator.low .risk-dot { background-color: var(--color-success); }

    .vuln-count {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8125rem;
      color: var(--color-text-muted);
    }

    .vuln-count mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .vuln-count.has-vulns {
      color: var(--color-critical);
    }

    /* Table View */
    .assets-table {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 1.5fr 1fr 0.75fr 1fr 1fr;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--color-bg-secondary);
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .table-body {
      max-height: 32rem;
      overflow-y: auto;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 1.5fr 1fr 0.75fr 1fr 1fr;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--color-border);
      align-items: center;
      font-size: 0.8125rem;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    }

    .table-row:hover {
      background-color: var(--color-bg-secondary);
    }

    .col-name {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .name-info {
      display: flex;
      flex-direction: column;
    }

    .name-info .name {
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .name-info .dept {
      font-size: 0.6875rem;
      color: var(--color-text-muted);
    }

    .col-ip {
      font-family: var(--font-mono);
      color: var(--color-text-secondary);
    }

    .col-type {
      text-transform: capitalize;
      color: var(--color-text-secondary);
    }

    .col-os {
      color: var(--color-text-secondary);
    }

    .risk-badge {
      display: inline-flex;
      padding: 0.125rem 0.5rem;
      border-radius: var(--radius-full);
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .risk-badge.critical { background-color: #fef2f2; color: var(--color-critical); }
    .risk-badge.high { background-color: #fff7ed; color: var(--color-high); }
    .risk-badge.medium { background-color: #eff6ff; color: var(--color-medium); }
    .risk-badge.low { background-color: #f0fdf4; color: var(--color-success); }

    .col-vulns.has-vulns {
      color: var(--color-critical);
      font-weight: 600;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      text-transform: capitalize;
    }

    .status-badge .status-dot {
      width: 0.5rem;
      height: 0.5rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .assets-container {
        padding: var(--spacing-md);
      }

      .stats-row {
        grid-template-columns: 1fr;
      }

      .filters-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group {
        overflow-x: auto;
      }

      .view-toggle {
        margin-left: 0;
      }

      .assets-grid {
        grid-template-columns: 1fr;
      }

      .table-header,
      .table-row {
        grid-template-columns: 2fr 1fr 1fr;
      }

      .col-type, .col-os, .col-vulns, .col-scanned {
        display: none;
      }
    }
  `,
})
export class AssetsListComponent implements OnInit {
  isLoaded = signal(false);
  searchTerm = signal('');
  selectedType = signal<string | null>(null);
  viewMode = signal<'grid' | 'list'>('grid');

  assetTypes = [
    { label: 'Server', value: 'server', icon: 'dns' },
    { label: 'Database', value: 'database', icon: 'storage' },
    { label: 'Network', value: 'network', icon: 'router' },
    { label: 'Container', value: 'container', icon: 'widgets' },
    { label: 'Cloud', value: 'cloud', icon: 'cloud' },
  ];

  assets: Asset[] = [
    { id: '1', name: 'prod-web-server-01', ipAddress: '192.168.1.1', type: 'server', os: 'Ubuntu 22.04', risk: 'critical', vulnerabilities: 4, lastScanned: '2 hours ago', status: 'online', department: 'Engineering' },
    { id: '2', name: 'prod-web-server-02', ipAddress: '192.168.1.2', type: 'server', os: 'Ubuntu 22.04', risk: 'critical', vulnerabilities: 4, lastScanned: '2 hours ago', status: 'online', department: 'Engineering' },
    { id: '3', name: 'db-primary-01', ipAddress: '10.0.3.50', type: 'database', os: 'PostgreSQL 15', risk: 'high', vulnerabilities: 2, lastScanned: '1 hour ago', status: 'online', department: 'Data' },
    { id: '4', name: 'db-replica-01', ipAddress: '10.0.3.51', type: 'database', os: 'PostgreSQL 15', risk: 'high', vulnerabilities: 2, lastScanned: '1 hour ago', status: 'online', department: 'Data' },
    { id: '5', name: 'fw-edge-01', ipAddress: '203.0.113.1', type: 'network', os: 'pfSense 2.7', risk: 'low', vulnerabilities: 0, lastScanned: '30 min ago', status: 'online', department: 'Infrastructure' },
    { id: '6', name: 'lb-prod-01', ipAddress: '10.0.0.10', type: 'network', os: 'HAProxy 2.8', risk: 'medium', vulnerabilities: 1, lastScanned: '45 min ago', status: 'online', department: 'Infrastructure' },
    { id: '7', name: 'k8s-node-01', ipAddress: '10.0.4.10', type: 'container', os: 'Kubernetes 1.28', risk: 'medium', vulnerabilities: 3, lastScanned: '1 hour ago', status: 'online', department: 'DevOps' },
    { id: '8', name: 'k8s-node-02', ipAddress: '10.0.4.11', type: 'container', os: 'Kubernetes 1.28', risk: 'low', vulnerabilities: 1, lastScanned: '1 hour ago', status: 'maintenance', department: 'DevOps' },
    { id: '9', name: 'aws-ec2-prod-01', ipAddress: '52.14.32.100', type: 'cloud', os: 'Amazon Linux 2', risk: 'high', vulnerabilities: 5, lastScanned: '3 hours ago', status: 'online', department: 'Cloud' },
    { id: '10', name: 'cache-redis-01', ipAddress: '10.0.3.60', type: 'database', os: 'Redis 7.2', risk: 'medium', vulnerabilities: 1, lastScanned: '2 hours ago', status: 'online', department: 'Data' },
    { id: '11', name: 'api-gateway-01', ipAddress: '10.0.1.5', type: 'server', os: 'Kong 3.4', risk: 'high', vulnerabilities: 3, lastScanned: '1 hour ago', status: 'online', department: 'Engineering' },
    { id: '12', name: 'dev-server-01', ipAddress: '10.0.5.10', type: 'server', os: 'Ubuntu 22.04', risk: 'low', vulnerabilities: 0, lastScanned: '4 hours ago', status: 'offline', department: 'Development' },
  ];

  filteredAssets = computed(() => {
    let result = this.assets;

    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(a =>
        a.name.toLowerCase().includes(search) ||
        a.ipAddress.includes(search)
      );
    }

    const type = this.selectedType();
    if (type) {
      result = result.filter(a => a.type === type);
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

  selectType(value: string): void {
    this.selectedType.set(this.selectedType() === value ? null : value);
  }

  getStatusCount(status: string): number {
    return this.assets.filter(a => a.status === status).length;
  }

  getAtRiskCount(): number {
    return this.assets.filter(a => a.risk === 'critical' || a.risk === 'high').length;
  }

  getAssetIcon(type: string): string {
    const icons: Record<string, string> = {
      server: 'dns',
      database: 'storage',
      network: 'router',
      container: 'widgets',
      cloud: 'cloud',
    };
    return icons[type] || 'devices';
  }
}
