import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GridsterModule } from 'angular-gridster2';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { NgChartsModule } from 'ng2-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StationWidgetComponent } from './widgets/station-widget/station-widget.component';
import { HeaderMenuComponent } from './dashboard-menu/header-menu/header-menu.component';
import { OptionsMenuComponent } from './dashboard-menu/options-menu/options-menu.component';
import { ExpansionMenuComponent } from './dashboard-menu/expansion-menu/expansion-menu.component';
import { MenuComponent } from './dashboard-menu/menu/menu.component';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { RosterModule } from 'src/app/shared/roster/roster.module';
import { StationDocumentsModalModule } from 'src/app/shared/station-documents-modal/station-documents-modal.module';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';
import { DocumentModule } from 'src/app/document/document.module';
import { DocumentWidgetComponent } from './widgets/document-widget/document-widget.component';
import { StationWidgetDrawerComponent } from './drawer-widget/station-widget-drawer/station-widget-drawer.component';
import { WidgetDrawerComponent } from './drawer-widget/widget-drawer/widget-drawer.component';
import { AddWidgetModalComponent } from './widget-modal/add-widget-modal/add-widget-modal.component';
import { DocumentWidgetDrawerComponent } from './drawer-widget/document-widget-drawer/document-widget-drawer.component';
import { CustomTabWidgetModalComponent } from './widget-modal/custom-tab-widget-modal/custom-tab-widget-modal.component';
import { ItemListWidgetModalComponent } from './widget-modal/item-list-widget-modal/item-list-widget-modal.component';
import { BannerImageWidgetComponent } from './widgets/banner-image-widget/banner-image-widget.component';
import { ListWidgetModalComponent } from './widget-modal/list-widget-modal/list-widget-modal.component';
import { StationWidgetTemplateModalComponent } from './widget-modal/station-widget-template-modal/station-widget-template-modal.component';
import { DocumentWidgetTemplateModalComponent } from './widget-modal/document-widget-template-modal/document-widget-template-modal.component';
import { DescriptionWidgetModalComponent } from './widget-modal/description-widget-modal/description-widget-modal.component';
import { GroupWidgetTemplateModalComponent } from './widget-modal/group-widget-template-modal/group-widget-template-modal.component';
import { GroupSearchWidgetComponent } from './widgets/group-search-widget/group-search-widget.component';
import { AvatarImageWidgetComponent } from './widgets/avatar-image-widget/avatar-image-widget.component';
import { ComingSoonMessageModule } from 'src/app/shared/coming-soon-message/coming-soon-message.module';
import { MobileBrowserChecker } from 'src/helpers/mobile-browser-checker';
import { GroupTrafficWidgetComponent } from './widgets/group-traffic-widget/group-traffic-widget.component';
import { StationPreBuiltWidgetComponent } from './widgets/station-pre-built-widget/station-pre-built-widget.component';
import { PreBuiltWidgetTemplateModalComponent } from './widget-modal/pre-built-widget-template-modal/pre-built-widget-template-modal.component';
import { ContainerPreBuiltWidgetComponent } from './widgets/container-pre-built-widget/container-pre-built-widget.component';
import { ManagementMemberDashboardModalComponent } from './management-member-dashboard-modal/management-member-dashboard-modal/management-member-dashboard-modal.component';
import { MemberDashboardListModalComponent } from './management-member-dashboard-modal/member-dashboard-list-modal/member-dashboard-list-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { LoadingWidgetModule } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.module';
import { ErrorWidgetModule } from 'src/app/shared/widget-dashboard/error-widget/error-widget.module';

@NgModule({
  declarations: [
    DashboardComponent,
    StationWidgetComponent,
    HeaderMenuComponent,
    OptionsMenuComponent,
    ExpansionMenuComponent,
    MenuComponent,
    DocumentWidgetComponent,
    StationWidgetDrawerComponent,
    WidgetDrawerComponent,
    DocumentWidgetDrawerComponent,
    AddWidgetModalComponent,
    CustomTabWidgetModalComponent,
    ItemListWidgetModalComponent,
    BannerImageWidgetComponent,
    ListWidgetModalComponent,
    StationWidgetTemplateModalComponent,
    DocumentWidgetTemplateModalComponent,
    DescriptionWidgetModalComponent,
    GroupWidgetTemplateModalComponent,
    GroupSearchWidgetComponent,
    AvatarImageWidgetComponent,
    GroupTrafficWidgetComponent,
    StationPreBuiltWidgetComponent,
    PreBuiltWidgetTemplateModalComponent,
    ContainerPreBuiltWidgetComponent,
    ManagementMemberDashboardModalComponent,
    MemberDashboardListModalComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ComingSoonMessageModule,
    ReactiveFormsModule,
    GridsterModule,
    LoadingIndicatorModule,
    RosterModule,
    StationDocumentsModalModule,
    UserAvatarModule,
    DocumentModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatRippleModule,
    MatTableModule,
    MatTabsModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatButtonToggleModule,
    MatSortModule,
    ComingSoonMessageModule,
    NgChartsModule,
    MatCheckboxModule,
    MatChipsModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
  ],
  providers: [MobileBrowserChecker],
})
export class DashboardModule {}
