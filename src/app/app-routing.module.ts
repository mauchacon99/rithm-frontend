import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './core/auth-guard.service';

const routes: Routes = [];

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
      canActivate: [AuthGuardService]
    },
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      canActivate: [AuthGuardService]
    }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
