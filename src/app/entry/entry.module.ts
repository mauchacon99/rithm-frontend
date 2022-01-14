import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AccountCreateComponent } from './account-create/account-create.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { EntryRoutingModule } from './entry-routing.module';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingIndicatorModule } from '../shared/loading-indicator/loading-indicator.module';
import { UserFormModule } from '../shared/user-form/user-form.module';
import { PasswordRequirementsModule } from '../shared/password-requirements/password-requirements.module';

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
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoadingIndicatorModule,
    UserFormModule,
    PasswordRequirementsModule
  ],
})
export class EntryModule {}
