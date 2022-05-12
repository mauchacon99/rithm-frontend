import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ReactiveFormsModule } from '@angular/forms';

import { DocumentFieldComponent } from './document-field/document-field.component';
import { DocumentRoutingModule } from './document-routing.module';
import { DocumentTemplateComponent } from './document-template/document-template.component';
import { ConnectedStationsModalComponent } from './connected-stations-modal/connected-stations-modal.component';
import { TextFieldModule } from 'src/app/shared/fields/text-field/text-field.module';
import { SelectFieldModule } from 'src/app/shared/fields/select-field/select-field.module';
import { CheckFieldModule } from 'src/app/shared/fields/check-field/check-field.module';
import { DateFieldModule } from 'src/app/shared/fields/date-field/date-field.module';
import { NumberFieldModule } from 'src/app/shared/fields/number-field/number-field.module';
import { NestedFieldModule } from 'src/app/shared/fields/nested-field/nested-field.module';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { SubHeaderModule } from 'src/app/shared/sub-header/sub-header.module';
import { DetailDrawerModule } from 'src/app/shared/detail-drawer/detail-drawer.module';
import { ConnectedStationPaneModule } from 'src/app/shared/connected-station-pane/connected-station-pane.module';
import { StationInfoHeaderModule } from 'src/app/shared/station-info-header/station-info-header.module';
import { DocumentInfoHeaderModule } from 'src/app/shared/document-info-header/document-info-header.module';
import { PreviousFieldsModule } from 'src/app/shared/previous-fields/previous-fields.module';
import { InfoDrawerModule } from 'src/app/shared/info-drawer/info-drawer.module';
import { DocumentComponent } from './document/document.component';
import { FileFieldModule } from 'src/app/shared/fields/file-field/file-field.module';
import { GridsterModule } from 'angular-gridster2';
import { BodyTextWidgetModule } from 'src/app/shared/station-document-widgets/body-text-widget/body-text-widget.module';
import { HeadlineWidgetModule } from 'src/app/shared/station-document-widgets/headline-widget/headline-widget.module';
import { TitleWidgetModule } from 'src/app/shared/station-document-widgets/title-widget/title-widget.module';
import { BannerWidgetModule } from 'src/app/shared/station-document-widgets/banner-widget/banner-widget.module';
import { CircleImageWidgetModule } from 'src/app/shared/station-document-widgets/circle-image-widget/circle-image-widget.module';
import { InputFrameWidgetModule } from 'src/app/shared/station-document-widgets/input-frame-widget/input-frame-widget.module';
import { LocationModalComponent } from './folder/location-modal/location-modal.component';
import { UserListModalComponent } from './user-list-modal/user-list-modal.component';
import { MatRadioModule } from '@angular/material/radio';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

@NgModule({
  declarations: [
    DocumentComponent,
    DocumentFieldComponent,
    DocumentTemplateComponent,
    ConnectedStationsModalComponent,
    LocationModalComponent,
    UserListModalComponent,
  ],
  imports: [
    CommonModule,
    DocumentRoutingModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule,
    TextFieldModule,
    SelectFieldModule,
    CheckFieldModule,
    DateFieldModule,
    NumberFieldModule,
    NestedFieldModule,
    LoadingIndicatorModule,
    SubHeaderModule,
    DetailDrawerModule,
    ConnectedStationPaneModule,
    StationInfoHeaderModule,
    DocumentInfoHeaderModule,
    PreviousFieldsModule,
    InfoDrawerModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    FileFieldModule,
    GridsterModule,
    BodyTextWidgetModule,
    HeadlineWidgetModule,
    TitleWidgetModule,
    BannerWidgetModule,
    CircleImageWidgetModule,
    InputFrameWidgetModule,
    MatRadioModule,
    UserAvatarModule,
  ],
  exports: [DocumentComponent],
})
export class DocumentModule {}
