import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoDrawerComponent } from './info-drawer/info-drawer.component';
import { StationInfoDrawerComponent } from './station-info-drawer/station-info-drawer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentInfoDrawerComponent } from './document-info-drawer/document-info-drawer.component';


@NgModule({
  declarations: [
    InfoDrawerComponent,
    StationInfoDrawerComponent,
    DocumentInfoDrawerComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    InfoDrawerComponent
  ]
})
export class InfoDrawerModule { }
