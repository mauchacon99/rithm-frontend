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
import { StationCardComponent } from './station-card/station-card.component';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentDrawerComponent } from './comment-drawer/comment-drawer.component';



@NgModule({
  declarations: [
    StationInfoHeaderComponent,
    DocumentInfoHeaderComponent,
    ConnectedStationPaneComponent,
    CommentComponent,
    DocumentTemplateComponent,
    SubHeaderComponent,
    StationCardComponent,
    HistoryDrawerComponent,
    CommentDrawerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    SharedModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [
    SubHeaderComponent,
    DocumentTemplateComponent,
    ConnectedStationPaneComponent,
    StationInfoHeaderComponent,
    DocumentInfoHeaderComponent,
    CommentDrawerComponent
  ]
})
export class DetailModule { }
