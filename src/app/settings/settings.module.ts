import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { GeneralAccountSettingsComponent } from './general-account-settings/general-account-settings.component';



@NgModule({
  declarations: [
    AccountSettingsComponent,
    GeneralAccountSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
