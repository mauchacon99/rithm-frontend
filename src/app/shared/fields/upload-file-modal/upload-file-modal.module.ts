import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileModalComponent } from './upload-file-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [UploadFileModalComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [UploadFileModalComponent],
})
export class UploadFileModalModule {}
