import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { ErrorWidgetComponent } from 'src/app/shared/widget-dashboard/error-widget/error-widget.component';

@NgModule({
  declarations: [ErrorWidgetComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [ErrorWidgetComponent],
})
export class ErrorWidgetModule {}
