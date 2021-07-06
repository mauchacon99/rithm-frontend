import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { StationInfoHeaderComponent } from './station-info-header/station-info-header.component';
import { DocumentInfoHeaderComponent } from './document-info-header/document-info-header.component';
import { ConnectedStationPaneComponent } from './connected-station-pane/connected-station-pane.component';
import { HistoryComponent } from './history/history.component';
import { CommentComponent } from './comment/comment.component';
import { DocumentTemplateComponent } from './document-template/document-template.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';



@NgModule({
  declarations: [
    StationInfoHeaderComponent,
    DocumentInfoHeaderComponent,
    ConnectedStationPaneComponent,
    HistoryComponent,
    CommentComponent,
    DocumentTemplateComponent,
    SubHeaderComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [
    SubHeaderComponent,
    DocumentTemplateComponent,
    ConnectedStationPaneComponent,
    StationInfoHeaderComponent,
    DocumentInfoHeaderComponent
  ]
})
export class DetailModule { }
