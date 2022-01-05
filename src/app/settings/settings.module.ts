import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AccountSettingsComponent, NotificationSettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class SettingsModule {}
