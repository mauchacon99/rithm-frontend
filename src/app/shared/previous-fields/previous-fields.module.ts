import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviousFieldsComponent } from './previous-fields.component';
import { MatCardModule } from '@angular/material/card';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';

@NgModule({
  declarations: [PreviousFieldsComponent],
  imports: [CommonModule, MatCardModule, LoadingIndicatorModule],
  exports: [PreviousFieldsComponent],
})
export class PreviousFieldsModule {}
