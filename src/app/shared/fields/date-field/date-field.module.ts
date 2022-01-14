import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFieldComponent } from './date-field.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [DateFieldComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  providers: [MatDatepickerModule],
  exports: [DateFieldComponent],
})
export class DateFieldModule {}
