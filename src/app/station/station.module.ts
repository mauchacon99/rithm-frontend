import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationRoutingModule } from './station-routing.module';
import { StationComponent } from './station/station.component';
import { DetailModule } from '../detail/detail.module';
import { FlowLogicComponent } from './flow-logic/flow-logic.component';
import { PowersComponent } from './powers/powers.component';


@NgModule({
  declarations: [
    StationComponent,
    FlowLogicComponent,
    PowersComponent
  ],
  imports: [
    CommonModule,
    StationRoutingModule,
    DetailModule
  ]
})
export class StationModule { }
