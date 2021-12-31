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
import { InfoDrawerModule } from 'src/app/info-drawer/info-drawer.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConnectedStationsModalComponent } from './connected-stations-modal/connected-stations-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    DocumentComponent,
    DocumentFieldComponent,
    DocumentTemplateComponent,
    ConnectedStationsModalComponent
  ],
  imports: [
    CommonModule,
    DocumentRoutingModule,
    MatSidenavModule,
    DetailModule,
    SharedModule,
    ReactiveFormsModule,
    InfoDrawerModule,
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule
  ]
})
export class DocumentModule { }
