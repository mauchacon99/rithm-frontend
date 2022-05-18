import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerImageWidgetComponent } from './banner-image-widget.component';
import { AvatarImageModule } from 'src/app/shared/widget-dashboard/avatar-image-widget/avatar-image.module';

@NgModule({
  declarations: [BannerImageWidgetComponent],
  imports: [CommonModule, AvatarImageModule],
  exports: [BannerImageWidgetComponent],
})
export class BannerImageModule {}
