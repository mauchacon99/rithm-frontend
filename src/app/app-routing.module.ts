import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from './core/admin-auth.guard';
import { AuthGuard } from './core/auth.guard';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./entry/entry.module').then((m) => m.EntryModule),
      },
      {
        path: 'map',
        loadChildren: () => import('./map/map.module').then((m) => m.MapModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AdminAuthGuard],
      },
      {
        path: 'station',
        pathMatch: 'full',
        redirectTo: '/dashboard',
      },
      {
        path: 'station',
        loadChildren: () =>
          import('./station/station.module').then((m) => m.StationModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'document',
        loadChildren: () =>
          import('./document/document.module').then((m) => m.DocumentModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
        canActivate: [AuthGuard],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
