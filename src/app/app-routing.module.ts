import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
      // TODO: add canActivate
    },
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      // TODO: add canActivate
    }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
