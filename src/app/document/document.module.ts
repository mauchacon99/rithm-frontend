import { NgModule } from '@angular/core';
import { DocumentComponent } from './document/document.component';

import { CommonModule } from '@angular/common';
import { DocumentRoutingModule } from './document-routing.module';
import { DetailModule } from '../detail/detail.module';
import { SharedModule } from '../shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentFieldComponent } from './document-field/document-field.component';
import { DocumentTemplateComponent } from './document-template/document-template.component';
import { InfoDrawerModule } from '../info-drawer/info-drawer.module';


@NgModule({
  declarations: [
    DocumentComponent,
    DocumentFieldComponent,
    DocumentTemplateComponent
  ],
  imports: [
    CommonModule,
    DocumentRoutingModule,
    MatSidenavModule,
    DetailModule,
    SharedModule,
    ReactiveFormsModule,
    InfoDrawerModule
  ]
})
export class DocumentModule { }
