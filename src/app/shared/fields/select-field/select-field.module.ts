import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectFieldComponent } from './select-field.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SelectFieldComponent],
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule],
  exports: [SelectFieldComponent],
})
export class SelectFieldModule {}
