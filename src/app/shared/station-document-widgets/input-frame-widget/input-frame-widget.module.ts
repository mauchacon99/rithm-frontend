import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFrameWidgetComponent } from './input-frame-widget/input-frame-widget.component';
import { TextFieldModule } from 'src/app/shared/fields/text-field/text-field.module';
import { DateFieldModule } from 'src/app/shared/fields/date-field/date-field.module';
import { NumberFieldModule } from 'src/app/shared/fields/number-field/number-field.module';
import { SelectFieldModule } from 'src/app/shared/fields/select-field/select-field.module';
import { CheckFieldModule } from 'src/app/shared/fields/check-field/check-field.module';

@NgModule({
  declarations: [InputFrameWidgetComponent],
  imports: [
    CommonModule,
    TextFieldModule,
    DateFieldModule,
    NumberFieldModule,
    SelectFieldModule,
    CheckFieldModule,
  ],
  exports: [InputFrameWidgetComponent],
})
export class InputFrameWidgetModule {}
