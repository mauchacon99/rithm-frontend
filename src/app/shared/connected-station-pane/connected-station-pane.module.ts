import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectedStationPaneComponent } from './connected-station-pane.component';
import { ConnectedStationCardModule } from '../connected-station-card/connected-station.module';

@NgModule({
  declarations: [ConnectedStationPaneComponent],
  imports: [CommonModule, ConnectedStationCardModule],
  exports: [ConnectedStationPaneComponent],
})
export class ConnectedStationPaneModule {}
