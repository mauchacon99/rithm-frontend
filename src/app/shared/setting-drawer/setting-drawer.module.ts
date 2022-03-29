import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingDrawerComponent } from 'src/app/shared/setting-drawer/setting-drawer.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [SettingDrawerComponent],
  imports: [CommonModule, MatSlideToggleModule],
  exports: [SettingDrawerComponent],
})
export class SettingDrawerModule {}
