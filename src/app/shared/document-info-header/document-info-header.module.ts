import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentInfoHeaderComponent } from './document-info-header.component';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [DocumentInfoHeaderComponent],
  imports: [CommonModule, MatChipsModule, ReactiveFormsModule, MatFormFieldModule],
  exports: [DocumentInfoHeaderComponent],
})
export class DocumentInfoHeaderModule {}
