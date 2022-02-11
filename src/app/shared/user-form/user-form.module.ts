import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordRequirementsModule } from '../password-requirements/password-requirements.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    PasswordRequirementsModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [UserFormComponent],
})
export class UserFormModule {}
