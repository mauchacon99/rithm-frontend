import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AccountCreateComponent } from './account-create/account-create.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { EntryRoutingModule } from './entry-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingIndicatorModule } from '../shared/loading-indicator/loading-indicator.module';

@NgModule({
  declarations: [
    SignInComponent,
    ForgotPasswordComponent,
    AccountCreateComponent,
    PasswordResetComponent,
  ],
  imports: [
    CommonModule,
    EntryRoutingModule,
    SharedModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoadingIndicatorModule,
  ],
})
export class EntryModule {}
