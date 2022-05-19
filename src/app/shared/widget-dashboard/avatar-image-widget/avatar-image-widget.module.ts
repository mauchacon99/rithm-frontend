import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarImageWidgetComponent } from 'src/app/shared/widget-dashboard/avatar-image-widget/avatar-image-widget.component';

@NgModule({
  declarations: [AvatarImageWidgetComponent],
  imports: [CommonModule],
  exports: [AvatarImageWidgetComponent],
})
export class AvatarImageWidgetModule {}
