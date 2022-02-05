import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResetPasswordGuard } from '../core/reset-password.guard';
import { AccountCreateComponent } from './account-create/account-create.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SignInComponent,
        pathMatch: 'full',
      },
      {
        path: 'login',
        redirectTo: '',
      },
      {
        path: 'signin',
        redirectTo: '',
      },
      {
        path: 'sign-in',
        redirectTo: '',
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'account-create',
        component: AccountCreateComponent,
      },
      {
        path: 'password-reset',
        component: PasswordResetComponent,
        canActivate: [ResetPasswordGuard],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class EntryRoutingModule {}
