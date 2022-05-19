import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { ErrorWidgetModule } from 'src/app/shared/widget-dashboard/error-widget/error-widget.module';
import { LoadingWidgetModule } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.module';
import { GroupTrafficWidgetComponent } from 'src/app/shared/widget-dashboard/group-traffic-widget/group-traffic-widget.component';

@NgModule({
  declarations: [GroupTrafficWidgetComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    NgChartsModule,
    MatButtonModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
  ],
  exports: [GroupTrafficWidgetComponent],
})
export class GroupTrafficWidgetModule {}
