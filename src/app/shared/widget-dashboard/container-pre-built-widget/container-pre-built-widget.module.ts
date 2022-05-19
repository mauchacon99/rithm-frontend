import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

import { RosterModule } from 'src/app/shared/roster/roster.module';
import { DocumentModule } from 'src/app/document/document.module';
import { LoadingWidgetModule } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.module';
import { ErrorWidgetModule } from 'src/app/shared/widget-dashboard/error-widget/error-widget.module';
import { ContainerPreBuiltWidgetComponent } from 'src/app/shared/widget-dashboard/container-pre-built-widget/container-pre-built-widget.component';

@NgModule({
  declarations: [ContainerPreBuiltWidgetComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
    RosterModule,
    DocumentModule,
  ],
  exports: [ContainerPreBuiltWidgetComponent],
})
export class ContainerPreBuiltWidgetModule {}
