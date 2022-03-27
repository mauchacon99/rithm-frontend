import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingDrawerComponent } from 'src/app/shared/setting-drawer/setting-drawer.component';

@NgModule({
  declarations: [SettingDrawerComponent],
  imports: [CommonModule],
  exports: [SettingDrawerComponent],
})
export class SettingDrawerModule {}
