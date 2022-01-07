import { Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

/**
 * Component for displaying satisfied and needed password requirements to the user.
 */
@Component({
  selector: 'app-password-requirements[passReq][match]',
  templateUrl: './password-requirements.component.html',
  styleUrls: ['./password-requirements.component.scss'],
})
export class PasswordRequirementsComponent {
  /** Password requirements errors. */
  @Input() passReq: ValidationErrors | null | undefined;

  /** Show matching passwords requirement. */
  @Input() match = false;
}
