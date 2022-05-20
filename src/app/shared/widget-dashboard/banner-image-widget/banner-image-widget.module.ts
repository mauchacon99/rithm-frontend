import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerImageWidgetComponent } from 'src/app/shared/widget-dashboard/banner-image-widget/banner-image-widget.component';
import { AvatarImageWidgetModule } from 'src/app/shared/widget-dashboard/avatar-image-widget/avatar-image-widget.module';

@NgModule({
  declarations: [BannerImageWidgetComponent],
  imports: [CommonModule, AvatarImageWidgetModule],
  exports: [BannerImageWidgetComponent],
})
export class BannerImageWidgetModule {}
