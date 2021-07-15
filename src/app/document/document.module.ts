import { NgModule } from '@angular/core';
import { DocumentComponent } from './document/document.component';

import { CommonModule } from '@angular/common';
import { DocumentRoutingModule } from './document-routing.module';
import { DetailModule } from '../detail/detail.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DocumentComponent
  ],
  imports: [
    CommonModule,
    DocumentRoutingModule,
    DetailModule,
    SharedModule
  ]
})
export class DocumentModule { }
