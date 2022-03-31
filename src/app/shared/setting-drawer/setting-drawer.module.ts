import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingDrawerComponent } from 'src/app/shared/setting-drawer/setting-drawer.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [SettingDrawerComponent],
  imports: [CommonModule, MatInputModule, FormsModule, MatSlideToggleModule],
  exports: [SettingDrawerComponent],
})
export class SettingDrawerModule {}
