import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingDrawerComponent } from 'src/app/shared/setting-drawer/setting-drawer.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SettingDrawerComponent],
  imports: [CommonModule, MatSlideToggleModule, MatButtonModule],
  exports: [SettingDrawerComponent],
})
export class SettingDrawerModule {}
