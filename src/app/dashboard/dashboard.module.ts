import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StationCardComponent } from './station-card/station-card.component';
import { DocumentListCardComponent } from './document-list-card/document-list-card.component';
import { HeaderComponent } from './header/header.component';
import { MyStationsComponent } from './my-stations/my-stations.component';
import { SharedModule } from '../shared/shared.module';
import { PreviouslyStartedDocumentsComponent } from './previously-started-documents/previously-started-documents.component';
import { PriorityQueueComponent } from './priority-queue/priority-queue.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GridsterModule } from 'angular-gridster2';
import { StationWidgetComponent } from './widgets/station-widget/station-widget.component';
import { MatCardModule } from '@angular/material/card';

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
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MatInputModule,
    ReactiveFormsModule,
    GridsterModule,
    MatCardModule,
  ],
})
export class DashboardModule {}
