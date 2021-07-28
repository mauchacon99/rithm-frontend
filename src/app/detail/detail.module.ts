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
import { CommentInputComponent } from './comment-input/comment-input.component';
import { DocumentFieldComponent } from './document-field/document-field.component';
import { TextFieldComponent } from './text-field/text-field.component';
import { NumberFieldComponent } from './number-field/number-field.component';
import { DateFieldComponent } from './date-field/date-field.component';
import { AddressFieldComponent } from './address-field/address-field.component';
import { SelectFieldComponent } from './select-field/select-field.component';
import { CheckFieldComponent } from './check-field/check-field.component';



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
    DetailDrawerComponent,
    CommentInputComponent,
    DocumentFieldComponent,
    TextFieldComponent,
    NumberFieldComponent,
    DateFieldComponent,
    AddressFieldComponent,
    SelectFieldComponent,
    CheckFieldComponent
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
