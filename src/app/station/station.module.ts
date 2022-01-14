import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationRoutingModule } from './station-routing.module';
import { StationComponent } from './station/station.component';
import { FlowLogicComponent } from './flow-logic/flow-logic.component';
import { PowersComponent } from './powers/powers.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClickOutsideModule } from 'ng-click-outside';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StationFieldComponent } from './station-field/station-field.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { StationTemplateComponent } from './station-template/station-template.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { RuleModalComponent } from './rule-modal/rule-modal.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '../shared/fields/text-field/text-field.module';
import { LoadingIndicatorModule } from '../shared/loading-indicator/loading-indicator.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SubHeaderModule } from '../shared/sub-header/sub-header.module';
import { DetailDrawerModule } from '../shared/detail-drawer/detail-drawer.module';
import { ConnectedStationPaneModule } from '../shared/connected-station-pane/connected-station-pane.module';
import { StationInfoHeaderModule } from '../shared/station-info-header/station-info-header.module';
import { DocumentInfoHeaderModule } from '../shared/document-info-header/document-info-header.module';
import { PreviousFieldsModule } from '../shared/previous-fields/previous-fields.module';
import { InfoDrawerModule } from '../shared/info-drawer/info-drawer.module';

@NgModule({
  declarations: [
    StationComponent,
    FlowLogicComponent,
    PowersComponent,
    ToolbarComponent,
    StationFieldComponent,
    StationTemplateComponent,
    RuleModalComponent,
  ],
  imports: [
    CommonModule,
    StationRoutingModule,
    MatButtonModule,
    MatSidenavModule,
    MatTabsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule,
    TextFieldModule,
    LoadingIndicatorModule,
    MatCheckboxModule,
    SubHeaderModule,
    DetailDrawerModule,
    ConnectedStationPaneModule,
    StationInfoHeaderModule,
    DocumentInfoHeaderModule,
    PreviousFieldsModule,
    InfoDrawerModule,
  ],
})
export class StationModule {}
