import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingWidgetComponent } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.component';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';

@NgModule({
  declarations: [LoadingWidgetComponent],
  imports: [CommonModule, LoadingIndicatorModule],
  exports: [LoadingWidgetComponent],
})
export class LoadingWidgetModule {}
