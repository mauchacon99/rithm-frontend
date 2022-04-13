import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingDrawerComponent } from 'src/app/station/setting-drawer/setting-drawer.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { SettingImagesComponent } from './setting-images/setting-images.component';
import { SettingFieldsComponent } from './setting-fields/setting-fields.component';

@NgModule({
  declarations: [
    SettingDrawerComponent,
    SettingImagesComponent,
    SettingFieldsComponent,
  ],
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
