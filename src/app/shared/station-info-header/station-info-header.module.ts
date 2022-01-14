import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationInfoHeaderComponent } from './station-info-header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [StationInfoHeaderComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [StationInfoHeaderComponent],
})
export class StationInfoHeaderModule {}
