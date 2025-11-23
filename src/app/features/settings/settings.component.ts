import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UiToggleComponent, UiButtonComponent, UiCardComponent } from '../../shared/components';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatIconModule, UiToggleComponent, UiButtonComponent, UiCardComponent],
  template: `
    <div class="p-6 max-w-[1200px] mx-auto animate-fade-in" [class.loaded]="isLoaded()">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-slate-800 m-0">Settings</h1>
        <p class="text-sm text-slate-400 mt-1">Manage your preferences and configurations</p>
      </header>

      <div class="grid grid-cols-[14rem_1fr] max-md:grid-cols-1 gap-8 max-md:gap-4">
        <!-- Sidebar Nav -->
        <nav class="flex flex-col max-md:flex-row max-md:overflow-x-auto gap-1 max-md:pb-2">
          @for (section of settingsSections; track section.id) {
            <button
              class="nav-item flex items-center gap-2 py-2 px-4 border-none bg-transparent rounded-lg text-sm font-medium text-slate-500 cursor-pointer transition-all duration-200 text-left max-md:whitespace-nowrap hover:bg-slate-100"
              [class.active]="activeSection() === section.id"
              (click)="activeSection.set(section.id)"
            >
              <mat-icon class="icon-sm">{{ section.icon }}</mat-icon>
              {{ section.label }}
            </button>
          }
        </nav>

        <!-- Settings Content -->
        <div class="min-w-0">
          <!-- Profile Section -->
          @if (activeSection() === 'profile') {
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-slate-800 m-0 mb-1">Profile Settings</h2>
              <p class="text-sm text-slate-400 m-0 mb-6">Manage your account information</p>

              <div class="bg-white rounded-xl border border-slate-200 p-6 flex max-md:flex-col max-md:items-center gap-8">
                <div class="flex flex-col items-center gap-2">
                  <div class="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 text-slate-400">
                    <mat-icon class="icon-xl">person</mat-icon>
                  </div>
                  <button class="py-1 px-2 bg-transparent border border-slate-200 rounded-lg text-xs text-slate-500 cursor-pointer">Change Photo</button>
                </div>
                <div class="flex-1">
                  <div class="grid grid-cols-2 max-md:grid-cols-1 gap-4 mb-4">
                    <div>
                      <label class="block text-caption font-medium text-slate-500 mb-1">First Name</label>
                      <input type="text" value="Patel" class="w-full py-2 px-4 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white" />
                    </div>
                    <div>
                      <label class="block text-caption font-medium text-slate-500 mb-1">Last Name</label>
                      <input type="text" value="Tanaka" class="w-full py-2 px-4 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white" />
                    </div>
                  </div>
                  <div class="mb-4">
                    <label class="block text-caption font-medium text-slate-500 mb-1">Email Address</label>
                    <input type="email" value="pateltanaka22@gmail.com" class="w-full py-2 px-4 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white" />
                  </div>
                  <div>
                    <label class="block text-caption font-medium text-slate-500 mb-1">Role</label>
                    <input type="text" value="Security Analyst" disabled class="w-full py-2 px-4 border border-slate-200 rounded-lg text-sm text-slate-400 bg-slate-50" />
                  </div>
                </div>
              </div>
            </section>
          }

          <!-- Notifications Section -->
          @if (activeSection() === 'notifications') {
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-slate-800 m-0 mb-1">Notification Preferences</h2>
              <p class="text-sm text-slate-400 m-0 mb-6">Configure how you receive alerts and updates</p>

              <ui-card class="mb-4">
                <h3 class="text-body font-semibold text-slate-800 m-0 mb-2">Email Notifications</h3>
                <div class="flex flex-col">
                  @for (item of emailNotifications; track item.label) {
                    <div class="py-4 border-b border-slate-200 last:border-b-0">
                      <ui-toggle
                        [label]="item.label"
                        [description]="item.desc"
                        [checked]="item.enabled"
                        (checkedChange)="item.enabled = $event"
                      />
                    </div>
                  }
                </div>
              </ui-card>

              <ui-card>
                <h3 class="text-body font-semibold text-slate-800 m-0 mb-2">Slack Integration</h3>
                <div class="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                  <div class="flex items-center gap-2">
                    <mat-icon class="text-pink-600">tag</mat-icon>
                    <div>
                      <span class="text-sm font-medium text-slate-800 block">Connected to #security-alerts</span>
                      <span class="text-xs text-slate-400">Workspace: Company Security</span>
                    </div>
                  </div>
                  <button class="py-1 px-2 bg-transparent border border-red-500 rounded-lg text-xs text-red-500 cursor-pointer">Disconnect</button>
                </div>
              </ui-card>
            </section>
          }

          <!-- Security Section -->
          @if (activeSection() === 'security') {
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-slate-800 m-0 mb-1">Security Settings</h2>
              <p class="text-sm text-slate-400 m-0 mb-6">Manage your account security</p>

              <div class="bg-white rounded-xl border border-slate-200 p-6 mb-4">
                <h3 class="text-body font-semibold text-slate-800 m-0 mb-2">Password</h3>
                <p class="text-caption text-slate-400 m-0 mb-4">Last changed 30 days ago</p>
                <button class="inline-flex items-center gap-1 py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100">Change Password</button>
              </div>

              <div class="bg-white rounded-xl border border-slate-200 p-6 mb-4">
                <h3 class="text-body font-semibold text-slate-800 m-0 mb-2">Two-Factor Authentication</h3>
                <div class="flex items-center gap-2 p-4 bg-emerald-50 rounded-lg mb-4 text-emerald-500">
                  <mat-icon class="icon-md">verified_user</mat-icon>
                  <span>Enabled via Authenticator App</span>
                </div>
                <button class="inline-flex items-center gap-1 py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100">Manage 2FA</button>
              </div>

              <div class="bg-white rounded-xl border border-slate-200 p-6">
                <h3 class="text-body font-semibold text-slate-800 m-0 mb-2">Active Sessions</h3>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2 p-4 bg-slate-50 rounded-lg border border-emerald-500">
                    <mat-icon>computer</mat-icon>
                    <div class="flex-1">
                      <span class="text-sm font-medium text-slate-800 block">Windows · Chrome</span>
                      <span class="text-xs text-slate-400">New York, US · Current session</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 p-4 bg-slate-50 rounded-lg">
                    <mat-icon>phone_iphone</mat-icon>
                    <div class="flex-1">
                      <span class="text-sm font-medium text-slate-800 block">iPhone · Safari</span>
                      <span class="text-xs text-slate-400">New York, US · 2 hours ago</span>
                    </div>
                    <button class="py-1 px-2 bg-transparent border border-slate-200 rounded-lg text-xs text-slate-500 cursor-pointer">Revoke</button>
                  </div>
                </div>
              </div>
            </section>
          }

          <!-- Integrations Section -->
          @if (activeSection() === 'integrations') {
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-slate-800 m-0 mb-1">Integrations</h2>
              <p class="text-sm text-slate-400 m-0 mb-6">Connect with external tools and services</p>

              <div class="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
                @for (integration of integrations; track integration.name) {
                  <div class="bg-white rounded-xl border p-4 transition-all duration-200 hover:shadow-md" [class.border-emerald-500]="integration.connected" [class.border-slate-200]="!integration.connected">
                    <div class="flex justify-between items-start mb-2">
                      <div class="flex items-center justify-center w-10 h-10 rounded-lg text-white" [class]="integration.bgClass">
                        <mat-icon>{{ integration.icon }}</mat-icon>
                      </div>
                      <span class="text-xs font-medium" [class.text-emerald-500]="integration.connected" [class.text-slate-400]="!integration.connected">
                        {{ integration.connected ? 'Connected' : 'Not Connected' }}
                      </span>
                    </div>
                    <h4 class="text-body font-semibold text-slate-800 m-0 mb-1">{{ integration.name }}</h4>
                    <p class="text-xs text-slate-400 m-0 mb-4">{{ integration.desc }}</p>
                    <button class="w-full py-2 rounded-lg text-caption cursor-pointer transition-all duration-200"
                      [class]="integration.connected ? 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100' : 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600'">
                      {{ integration.connected ? 'Configure' : 'Connect' }}
                    </button>
                  </div>
                }
              </div>
            </section>
          }

          <!-- Appearance Section -->
          @if (activeSection() === 'appearance') {
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-slate-800 m-0 mb-1">Appearance</h2>
              <p class="text-sm text-slate-400 m-0 mb-6">Customize the look and feel</p>

              <div class="bg-white rounded-xl border border-slate-200 p-6 mb-4">
                <h3 class="text-body font-semibold text-slate-800 m-0 mb-4">Theme</h3>
                <div class="flex flex-wrap gap-2">
                  @for (theme of themes; track theme.id) {
                    <button class="flex items-center gap-1 py-2 px-4 border rounded-lg text-sm cursor-pointer transition-all duration-200"
                      [class]="activeTheme() === theme.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'"
                      (click)="activeTheme.set(theme.id)">
                      <mat-icon class="icon-sm">{{ theme.icon }}</mat-icon>
                      {{ theme.label }}
                    </button>
                  }
                </div>
              </div>

              <div class="bg-white rounded-xl border border-slate-200 p-6">
                <h3 class="text-body font-semibold text-slate-800 m-0 mb-4">Dashboard Layout</h3>
                @for (item of layoutSettings; track item.label) {
                  <div class="py-4 border-b border-slate-200 last:border-b-0">
                    <ui-toggle
                      [label]="item.label"
                      [description]="item.desc"
                      [checked]="item.enabled"
                      (checkedChange)="item.enabled = $event"
                    />
                  </div>
                }
              </div>
            </section>
          }

          <!-- Save Button -->
          <div class="sticky bottom-6 flex justify-end pt-4">
            <ui-button variant="primary" iconLeft="save">
              Save Changes
            </ui-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    @reference "tailwindcss";

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.4s ease forwards; }

    .nav-item.active { @apply bg-emerald-500 text-white; }
  `,
})
export class SettingsComponent implements OnInit {
  isLoaded = signal(false);
  activeSection = signal('profile');
  activeTheme = signal('light');

  settingsSections = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'integrations', label: 'Integrations', icon: 'extension' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
  ];

  emailNotifications = [
    { label: 'Critical Vulnerabilities', desc: 'Get notified when critical vulnerabilities are discovered', enabled: true },
    { label: 'Weekly Summary', desc: 'Receive weekly security summary reports', enabled: true },
    { label: 'Asset Changes', desc: 'Notify when new assets are discovered', enabled: false },
    { label: 'Scan Completion', desc: 'Alert when vulnerability scans complete', enabled: true },
  ];

  integrations = [
    { name: 'Jira', icon: 'view_kanban', desc: 'Create tickets for vulnerabilities automatically', connected: true, bgClass: 'bg-blue-600' },
    { name: 'Slack', icon: 'tag', desc: 'Send alerts to Slack channels', connected: true, bgClass: 'bg-purple-800' },
    { name: 'GitHub', icon: 'code', desc: 'Scan repositories for vulnerabilities', connected: false, bgClass: 'bg-slate-800' },
    { name: 'AWS', icon: 'cloud', desc: 'Discover cloud assets automatically', connected: false, bgClass: 'bg-orange-500' },
    { name: 'PagerDuty', icon: 'notifications_active', desc: 'Trigger incidents for critical findings', connected: false, bgClass: 'bg-green-600' },
    { name: 'Splunk', icon: 'analytics', desc: 'Export vulnerability data for analysis', connected: false, bgClass: 'bg-black' },
  ];

  themes = [
    { id: 'light', label: 'Light', icon: 'light_mode' },
    { id: 'dark', label: 'Dark', icon: 'dark_mode' },
    { id: 'system', label: 'System', icon: 'settings_suggest' },
  ];

  layoutSettings = [
    { label: 'Compact Mode', desc: 'Show more information in less space', enabled: false },
    { label: 'Show Animations', desc: 'Enable UI animations and transitions', enabled: true },
  ];

  ngOnInit(): void {
    setTimeout(() => this.isLoaded.set(true), 100);
  }
}
