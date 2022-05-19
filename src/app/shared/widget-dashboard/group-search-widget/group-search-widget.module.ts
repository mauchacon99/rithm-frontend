import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

import { ErrorWidgetModule } from 'src/app/shared/widget-dashboard/error-widget/error-widget.module';
import { LoadingWidgetModule } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.module';
import { GroupSearchWidgetComponent } from 'src/app/shared/widget-dashboard/group-search-widget/group-search-widget.component';

@NgModule({
  declarations: [GroupSearchWidgetComponent],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    RouterModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
  ],
  exports: [GroupSearchWidgetComponent],
})
export class GroupSearchWidgetModule {}
