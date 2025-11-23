import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'vulnerability',
    pathMatch: 'full',
  },
  {
    path: 'vulnerability',
    loadComponent: () =>
      import('./features/vulnerability/vulnerability-detail/vulnerability-detail.component').then(
        (m) => m.VulnerabilityDetailComponent
      ),
  },
  {
    path: 'remediation',
    loadComponent: () =>
      import('./features/vulnerability/remediation-cards/remediation-cards.component').then(
        (m) => m.RemediationCardsComponent
      ),
  },
];
