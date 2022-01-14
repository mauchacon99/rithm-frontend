import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NestedFieldComponent } from './nested-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectFieldModule } from '../select-field/select-field.module';
import { TextFieldModule } from '../text-field/text-field.module';
import { NumberFieldModule } from '../number-field/number-field.module';

@NgModule({
  declarations: [NestedFieldComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectFieldModule,
    TextFieldModule,
    NumberFieldModule,
  ],
  exports: [NestedFieldComponent],
})
export class NestedFieldModule {}
