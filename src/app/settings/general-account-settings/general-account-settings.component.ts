import { Component, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Component for the general account settings section of account settings.
 */
@Component({
  selector: 'app-general-account-settings',
  templateUrl: './general-account-settings.component.html',
  styleUrls: ['./general-account-settings.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneralAccountSettingsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GeneralAccountSettingsComponent),
      multi: true
    }
  ]
})
export class GeneralAccountSettingsComponent {
  /** Child form of Settings form. */
  generalSettingsForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
    this.generalSettingsForm = this.fb.group({
      userForm: this.fb.control('')
    });
  }
}
