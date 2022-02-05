import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecognitionDirective } from './recognition.directive';

@NgModule({
  declarations: [RecognitionDirective],
  imports: [CommonModule],
  exports: [RecognitionDirective],
})
export class RecognitionModule {}
