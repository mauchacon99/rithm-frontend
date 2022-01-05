import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
        pathMatch: 'full',
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
