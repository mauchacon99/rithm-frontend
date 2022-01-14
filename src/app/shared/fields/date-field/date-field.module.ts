import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFieldComponent } from './date-field.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [DateFieldComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  exports: [DateFieldComponent],
})
export class DateFieldModule {}
