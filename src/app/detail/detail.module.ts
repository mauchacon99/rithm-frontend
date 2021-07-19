import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { StationInfoHeaderComponent } from './station-info-header/station-info-header.component';
import { DocumentInfoHeaderComponent } from './document-info-header/document-info-header.component';
import { ConnectedStationPaneComponent } from './connected-station-pane/connected-station-pane.component';
import { HistoryDrawerComponent } from './history-drawer/history-drawer.component';
import { CommentComponent } from './comment/comment.component';
import { DocumentTemplateComponent } from './document-template/document-template.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { ConnectedStationCardComponent } from './connected-station-card/connected-station-card.component';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentDrawerComponent } from './comment-drawer/comment-drawer.component';
import { DetailDrawerComponent } from './detail-drawer/detail-drawer.component';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [
    StationInfoHeaderComponent,
    DocumentInfoHeaderComponent,
    ConnectedStationPaneComponent,
    CommentComponent,
    DocumentTemplateComponent,
    SubHeaderComponent,
    ConnectedStationCardComponent,
    HistoryDrawerComponent,
    CommentDrawerComponent,
    DetailDrawerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    SharedModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule
  ],
  exports: [
    SubHeaderComponent,
    DocumentTemplateComponent,
    ConnectedStationPaneComponent,
    StationInfoHeaderComponent,
    DocumentInfoHeaderComponent,
    CommentDrawerComponent,
    DetailDrawerComponent
  ]
})
export class DetailModule { }
