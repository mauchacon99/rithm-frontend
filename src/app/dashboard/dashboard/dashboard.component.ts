import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Main component for the dashboard screens.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  /** Delete form. */
  deleteForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private popupService: PopupService,
    private userService: UserService,
    private errorService: ErrorService
  ) {
    this.deleteForm = this.fb.group({
      email: ['', Validators.email]
    });
  }

  /** Delete. */
  deleteUser(): void {
    const formValues = this.deleteForm.value;
    this.userService.delete(formValues.email)
    .pipe(first())
    .subscribe(() => {
      this.popupService.notify('Deleted should have worked');
    }, (error) => {
      this.errorService.displayError(
        'unable to delete. ',
        error,
        true
      );
    });
  }
}
