import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { InfoDrawerComponent } from './info-drawer/info-drawer.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: InfoDrawerComponent,
      pathMatch: 'full'
    }
  ])],
  exports: [RouterModule]
})
export class InfoDrawerRoutingModule { }
