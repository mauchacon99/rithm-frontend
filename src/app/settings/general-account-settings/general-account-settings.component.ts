import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Component for the general account settings section of account settings.
 */
@Component({
  selector: 'app-general-account-settings',
  templateUrl: './general-account-settings.component.html',
  styleUrls: ['./general-account-settings.component.scss']
})
export class GeneralAccountSettingsComponent {
  /** Getting parent form group. */
  @Input() parentFormGroup!: FormGroup;

}
