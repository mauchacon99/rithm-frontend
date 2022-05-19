import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorWidgetModule } from 'src/app/shared/widget-dashboard/error-widget/error-widget.module';
import { LoadingWidgetModule } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.module';
import { GroupTrafficWidgetComponent } from './group-traffic-widget.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [GroupTrafficWidgetComponent],
  imports: [
    CommonModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    NgChartsModule,
  ],
  exports: [GroupTrafficWidgetComponent],
})
export class GroupTrafficWidgetModule {}
