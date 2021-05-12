import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

@NgModule({
  imports: [RouterModule.forRoot([
    {
      path: '',
      pathMatch: 'full',
      loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule),
    },
    {
      path: 'map',
      loadChildren: () => import('./map/map.module').then(m => m.MapModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      canActivate: [AuthGuard]
    }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
