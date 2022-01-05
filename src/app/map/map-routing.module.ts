import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MapComponent,
        pathMatch: 'full',
      },
    ]),
  ],
  exports: [RouterModule],
})
export class MapRoutingModule {}
