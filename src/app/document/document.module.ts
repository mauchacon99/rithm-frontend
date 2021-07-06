import { NgModule } from '@angular/core';
import { DocumentComponent } from './document/document.component';

import { CommonModule } from '@angular/common';
import { DocumentRoutingModule } from './document-routing.module';
import { DetailModule } from '../detail/detail.module';


@NgModule({
  declarations: [
    DocumentComponent
  ],
  imports: [
    CommonModule,
    DocumentRoutingModule,
    DetailModule
  ]
})
export class DocumentModule { }
