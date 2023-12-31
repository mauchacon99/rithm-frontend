import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FileFieldComponent } from './file-field.component';
import { UploadFileModalModule } from 'src/app/shared/fields/upload-file-modal/upload-file-modal.module';
import { LoadingIndicatorModule } from '../../loading-indicator/loading-indicator.module';
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
    LoadingIndicatorModule,
  ],

  exports: [FileFieldComponent],
})
export class FileFieldModule {}
