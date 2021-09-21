import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map/map.component';
import { MapSearchComponent } from './map-search/map-search.component';
import { MapToolbarComponent } from './map-toolbar/map-toolbar.component';
import { MapCanvasComponent } from './map-canvas/map-canvas.component';
import { MapOverlayComponent } from './map-overlay/map-overlay.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    MapComponent,
    MapSearchComponent,
    MapToolbarComponent,
    MapCanvasComponent,
    MapOverlayComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class MapModule { }
