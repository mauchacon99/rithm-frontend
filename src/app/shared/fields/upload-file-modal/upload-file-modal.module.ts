import { NgModule } from '@angular/core';
import { UploadFileModalComponent } from './upload-file-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { DragAndDropZoneDirective } from 'src/helpers/directives/drag-and-drop-zone.directive';

@NgModule({
  declarations: [UploadFileModalComponent, DragAndDropZoneDirective],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  exports: [UploadFileModalComponent],
})
export class UploadFileModalModule {}
