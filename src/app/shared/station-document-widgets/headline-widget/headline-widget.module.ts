import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadlineWidgetComponent } from './headline-widget.component';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  declarations: [HeadlineWidgetComponent],
  imports: [CommonModule, FormsModule, TextFieldModule],
  exports: [HeadlineWidgetComponent],
})
export class HeadlineWidgetModule {}
