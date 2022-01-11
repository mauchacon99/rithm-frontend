import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map/map.component';
import { MapSearchComponent } from './map-search/map-search.component';
import { MapToolbarComponent } from './map-toolbar/map-toolbar.component';
import { MapCanvasComponent } from './map-canvas/map-canvas.component';
import { MapOverlayComponent } from './map-overlay/map-overlay.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ConnectionInfoDrawerComponent } from './connection-info-drawer/connection-info-drawer.component';
import { StationGroupInfoDrawerComponent } from './station-group-info-drawer/station-group-info-drawer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InfoDrawerModule } from '../info-drawer/info-drawer.module';

@NgModule({
  declarations: [
    MapComponent,
    MapSearchComponent,
    MapToolbarComponent,
    MapCanvasComponent,
    MapOverlayComponent,
    ConnectionInfoDrawerComponent,
    StationGroupInfoDrawerComponent,
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    InfoDrawerModule,
  ],
})
export class MapModule {}
