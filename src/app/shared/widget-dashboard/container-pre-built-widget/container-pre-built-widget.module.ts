import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerPreBuiltWidgetComponent } from './container-pre-built-widget.component';
import { LoadingWidgetModule } from '../loading-widget/loading-widget.module';
import { ErrorWidgetModule } from '../error-widget/error-widget.module';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { RosterModule } from '../../roster/roster.module';
import { DocumentModule } from 'src/app/document/document.module';

@NgModule({
  declarations: [ContainerPreBuiltWidgetComponent],
  imports: [
    CommonModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
    MatTableModule,
    MatSortModule,
    RosterModule,
    DocumentModule,
  ],
  exports: [ContainerPreBuiltWidgetComponent],
})
export class ContainerPreBuiltWidgetModule {}
