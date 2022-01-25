import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationInfoDrawerComponent } from './station-info-drawer.component';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RosterModule } from 'src/app/shared/roster/roster.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [StationInfoDrawerComponent],
  imports: [
    CommonModule,
    LoadingIndicatorModule,
    MatFormFieldModule,
    FormsModule,
    RosterModule,
    MatRadioModule,
    MatButtonModule,
    MatInputModule,
  ],
  exports: [StationInfoDrawerComponent],
})
export class StationInfoDrawerModule {}