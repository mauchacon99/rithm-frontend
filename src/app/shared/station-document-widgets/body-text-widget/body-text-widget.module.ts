import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodyTextWidgetComponent } from './body-text-widget/body-text-widget.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [BodyTextWidgetComponent],
  imports: [CommonModule, DragDropModule],
  exports: [BodyTextWidgetComponent],
})
export class BodyTextWidgetModule {}
