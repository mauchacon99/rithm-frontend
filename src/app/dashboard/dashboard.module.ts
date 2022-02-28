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
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StationCardComponent } from './station-card/station-card.component';
import { DocumentListCardComponent } from './document-list-card/document-list-card.component';
import { HeaderComponent } from './header/header.component';
import { MyStationsComponent } from './my-stations/my-stations.component';
import { PreviouslyStartedDocumentsComponent } from './previously-started-documents/previously-started-documents.component';
import { PriorityQueueComponent } from './priority-queue/priority-queue.component';
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
import { LoadingWidgetComponent } from './widgets/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from './widgets/error-widget/error-widget.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddWidgetModalComponent } from './widget-modal/add-widget-modal/add-widget-modal.component';
import { MatRippleModule } from '@angular/material/core';
import { DocumentWidgetDrawerComponent } from './drawer-widget/document-widget-drawer/document-widget-drawer.component';
import { CustomTabWidgetModalComponent } from './widget-modal/custom-tab-widget-modal/custom-tab-widget-modal.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    DashboardComponent,
    StationCardComponent,
    DocumentListCardComponent,
    HeaderComponent,
    MyStationsComponent,
    PreviouslyStartedDocumentsComponent,
    PriorityQueueComponent,
    StationWidgetComponent,
    HeaderMenuComponent,
    OptionsMenuComponent,
    ExpansionMenuComponent,
    MenuComponent,
    DocumentWidgetComponent,
    StationWidgetDrawerComponent,
    WidgetDrawerComponent,
    LoadingWidgetComponent,
    ErrorWidgetComponent,
    DocumentWidgetDrawerComponent,
    AddWidgetModalComponent,
    CustomTabWidgetModalComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    GridsterModule,
    MatCardModule,
    LoadingIndicatorModule,
    RosterModule,
    StationDocumentsModalModule,
    MatButtonModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    UserAvatarModule,
    DocumentModule,
    MatMenuModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatRippleModule,
    MatTableModule,
    MatTabsModule,
  ],
})
export class DashboardModule {}
