import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoDrawerComponent } from './info-drawer.component';
import { DocumentInfoDrawerModule } from 'src/app/shared/document-info-drawer/document-info-drawer.module';
import { StationInfoDrawerModule } from 'src/app/shared/station-info-drawer/station-info-drawer.module';
import { HistoryDrawerModule } from 'src/app/shared/history-drawer/history-drawer.module';
import { MatButtonModule } from '@angular/material/button';
import { SettingDrawerModule } from 'src/app/shared/setting-drawer/setting-drawer.module';

@NgModule({
  declarations: [InfoDrawerComponent],
  imports: [
    CommonModule,
    DocumentInfoDrawerModule,
    StationInfoDrawerModule,
    HistoryDrawerModule,
    SettingDrawerModule,
    MatButtonModule,
  ],
  exports: [InfoDrawerComponent],
})
export class InfoDrawerModule {}
