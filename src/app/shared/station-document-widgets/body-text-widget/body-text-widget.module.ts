import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodyTextWidgetComponent } from './body-text-widget.component';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  declarations: [BodyTextWidgetComponent],
  imports: [CommonModule, FormsModule, TextFieldModule],
  exports: [BodyTextWidgetComponent],
})
export class BodyTextWidgetModule {}
