import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'add-sleepiness',
    loadComponent: () => import('./add-sleepiness/add-sleepiness.page').then( m => m.AddSleepinessPage)
  },
  {
    path: 'add-overnight',
    loadComponent: () => import('./add-overnight/add-overnight.page').then( m => m.AddOvernightPage)
  },
];
