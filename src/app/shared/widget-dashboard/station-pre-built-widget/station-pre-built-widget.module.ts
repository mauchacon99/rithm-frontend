import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationPreBuiltWidgetComponent } from './station-pre-built-widget.component';
import { LoadingWidgetModule } from '../loading-widget/loading-widget.module';
import { ErrorWidgetModule } from '../error-widget/error-widget.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RosterModule } from 'src/app/shared/roster/roster.module';

@NgModule({
  declarations: [StationPreBuiltWidgetComponent],
  imports: [
    CommonModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
    MatTableModule,
    RosterModule,
    MatSortModule,
  ],
  exports: [StationPreBuiltWidgetComponent],
})
export class StationPreBuiltWidgetModule {}
