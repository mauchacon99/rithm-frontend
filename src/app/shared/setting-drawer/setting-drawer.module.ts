import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingDrawerComponent } from 'src/app/shared/setting-drawer/setting-drawer.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingDrawerComponent],
  imports: [CommonModule, MatInputModule, FormsModule],
  exports: [SettingDrawerComponent],
})
export class SettingDrawerModule {}
