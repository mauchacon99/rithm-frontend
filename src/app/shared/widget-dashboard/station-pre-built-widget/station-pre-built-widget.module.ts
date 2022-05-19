import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { LoadingWidgetModule } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.module';
import { ErrorWidgetModule } from 'src/app/shared/widget-dashboard/error-widget/error-widget.module';
import { RosterModule } from 'src/app/shared/roster/roster.module';
import { StationPreBuiltWidgetComponent } from 'src/app/shared/widget-dashboard/station-pre-built-widget/station-pre-built-widget.component';

@NgModule({
  declarations: [StationPreBuiltWidgetComponent],
  imports: [
    CommonModule,
    MatTableModule,
    RosterModule,
    MatSortModule,
    MatButtonModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
  ],
  exports: [StationPreBuiltWidgetComponent],
})
export class StationPreBuiltWidgetModule {}
