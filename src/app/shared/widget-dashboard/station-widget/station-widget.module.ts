import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationWidgetComponent } from 'src/app/shared/widget-dashboard/station-widget/station-widget.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';

import { DocumentModule } from 'src/app/document/document.module';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';
import { BannerImageWidgetModule } from 'src/app/shared/widget-dashboard/banner-image-widget/banner-image-widget.module';
import { ErrorWidgetModule } from 'src/app/shared/widget-dashboard/error-widget/error-widget.module';
import { LoadingWidgetModule } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.module';

@NgModule({
  declarations: [StationWidgetComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    RouterModule,
    DocumentModule,
    UserAvatarModule,
    BannerImageWidgetModule,
    ErrorWidgetModule,
    LoadingWidgetModule,
  ],
  exports: [StationWidgetComponent],
})
export class StationWidgetModule {}
