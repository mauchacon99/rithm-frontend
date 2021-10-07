import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoDrawerComponent } from './info-drawer/info-drawer.component';
import { StationInfoDrawerComponent } from './station-info-drawer/station-info-drawer.component';


@NgModule({
  declarations: [
    InfoDrawerComponent,
    StationInfoDrawerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class InfoDrawerModule { }
