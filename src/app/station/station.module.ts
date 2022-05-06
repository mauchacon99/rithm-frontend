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
import { TextFieldModule } from 'src/app/shared/fields/text-field/text-field.module';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SubHeaderModule } from 'src/app/shared/sub-header/sub-header.module';
import { DetailDrawerModule } from 'src/app/shared/detail-drawer/detail-drawer.module';
import { ConnectedStationPaneModule } from 'src/app/shared/connected-station-pane/connected-station-pane.module';
import { StationInfoHeaderModule } from 'src/app/shared/station-info-header/station-info-header.module';
import { DocumentInfoHeaderModule } from 'src/app/shared/document-info-header/document-info-header.module';
import { PreviousFieldsModule } from 'src/app/shared/previous-fields/previous-fields.module';
import { InfoDrawerModule } from 'src/app/shared/info-drawer/info-drawer.module';
import { NumberFieldModule } from 'src/app/shared/fields/number-field/number-field.module';
import { DateFieldModule } from 'src/app/shared/fields/date-field/date-field.module';
import { FileFieldModule } from 'src/app/shared/fields/file-field/file-field.module';
import { SelectFieldModule } from 'src/app/shared/fields/select-field/select-field.module';
import { DataLinkFieldModule } from 'src/app/shared/fields/data-link-field/data-link-field.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GridsterModule } from 'angular-gridster2';
import { MatDividerModule } from '@angular/material/divider';
import { InputFrameWidgetModule } from 'src/app/shared/station-document-widgets/input-frame-widget/input-frame-widget.module';
import { MatListModule } from '@angular/material/list';
import { BuildDrawerComponent } from './build-drawer/build-drawer.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BodyTextWidgetModule } from 'src/app/shared/station-document-widgets/body-text-widget/body-text-widget.module';
import { HeadlineWidgetModule } from 'src/app/shared/station-document-widgets/headline-widget/headline-widget.module';
import { TitleWidgetModule } from 'src/app/shared/station-document-widgets/title-widget/title-widget.module';
import { BannerWidgetModule } from 'src/app/shared/station-document-widgets/banner-widget/banner-widget.module';
import { CircleImageWidgetModule } from 'src/app/shared/station-document-widgets/circle-image-widget/circle-image-widget.module';
import { DataLinkModalComponent } from 'src/app/shared/data-link-modal/data-link-modal.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ComingSoonMessageModule } from 'src/app/shared/coming-soon-message/coming-soon-message.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ConditionsComponent } from './flow-logic/conditions/conditions.component';
@NgModule({
  declarations: [
    StationComponent,
    FlowLogicComponent,
    PowersComponent,
    ToolbarComponent,
    StationFieldComponent,
    StationTemplateComponent,
    RuleModalComponent,
    BuildDrawerComponent,
    DataLinkModalComponent,
    ConditionsComponent,
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
    NumberFieldModule,
    DateFieldModule,
    FileFieldModule,
    SelectFieldModule,
    DataLinkFieldModule,
    MatTooltipModule,
    GridsterModule,
    MatDividerModule,
    InputFrameWidgetModule,
    BodyTextWidgetModule,
    MatListModule,
    DragDropModule,
    HeadlineWidgetModule,
    TitleWidgetModule,
    BannerWidgetModule,
    CircleImageWidgetModule,
    MatSlideToggleModule,
    ComingSoonMessageModule,
    MatButtonToggleModule,
  ],
})
export class StationModule {}
