import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoDrawerComponent } from './info-drawer/info-drawer.component';
import { StationInfoDrawerComponent } from './station-info-drawer/station-info-drawer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentInfoDrawerComponent } from './document-info-drawer/document-info-drawer.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    InfoDrawerComponent,
    StationInfoDrawerComponent,
    DocumentInfoDrawerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule
  ],
  exports: [
    InfoDrawerComponent
  ]
})
export class InfoDrawerModule { }
