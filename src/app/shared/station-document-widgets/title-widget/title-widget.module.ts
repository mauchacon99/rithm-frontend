import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleWidgetComponent } from './title-widget.component';

@NgModule({
  declarations: [TitleWidgetComponent],
  imports: [CommonModule],
  exports: [TitleWidgetComponent],
})
export class TitleWidgetModule {}
