import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StationCardComponent } from './station-card/station-card.component';
import { DocumentCardComponent } from './document-card/document-card.component';
import { HeaderComponent } from './header/header.component';
import { MyStationsComponent } from './my-stations/my-stations.component';



@NgModule({
  declarations: [DashboardComponent, StationCardComponent, DocumentCardComponent, HeaderComponent, MyStationsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
