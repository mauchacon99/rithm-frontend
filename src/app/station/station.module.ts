import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationRoutingModule } from './station-routing.module';
import { StationComponent } from './station/station.component';
import { DetailModule } from '../detail/detail.module';


@NgModule({
  declarations: [
    StationComponent
  ],
  imports: [
    CommonModule,
    StationRoutingModule,
    DetailModule
  ]
})
export class StationModule { }
