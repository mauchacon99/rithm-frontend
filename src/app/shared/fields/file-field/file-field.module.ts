import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FileFieldComponent } from './file-field.component';
import { UploadFileModalModule } from '../upload-file-modal/upload-file-modal.module';
@NgModule({
  declarations: [FileFieldComponent],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    UploadFileModalModule,
  ],

  exports: [FileFieldComponent],
})
export class FileFieldModule {}
