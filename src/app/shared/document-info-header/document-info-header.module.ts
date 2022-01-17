import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentInfoHeaderComponent } from './document-info-header.component';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [DocumentInfoHeaderComponent],
  imports: [
    CommonModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [DocumentInfoHeaderComponent],
})
export class DocumentInfoHeaderModule {}
