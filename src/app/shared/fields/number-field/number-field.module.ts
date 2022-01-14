import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFieldComponent } from './number-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [NumberFieldComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgxMaskModule.forRoot(),
  ],
  exports: [NumberFieldComponent],
})
export class NumberFieldModule {}
