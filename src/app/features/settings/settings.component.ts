import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="settings-container" [class.loaded]="isLoaded()">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Manage your preferences and configurations</p>
        </div>
      </header>

      <div class="settings-layout">
        <!-- Sidebar Nav -->
        <nav class="settings-nav">
          @for (section of settingsSections; track section.id) {
            <button
              class="nav-item"
              [class.active]="activeSection() === section.id"
              (click)="activeSection.set(section.id)"
            >
              <mat-icon>{{ section.icon }}</mat-icon>
              {{ section.label }}
            </button>
          }
        </nav>

        <!-- Settings Content -->
        <div class="settings-content">
          <!-- Profile Section -->
          @if (activeSection() === 'profile') {
            <section class="settings-section">
              <h2 class="section-title">Profile Settings</h2>
              <p class="section-desc">Manage your account information</p>

              <div class="profile-card">
                <div class="avatar-section">
                  <div class="avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <button class="change-avatar-btn">Change Photo</button>
                </div>
                <div class="profile-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label>First Name</label>
                      <input type="text" value="Patel" />
                    </div>
                    <div class="form-group">
                      <label>Last Name</label>
                      <input type="text" value="Tanaka" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" value="pateltanaka22@gmail.com" />
                  </div>
                  <div class="form-group">
                    <label>Role</label>
                    <input type="text" value="Security Analyst" disabled />
                  </div>
                </div>
              </div>
            </section>
          }

          <!-- Notifications Section -->
          @if (activeSection() === 'notifications') {
            <section class="settings-section">
              <h2 class="section-title">Notification Preferences</h2>
              <p class="section-desc">Configure how you receive alerts and updates</p>

              <div class="settings-card">
                <h3 class="card-title">Email Notifications</h3>
                <div class="toggle-list">
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <span class="toggle-label">Critical Vulnerabilities</span>
                      <span class="toggle-desc">Get notified when critical vulnerabilities are discovered</span>
                    </div>
                    <button class="toggle-switch active" (click)="toggleSetting($event)">
                      <span class="toggle-slider"></span>
                    </button>
                  </div>
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <span class="toggle-label">Weekly Summary</span>
                      <span class="toggle-desc">Receive weekly security summary reports</span>
                    </div>
                    <button class="toggle-switch active" (click)="toggleSetting($event)">
                      <span class="toggle-slider"></span>
                    </button>
                  </div>
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <span class="toggle-label">Asset Changes</span>
                      <span class="toggle-desc">Notify when new assets are discovered</span>
                    </div>
                    <button class="toggle-switch" (click)="toggleSetting($event)">
                      <span class="toggle-slider"></span>
                    </button>
                  </div>
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <span class="toggle-label">Scan Completion</span>
                      <span class="toggle-desc">Alert when vulnerability scans complete</span>
                    </div>
                    <button class="toggle-switch active" (click)="toggleSetting($event)">
                      <span class="toggle-slider"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="settings-card">
                <h3 class="card-title">Slack Integration</h3>
                <div class="integration-status">
                  <div class="status-info">
                    <mat-icon class="slack-icon">tag</mat-icon>
                    <div>
                      <span class="status-label">Connected to #security-alerts</span>
                      <span class="status-desc">Workspace: Company Security</span>
                    </div>
                  </div>
                  <button class="disconnect-btn">Disconnect</button>
                </div>
              </div>
            </section>
          }

          <!-- Security Section -->
          @if (activeSection() === 'security') {
            <section class="settings-section">
              <h2 class="section-title">Security Settings</h2>
              <p class="section-desc">Manage your account security</p>

              <div class="settings-card">
                <h3 class="card-title">Password</h3>
                <p class="card-desc">Last changed 30 days ago</p>
                <button class="action-btn secondary">Change Password</button>
              </div>

              <div class="settings-card">
                <h3 class="card-title">Two-Factor Authentication</h3>
                <div class="security-status enabled">
                  <mat-icon>verified_user</mat-icon>
                  <span>Enabled via Authenticator App</span>
                </div>
                <button class="action-btn secondary">Manage 2FA</button>
              </div>

              <div class="settings-card">
                <h3 class="card-title">Active Sessions</h3>
                <div class="sessions-list">
                  <div class="session-item current">
                    <mat-icon>computer</mat-icon>
                    <div class="session-info">
                      <span class="session-device">Windows · Chrome</span>
                      <span class="session-location">New York, US · Current session</span>
                    </div>
                  </div>
                  <div class="session-item">
                    <mat-icon>phone_iphone</mat-icon>
                    <div class="session-info">
                      <span class="session-device">iPhone · Safari</span>
                      <span class="session-location">New York, US · 2 hours ago</span>
                    </div>
                    <button class="revoke-btn">Revoke</button>
                  </div>
                </div>
              </div>
            </section>
          }

          <!-- Integrations Section -->
          @if (activeSection() === 'integrations') {
            <section class="settings-section">
              <h2 class="section-title">Integrations</h2>
              <p class="section-desc">Connect with external tools and services</p>

              <div class="integrations-grid">
                <div class="integration-card connected">
                  <div class="integration-header">
                    <div class="integration-icon jira">
                      <mat-icon>view_kanban</mat-icon>
                    </div>
                    <span class="connection-status connected">Connected</span>
                  </div>
                  <h4 class="integration-name">Jira</h4>
                  <p class="integration-desc">Create tickets for vulnerabilities automatically</p>
                  <button class="integration-btn">Configure</button>
                </div>

                <div class="integration-card connected">
                  <div class="integration-header">
                    <div class="integration-icon slack">
                      <mat-icon>tag</mat-icon>
                    </div>
                    <span class="connection-status connected">Connected</span>
                  </div>
                  <h4 class="integration-name">Slack</h4>
                  <p class="integration-desc">Send alerts to Slack channels</p>
                  <button class="integration-btn">Configure</button>
                </div>

                <div class="integration-card">
                  <div class="integration-header">
                    <div class="integration-icon github">
                      <mat-icon>code</mat-icon>
                    </div>
                    <span class="connection-status">Not Connected</span>
                  </div>
                  <h4 class="integration-name">GitHub</h4>
                  <p class="integration-desc">Scan repositories for vulnerabilities</p>
                  <button class="integration-btn connect">Connect</button>
                </div>

                <div class="integration-card">
                  <div class="integration-header">
                    <div class="integration-icon aws">
                      <mat-icon>cloud</mat-icon>
                    </div>
                    <span class="connection-status">Not Connected</span>
                  </div>
                  <h4 class="integration-name">AWS</h4>
                  <p class="integration-desc">Discover cloud assets automatically</p>
                  <button class="integration-btn connect">Connect</button>
                </div>

                <div class="integration-card">
                  <div class="integration-header">
                    <div class="integration-icon pagerduty">
                      <mat-icon>notifications_active</mat-icon>
                    </div>
                    <span class="connection-status">Not Connected</span>
                  </div>
                  <h4 class="integration-name">PagerDuty</h4>
                  <p class="integration-desc">Trigger incidents for critical findings</p>
                  <button class="integration-btn connect">Connect</button>
                </div>

                <div class="integration-card">
                  <div class="integration-header">
                    <div class="integration-icon splunk">
                      <mat-icon>analytics</mat-icon>
                    </div>
                    <span class="connection-status">Not Connected</span>
                  </div>
                  <h4 class="integration-name">Splunk</h4>
                  <p class="integration-desc">Export vulnerability data for analysis</p>
                  <button class="integration-btn connect">Connect</button>
                </div>
              </div>
            </section>
          }

          <!-- Appearance Section -->
          @if (activeSection() === 'appearance') {
            <section class="settings-section">
              <h2 class="section-title">Appearance</h2>
              <p class="section-desc">Customize the look and feel</p>

              <div class="settings-card">
                <h3 class="card-title">Theme</h3>
                <div class="theme-options">
                  <button class="theme-btn active">
                    <mat-icon>light_mode</mat-icon>
                    Light
                  </button>
                  <button class="theme-btn">
                    <mat-icon>dark_mode</mat-icon>
                    Dark
                  </button>
                  <button class="theme-btn">
                    <mat-icon>settings_suggest</mat-icon>
                    System
                  </button>
                </div>
              </div>

              <div class="settings-card">
                <h3 class="card-title">Dashboard Layout</h3>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Compact Mode</span>
                    <span class="toggle-desc">Show more information in less space</span>
                  </div>
                  <button class="toggle-switch" (click)="toggleSetting($event)">
                    <span class="toggle-slider"></span>
                  </button>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Show Animations</span>
                    <span class="toggle-desc">Enable UI animations and transitions</span>
                  </div>
                  <button class="toggle-switch active" (click)="toggleSetting($event)">
                    <span class="toggle-slider"></span>
                  </button>
                </div>
              </div>
            </section>
          }

          <!-- Save Button -->
          <div class="save-bar">
            <button class="save-btn">
              <mat-icon>save</mat-icon>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .settings-container {
      padding: var(--spacing-lg);
      max-width: 1200px;
      margin: 0 auto;
      opacity: 0;
      animation: fadeIn 0.4s ease forwards;
    }

    .settings-container.loaded { opacity: 1; }

    @keyframes fadeIn { to { opacity: 1; } }

    /* Header */
    .page-header {
      margin-bottom: var(--spacing-xl);
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

    /* Layout */
    .settings-layout {
      display: grid;
      grid-template-columns: 14rem 1fr;
      gap: var(--spacing-xl);
    }

    /* Nav */
    .settings-nav {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .nav-item:hover {
      background-color: var(--color-bg-secondary);
    }

    .nav-item.active {
      background-color: var(--color-success);
      color: white;
    }

    .nav-item mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    /* Content */
    .settings-content {
      min-width: 0;
    }

    .settings-section {
      margin-bottom: var(--spacing-xl);
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 var(--spacing-xs);
    }

    .section-desc {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin: 0 0 var(--spacing-lg);
    }

    /* Cards */
    .settings-card {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-md);
    }

    .card-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 var(--spacing-sm);
    }

    .card-desc {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
      margin: 0 0 var(--spacing-md);
    }

    /* Profile */
    .profile-card {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--spacing-lg);
      display: flex;
      gap: var(--spacing-xl);
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 6rem;
      height: 6rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary));
      color: var(--color-text-muted);
    }

    .avatar mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    .change-avatar-btn {
      padding: var(--spacing-xs) var(--spacing-sm);
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      cursor: pointer;
    }

    .profile-form {
      flex: 1;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }

    .form-group {
      margin-bottom: var(--spacing-md);
    }

    .form-group label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-xs);
    }

    .form-group input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      color: var(--color-text-primary);
      background-color: var(--color-bg-primary);
    }

    .form-group input:disabled {
      background-color: var(--color-bg-secondary);
      color: var(--color-text-muted);
    }

    /* Toggle */
    .toggle-list {
      display: flex;
      flex-direction: column;
    }

    .toggle-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .toggle-item:last-child {
      border-bottom: none;
    }

    .toggle-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .toggle-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .toggle-desc {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .toggle-switch {
      position: relative;
      width: 2.75rem;
      height: 1.5rem;
      background-color: var(--color-bg-tertiary);
      border: none;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .toggle-switch.active {
      background-color: var(--color-success);
    }

    .toggle-slider {
      position: absolute;
      top: 0.125rem;
      left: 0.125rem;
      width: 1.25rem;
      height: 1.25rem;
      background-color: white;
      border-radius: var(--radius-full);
      transition: transform 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .toggle-switch.active .toggle-slider {
      transform: translateX(1.25rem);
    }

    /* Integration Status */
    .integration-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-md);
    }

    .status-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .slack-icon {
      color: #e01e5a;
    }

    .status-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
      display: block;
    }

    .status-desc {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .disconnect-btn {
      padding: var(--spacing-xs) var(--spacing-sm);
      background: transparent;
      border: 1px solid var(--color-critical);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      color: var(--color-critical);
      cursor: pointer;
    }

    /* Security */
    .security-status {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-md);
    }

    .security-status.enabled {
      background-color: #f0fdf4;
      color: var(--color-success);
    }

    .security-status mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .sessions-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .session-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-md);
    }

    .session-item.current {
      border: 1px solid var(--color-success);
    }

    .session-info {
      flex: 1;
    }

    .session-device {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
      display: block;
    }

    .session-location {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .revoke-btn {
      padding: var(--spacing-xs) var(--spacing-sm);
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      cursor: pointer;
    }

    /* Integrations Grid */
    .integrations-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-md);
    }

    .integration-card {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--spacing-md);
      transition: all 0.2s ease;
    }

    .integration-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .integration-card.connected {
      border-color: var(--color-success);
    }

    .integration-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-sm);
    }

    .integration-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--radius-md);
    }

    .integration-icon.jira { background: #0052cc; color: white; }
    .integration-icon.slack { background: #4a154b; color: white; }
    .integration-icon.github { background: #24292e; color: white; }
    .integration-icon.aws { background: #ff9900; color: white; }
    .integration-icon.pagerduty { background: #06ac38; color: white; }
    .integration-icon.splunk { background: #000000; color: #65a637; }

    .connection-status {
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--color-text-muted);
    }

    .connection-status.connected {
      color: var(--color-success);
    }

    .integration-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem;
    }

    .integration-desc {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin: 0 0 var(--spacing-md);
    }

    .integration-btn {
      width: 100%;
      padding: var(--spacing-sm);
      background-color: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.8125rem;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .integration-btn:hover {
      background-color: var(--color-bg-tertiary);
    }

    .integration-btn.connect {
      background-color: var(--color-info);
      border-color: var(--color-info);
      color: white;
    }

    .integration-btn.connect:hover {
      background-color: #2563eb;
    }

    /* Theme Options */
    .theme-options {
      display: flex;
      gap: var(--spacing-sm);
    }

    .theme-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--color-border);
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .theme-btn.active {
      background-color: var(--color-text-primary);
      color: white;
      border-color: var(--color-text-primary);
    }

    .theme-btn mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    /* Action Buttons */
    .action-btn {
      display: inline-flex;
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

    .action-btn.secondary {
      background-color: var(--color-bg-secondary);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
    }

    .action-btn.secondary:hover {
      background-color: var(--color-bg-tertiary);
    }

    /* Save Bar */
    .save-bar {
      position: sticky;
      bottom: var(--spacing-lg);
      display: flex;
      justify-content: flex-end;
      padding-top: var(--spacing-md);
    }

    .save-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-lg);
      background-color: var(--color-success);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .save-btn:hover {
      background-color: #059669;
      transform: translateY(-1px);
    }

    .save-btn mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .integrations-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: var(--spacing-md);
      }

      .settings-layout {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
      }

      .settings-nav {
        flex-direction: row;
        overflow-x: auto;
        padding-bottom: var(--spacing-sm);
      }

      .nav-item {
        white-space: nowrap;
      }

      .profile-card {
        flex-direction: column;
        align-items: center;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .integrations-grid {
        grid-template-columns: 1fr;
      }

      .theme-options {
        flex-wrap: wrap;
      }
    }
  `,
})
export class SettingsComponent implements OnInit {
  isLoaded = signal(false);
  activeSection = signal('profile');

  settingsSections = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'integrations', label: 'Integrations', icon: 'extension' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
  ];

  ngOnInit(): void {
    setTimeout(() => this.isLoaded.set(true), 100);
  }

  toggleSetting(event: Event): void {
    const button = event.currentTarget as HTMLButtonElement;
    button.classList.toggle('active');
  }
}
