import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingDrawerComponent } from 'src/app/shared/setting-drawer/setting-drawer.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [SettingDrawerComponent],
  imports: [CommonModule, MatInputModule],
  exports: [SettingDrawerComponent],
})
export class SettingDrawerModule {}
