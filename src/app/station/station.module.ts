import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationRoutingModule } from './station-routing.module';
import { StationComponent } from './station/station.component';
import { DetailModule } from '../detail/detail.module';
import { FlowLogicComponent } from './flow-logic/flow-logic.component';
import { PowersComponent } from './powers/powers.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ClickOutsideModule } from 'ng-click-outside';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { StationFieldComponent } from './station-field/station-field.component';


@NgModule({
  declarations: [
    StationComponent,
    FlowLogicComponent,
    PowersComponent,
    ToolbarComponent,
    StationFieldComponent
  ],
  imports: [
    CommonModule,
    StationRoutingModule,
    DetailModule,
    MatButtonModule,
    MatSidenavModule,
    MatTabsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    SharedModule
  ]
})
export class StationModule { }
