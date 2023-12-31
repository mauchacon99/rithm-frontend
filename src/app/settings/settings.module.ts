import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { UserFormModule } from 'src/app/shared/user-form/user-form.module';

@NgModule({
  declarations: [AccountSettingsComponent, NotificationSettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoadingIndicatorModule,
    UserFormModule,
  ],
})
export class SettingsModule {}
