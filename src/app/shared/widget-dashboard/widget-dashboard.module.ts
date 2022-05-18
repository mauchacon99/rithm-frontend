import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerImageWidgetComponent } from './banner-image-widget/banner-image-widget.component';
import { AvatarImageWidgetComponent } from './avatar-image-widget/avatar-image-widget.component';

@NgModule({
  declarations: [BannerImageWidgetComponent, AvatarImageWidgetComponent],
  imports: [CommonModule],
  exports: [BannerImageWidgetComponent, AvatarImageWidgetComponent],
})
export class WidgetDashboardModule {}
