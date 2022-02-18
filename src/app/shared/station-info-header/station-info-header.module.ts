import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationInfoHeaderComponent } from './station-info-header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [StationInfoHeaderComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [StationInfoHeaderComponent],
})
export class StationInfoHeaderModule {}
