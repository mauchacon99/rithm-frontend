import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingDrawerComponent } from 'src/app/station/setting-drawer/setting-drawer.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { ImageDrawerComponent } from './image-drawer/image-drawer.component';

@NgModule({
  declarations: [SettingDrawerComponent, ImageDrawerComponent],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  exports: [SettingDrawerComponent],
})
export class SettingDrawerModule {}
