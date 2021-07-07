import { Component, Input } from '@angular/core';
import { FormGroup, } from '@angular/forms';

/**
 * Reusable form component that gets a user's first and last names, email, and password.
 */
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  /** Receive the FormGroup data from parent. */
  @Input() userForm!: FormGroup;

  /** Is this form part of account creation? */
  @Input() accountCreateForm!: boolean;

  /** Are password requirements visible. */
  passReqVisible = false;

  /** Show passwords match validation in child component. */
  showMatch = false;

  /** What errors to get from validator. */
  errorsToGet = '';

  /**
   * Toggle visibility of password requirements.
   *
   * @param errorsFieldToCheck What field to get errors for child component.
   */
  togglePassReq(errorsFieldToCheck: string): void {
    this.errorsToGet = errorsFieldToCheck;
    this.passReqVisible = !this.passReqVisible;
    this.showMatch = errorsFieldToCheck === 'confirmPassword';
  }

  /**
   * Toggle password label.
   *
   * @param isCreate An input determining whether this form will be used in account creation.
   * @returns A string.
   */
  togglePassLabel(isCreate: boolean): string {
    if (!isCreate) {
      return 'New ';
    }
    return '';
  }
}
