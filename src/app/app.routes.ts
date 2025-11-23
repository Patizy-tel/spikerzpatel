import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'vulnerabilities',
        loadComponent: () =>
          import('./features/vulnerabilities/vulnerabilities-list.component').then(
            (m) => m.VulnerabilitiesListComponent
          ),
      },
      {
        path: 'assets',
        loadComponent: () =>
          import('./features/assets/assets-list.component').then(
            (m) => m.AssetsListComponent
          ),
      },
      {
        path: 'cve/:cveId',
        loadComponent: () =>
          import('./features/vulnerability/vulnerability-detail/vulnerability-detail.component').then(
            (m) => m.VulnerabilityDetailComponent
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'remediation',
        loadComponent: () =>
          import('./features/vulnerability/remediation-cards/remediation-cards.component').then(
            (m) => m.RemediationCardsComponent
          ),
      },
    ],
  },
];
