import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { ErrorWidgetModule } from '../error-widget/error-widget.module';
import { LoadingWidgetModule } from '../loading-widget/loading-widget.module';
import { GroupSearchWidgetComponent } from './group-search-widget.component';

@NgModule({
  declarations: [GroupSearchWidgetComponent],
  imports: [
    CommonModule,
    LoadingWidgetModule,
    ErrorWidgetModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    RouterModule,
  ],
  exports: [GroupSearchWidgetComponent],
})
export class GroupSearchWidgetModule {}
