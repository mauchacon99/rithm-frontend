import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { DocumentWidgetComponent } from 'src/app/shared/widget-dashboard/document-widget/document-widget.component';
import { LoadingWidgetModule } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.module';
import { ErrorWidgetModule } from 'src/app/shared/widget-dashboard/error-widget/error-widget.module';
import { BannerImageWidgetModule } from 'src/app/shared/widget-dashboard/banner-image-widget/banner-image-widget.module';

@NgModule({
  declarations: [DocumentWidgetComponent],
  imports: [
    CommonModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
    BannerImageWidgetModule,
    MatButtonModule,
    MatMenuModule,
  ],
  exports: [DocumentWidgetComponent],
})
export class DocumentWidgetModule {}
