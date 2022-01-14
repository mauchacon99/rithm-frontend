import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckFieldComponent } from './check-field.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CheckFieldComponent],
  imports: [CommonModule, MatCheckboxModule, ReactiveFormsModule],
  exports: [CheckFieldComponent],
})
export class CheckFieldModule {}
