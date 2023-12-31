import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GridsterModule } from 'angular-gridster2';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { NgChartsModule } from 'ng2-charts';

import { DashboardRoutingModule } from 'src/app/dashboard/dashboard-routing.module';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { HeaderMenuComponent } from 'src/app/dashboard/dashboard-menu/header-menu/header-menu.component';
import { OptionsMenuComponent } from 'src/app/dashboard/dashboard-menu/options-menu/options-menu.component';
import { ExpansionMenuComponent } from 'src/app/dashboard/dashboard-menu/expansion-menu/expansion-menu.component';
import { MenuComponent } from 'src/app/dashboard/dashboard-menu/menu/menu.component';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { StationDocumentsModalModule } from 'src/app/shared/station-documents-modal/station-documents-modal.module';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';
import { StationWidgetDrawerComponent } from 'src/app/dashboard/drawer-widget/station-widget-drawer/station-widget-drawer.component';
import { WidgetDrawerComponent } from 'src/app/dashboard/drawer-widget/widget-drawer/widget-drawer.component';
import { AddWidgetModalComponent } from 'src/app/dashboard/widget-modal/add-widget-modal/add-widget-modal.component';
import { DocumentWidgetDrawerComponent } from 'src/app/dashboard/drawer-widget/document-widget-drawer/document-widget-drawer.component';
import { CustomTabWidgetModalComponent } from 'src/app/dashboard/widget-modal/custom-tab-widget-modal/custom-tab-widget-modal.component';
import { ItemListWidgetModalComponent } from 'src/app/dashboard/widget-modal/item-list-widget-modal/item-list-widget-modal.component';
import { ListWidgetModalComponent } from 'src/app/dashboard/widget-modal/list-widget-modal/list-widget-modal.component';
import { StationWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/station-widget-template-modal/station-widget-template-modal.component';
import { DocumentWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/document-widget-template-modal/document-widget-template-modal.component';
import { DescriptionWidgetModalComponent } from 'src/app/dashboard/widget-modal/description-widget-modal/description-widget-modal.component';
import { GroupWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/group-widget-template-modal/group-widget-template-modal.component';
import { ComingSoonMessageModule } from 'src/app/shared/coming-soon-message/coming-soon-message.module';
import { MobileBrowserChecker } from 'src/helpers/mobile-browser-checker';
import { PreBuiltWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/pre-built-widget-template-modal/pre-built-widget-template-modal.component';
import { ManagementMemberDashboardModalComponent } from 'src/app/dashboard/management-member-dashboard-modal/management-member-dashboard-modal/management-member-dashboard-modal.component';
import { MemberDashboardListModalComponent } from 'src/app/dashboard/management-member-dashboard-modal/member-dashboard-list-modal/member-dashboard-list-modal.component';
import { LoadingWidgetModule } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.module';
import { ErrorWidgetModule } from 'src/app/shared/widget-dashboard/error-widget/error-widget.module';
import { StationWidgetModule } from 'src/app/shared/widget-dashboard/station-widget/station-widget.module';
import { DocumentWidgetModule } from 'src/app/shared/widget-dashboard/document-widget/document-widget.module';
import { GroupTrafficWidgetModule } from 'src/app/shared/widget-dashboard/group-traffic-widget/group-traffic-widget.module';
import { GroupSearchWidgetModule } from 'src/app/shared/widget-dashboard/group-search-widget/group-search-widget.module';
import { ContainerPreBuiltWidgetModule } from 'src/app/shared/widget-dashboard/container-pre-built-widget/container-pre-built-widget.module';
import { StationPreBuiltWidgetModule } from 'src/app/shared/widget-dashboard/station-pre-built-widget/station-pre-built-widget.module';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderMenuComponent,
    OptionsMenuComponent,
    ExpansionMenuComponent,
    MenuComponent,
    StationWidgetDrawerComponent,
    WidgetDrawerComponent,
    DocumentWidgetDrawerComponent,
    AddWidgetModalComponent,
    CustomTabWidgetModalComponent,
    ItemListWidgetModalComponent,
    ListWidgetModalComponent,
    StationWidgetTemplateModalComponent,
    DocumentWidgetTemplateModalComponent,
    DescriptionWidgetModalComponent,
    GroupWidgetTemplateModalComponent,
    PreBuiltWidgetTemplateModalComponent,
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
    StationDocumentsModalModule,
    UserAvatarModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatRippleModule,
    MatTableModule,
    MatTabsModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatButtonToggleModule,
    ComingSoonMessageModule,
    NgChartsModule,
    MatCheckboxModule,
    MatChipsModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
    StationWidgetModule,
    DocumentWidgetModule,
    GroupTrafficWidgetModule,
    GroupSearchWidgetModule,
    ContainerPreBuiltWidgetModule,
    StationPreBuiltWidgetModule,
  ],
  providers: [MobileBrowserChecker],
})
export class DashboardModule {}
