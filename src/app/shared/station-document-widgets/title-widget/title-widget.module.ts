import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleWidgetComponent } from './title-widget.component';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  declarations: [TitleWidgetComponent],
  imports: [CommonModule, FormsModule, TextFieldModule],
  exports: [TitleWidgetComponent],
})
export class TitleWidgetModule {}
