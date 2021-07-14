import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { TermsConditionsService } from 'src/app/core/terms-conditions.service';
import { UserService } from 'src/app/core/user.service';
import { DialogData } from 'src/models';

/**
 * Component used for displaying a terms and conditions popup.
 */
@Component({
  selector: 'app-terms-conditions-modal',
  templateUrl: './terms-conditions-modal.component.html',
  styleUrls: ['./terms-conditions-modal.component.scss']
})
export class TermsConditionsModalComponent implements OnInit {

  /** The title to be displayed on the dialog. */
  title: string;

  /** The confirmation message to be displayed in the dialog. */
  message: string;

  /** The text to be displayed for the okay button. */
  okButtonText: string;

  /** The text to be displayed for the cancel button. */
  cancelButtonText: string;

  /** Show loading indicator while request is being made. */
  isLoading = false;

  /** Show or hide, Agree and cancel button. */
  showAgreeButton: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<TermsConditionsModalComponent>,
    private userService: UserService,
    private errorService: ErrorService,
    private termsAndConditionsService: TermsConditionsService) {
    this.title = data.title;
    this.message = data.message;
    this.okButtonText = data.okButtonText ? data.okButtonText : 'OK';
    this.cancelButtonText = data.cancelButtonText ? data.cancelButtonText : 'Cancel';
    this.showAgreeButton = data.showAgreeButton ? data.showAgreeButton : false;
  }

  /**
   * Open the terms and conditions modal.
   */
  ngOnInit(): void {
    this.openTerms();
  }

  /**
   * Open the terms and conditions modal.
   */
  openTerms(): void {
    this.isLoading = true;
    this.userService.getTermsConditions()
      .pipe(first())
      .subscribe((termsConditions) => {
        if (termsConditions) {
          this.message = termsConditions;
          // this.isLoading = false;
        }
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.dialogRef.close();
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }

  /**
   * Set's the value for terms and conditions is approved or not.
   *
   * @param agree The user agreed terms and conditions or not.
   */
  isAgreed(agree: boolean): void {
    this.termsAndConditionsService.setAgreed(agree);
  }

}
