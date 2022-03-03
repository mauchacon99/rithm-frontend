import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileFieldComponent } from './file-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [FileFieldComponent],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],

  exports: [FileFieldComponent],
})
export class FileFieldModule {}
