import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadlineWidgetComponent } from './headline-widget.component';

@NgModule({
  declarations: [HeadlineWidgetComponent],
  imports: [CommonModule],
  exports: [HeadlineWidgetComponent],
})
export class HeadlineWidgetModule {}
