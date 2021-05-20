import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map/map.component';
import { MapSearchComponent } from './map-search/map-search.component';
import { MapToolbarComponent } from './map-toolbar/map-toolbar.component';



@NgModule({
  declarations: [
    MapComponent,
    MapSearchComponent,
    MapToolbarComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule
  ]
})
export class MapModule { }
