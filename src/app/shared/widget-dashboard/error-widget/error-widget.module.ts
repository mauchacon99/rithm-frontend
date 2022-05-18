import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorWidgetComponent } from './error-widget.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ErrorWidgetComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [ErrorWidgetComponent],
})
export class ErrorWidgetModule {}
