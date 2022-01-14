import { NgModule } from '@angular/core';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { StationInfoHeaderComponent } from './station-info-header/station-info-header.component';
import { DocumentInfoHeaderComponent } from './document-info-header/document-info-header.component';
import { ConnectedStationPaneComponent } from './connected-station-pane/connected-station-pane.component';
import { HistoryDrawerComponent } from './history-drawer/history-drawer.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { ConnectedStationCardComponent } from './connected-station-card/connected-station-card.component';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailDrawerComponent } from './detail-drawer/detail-drawer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { PreviousFieldsComponent } from './previous-fields/previous-fields.component';
import { MatChipsModule } from '@angular/material/chips';
import { CommentDrawerModule } from '../comment/comment-drawer/comment-drawer.module';
import { LoadingIndicatorModule } from '../shared/loading-indicator/loading-indicator.module';

//This is required by ngx-mask. See here for details: https://www.npmjs.com/package/ngx-mask
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    StationInfoHeaderComponent,
    DocumentInfoHeaderComponent,
    ConnectedStationPaneComponent,
    SubHeaderComponent,
    ConnectedStationCardComponent,
    HistoryDrawerComponent,
    DetailDrawerComponent,
    PreviousFieldsComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    SharedModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskModule.forRoot(),
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    CommentDrawerModule,
    LoadingIndicatorModule
  ],
  exports: [
    SubHeaderComponent,
    ConnectedStationPaneComponent,
    StationInfoHeaderComponent,
    DocumentInfoHeaderComponent,
    DetailDrawerComponent,
    PreviousFieldsComponent,
  ],
})
export class DetailModule {}
