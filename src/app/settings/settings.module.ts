import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { GeneralAccountSettingsComponent } from './general-account-settings/general-account-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';



@NgModule({
  declarations: [
    AccountSettingsComponent,
    GeneralAccountSettingsComponent,
    NotificationSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
