import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map/map.component';
import { MapSearchComponent } from './map-search/map-search.component';
import { MapToolbarComponent } from './map-toolbar/map-toolbar.component';
import { MapCanvasComponent } from './map-canvas/map-canvas.component';
import { MapOverlayComponent } from './map-overlay/map-overlay.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ConnectionInfoDrawerComponent } from './connection-info-drawer/connection-info-drawer.component';
import { StationGroupInfoDrawerComponent } from './station-group-info-drawer/station-group-info-drawer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecognitionModule } from './recognition/recognition.module';
import { LoadingIndicatorModule } from '../shared/loading-indicator/loading-indicator.module';
import { InfoDrawerModule } from '../shared/info-drawer/info-drawer.module';

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
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    RecognitionModule,
    LoadingIndicatorModule,
    InfoDrawerModule,
  ],
})
export class MapModule {}
