import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StationCardComponent } from './station-card/station-card.component';
import { DocumentListCardComponent } from './document-list-card/document-list-card.component';
import { HeaderComponent } from './header/header.component';
import { MyStationsComponent } from './my-stations/my-stations.component';
import { PreviouslyStartedDocumentsComponent } from './previously-started-documents/previously-started-documents.component';
import { PriorityQueueComponent } from './priority-queue/priority-queue.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GridsterModule } from 'angular-gridster2';
import { StationWidgetComponent } from './widgets/station-widget/station-widget.component';
import { MatCardModule } from '@angular/material/card';
import { HeaderMenuComponent } from './dashboard-menu/header-menu/header-menu.component';
import { OptionsMenuComponent } from './dashboard-menu/options-menu/options-menu.component';
import { ExpansionMenuComponent } from './dashboard-menu/expansion-menu/expansion-menu.component';
import { MenuComponent } from './dashboard-menu/menu/menu.component';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { RosterModule } from 'src/app/shared/roster/roster.module';
import { StationDocumentsModalModule } from 'src/app/shared/station-documents-modal/station-documents-modal.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';
import { DocumentModule } from 'src/app/document/document.module';
import { MatMenuModule } from '@angular/material/menu';
import { DocumentWidgetComponent } from './widgets/document-widget/document-widget.component';
import { StationWidgetDrawerComponent } from './drawer-widget/station-widget-drawer/station-widget-drawer.component';
import { WidgetDrawerComponent } from './drawer-widget/widget-drawer/widget-drawer.component';

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
  ],
  exports: [StationWidgetDrawerComponent],
})
export class DashboardModule {}
