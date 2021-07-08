import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { GeneralAccountSettingsComponent } from './general-account-settings/general-account-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    AccountSettingsComponent,
    GeneralAccountSettingsComponent,
    NotificationSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class SettingsModule { }
