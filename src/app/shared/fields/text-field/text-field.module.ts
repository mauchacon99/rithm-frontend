import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldComponent } from './text-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [TextFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule],
  exports: [TextFieldComponent],
})
export class TextFieldModule {}
