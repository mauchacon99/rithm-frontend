import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoDrawerComponent } from './info-drawer.component';
import { DocumentInfoDrawerModule } from '../document-info-drawer/document-info-drawer.module';
import { StationInfoDrawerModule } from '../station-info-drawer/station-info-drawer.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [InfoDrawerComponent],
  imports: [
    CommonModule,
    DocumentInfoDrawerModule,
    StationInfoDrawerModule,
    MatButtonModule,
  ],
  exports: [InfoDrawerComponent],
})
export class InfoDrawerModule {}
