import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerWidgetComponent } from './banner-widget.component';

@NgModule({
  declarations: [BannerWidgetComponent],
  imports: [CommonModule],
  exports: [BannerWidgetComponent],
})
export class BannerWidgetModule {}
