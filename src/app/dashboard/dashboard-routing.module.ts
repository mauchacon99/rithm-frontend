import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full',
      },
      {
        path: ':dashboardId/:typeDashboard',
        component: DashboardComponent,
        pathMatch: 'prefix',
      },
    ]),
  ],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
