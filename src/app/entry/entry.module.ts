import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AccountCreateComponent } from './account-create/account-create.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { EntryRoutingModule } from './entry-routing.module';



@NgModule({
  declarations: [SignInComponent, ForgotPasswordComponent, AccountCreateComponent, PasswordResetComponent],
  imports: [
    CommonModule,
    EntryRoutingModule
  ]
})
export class EntryModule { }
