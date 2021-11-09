import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Component that creates a form to delete a User. Currently only used in testing.
 */
@Component({
  selector: 'app-user-removal',
  templateUrl: './user-removal.component.html',
  styleUrls: ['./user-removal.component.scss']
})
export class UserRemovalComponent {

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
      .subscribe({
        next: () => {
          this.popupService.notify('Deleted should have worked');
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            'unable to delete. ',
            error,
            true
          );
        }
      });
  }
}
