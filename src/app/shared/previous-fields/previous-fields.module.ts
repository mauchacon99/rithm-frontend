import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviousFieldsComponent } from './previous-fields.component';
import { MatCardModule } from '@angular/material/card';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { AnswersModalComponent } from './answers-modal/answers-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [PreviousFieldsComponent, AnswersModalComponent],
  imports: [
    CommonModule,
    MatCardModule,
    LoadingIndicatorModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
  exports: [PreviousFieldsComponent],
})
export class PreviousFieldsModule {}
