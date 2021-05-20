import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'src/app/core/popup.service';
import { PasswordRequirements } from 'src/helpers/password-requirements';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogData } from 'src/models';

/**
 * Component used for creating an account.
 */
@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent {
  /** Sign up form. */
  signUpForm: FormGroup;

  /** Are password requirements visible. */
  passReqVisible = false;

  /** Show passwords match validation in child component. */
  showMatch = false;

  /** What errors to get from validator. */
  errorsToGet = '';

  /** Init Password Requirements helper. */
  private passwordReqService: PasswordRequirements;

  /** Show loading indicator while request is being made. */
  isLoading = false;

  /** Temp message for terms modal. */
  readonly modalMessage = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur non ipsum a porta.
Aenean condimentum sem id lobortis ornare.Fusce venenatis efficitur pulvinar. Vivamus dignissim erat odio,
ac interdum mi viverra nec. Nunc rutrum dolor a augue convallis, ac iaculis mauris dapibus.\n\nFusce non est libero. Fusce porttitor
ex id convallis facilisis. Pellentesque sit amet eleifend quam, eget pharetra ipsum. Proin id mattis sem. In vitae sem massa.\n\nIn hac
habitasse platea dictumst. Nunc ut dui leo. Phasellus semper est vel ultricies tempus.  Proin ac lectus risus. Duis vestibulum
libero velit, ac consequat urna feugiat sit amet. Vestibulum et purus elit. Donec eu nunc lobortis, consectetur ipsum et, mollis
dui. Mauris tempus, est at posuere mollis, nunc turpis vestibulum velit, sit amet rutrum tortor velit a augue.\n\nSed dignissim,
turpis ac maximus facilisis, purus risus posuere metus, ut eleifend tellus nisi pretium est. Fusce ut diam hendrerit, pretium
eros a, lacinia orci. Nunc justo velit, consequat dapibus justo in, elementum mattis massa.\n\nNunc id malesuada leo.
Praesent in faucibus ante, eget dignissim ipsum. Etiam egestas ex tortor, nec consectetur nibh pharetra et. Aenean
gravida magna libero, nec tincidunt libero malesuada eu. Vivamus faucibus lobortis faucibus. Sed in tellus eget dui tincidunt
lobortis. Sed magna turpis, vestibulum nec malesuada dapibus, aliquam ut magna. Cras sagittis mi quis vulputate efficitur.
Nunc tempus nibh sed sollicitudin aliquet. Vestibulum nec diam lorem.  Pellentesque habitant morbi tristique senectus et netus
et malesuada fames ac turpis egestas. Sed dignissim magna in nibh consequat iaculis. Sed interdum pharetra consequat. Sed
dolor leo, tincidunt eu sollicitudin at, commodo ac odio. Aliquam aliquam imperdiet metus a hendrerit. Integer ornare ut
ipsum nec dictum. Vivamus id fringilla leo. Ut nisl augue, eleifend nec condimentum tempus, faucibus quis augue.\n\n
Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla ornare sapien quam,
ut pulvinar purus tempus ut. Curabitur vehicula lacus in lacinia cursus. Quisque dictum est sed risus malesuada pellentesque.
Vestibulum vehicula gravida erat eu elementum. Cras egestas sed nisl ut vulputate. Nulla in suscipit justo.  Pellentesque a magna
tincidunt, ultricies felis vel, venenatis sem. Vestibulum et sodales tortor. Donec suscipit nec diam in sagittis. Proin hendrerit,
libero et semper aliquet, mi velit varius dolor, a venenatis lacus leo eget risus. Vestibulum congue volutpat auctor.
Maecenas faucibus ipsum ac velit porta, vitae condimentum est venenatis. Proin dapibus suscipit elit in tincidunt. Morbi
lorem augue, dignissim eget malesuada vitae, dictum sollicitudin augue. Curabitur cursus scelerisque pellentesque.
Aenean sit amet enim magna. Suspendisse ut tristique nunc, a luctus nisi. Nullam id mauris id quam faucibus facilisis.`;

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private fb: FormBuilder,
    private popupService: PopupService,
    private router: Router
  ) {
    this.passwordReqService = new PasswordRequirements();

    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          this.passwordReqService.isGreaterThanEightChars(),
          this.passwordReqService.hasOneLowerCaseChar(),
          this.passwordReqService.hasOneUpperCaseChar(),
          this.passwordReqService.hasOneDigitChar(),
          this.passwordReqService.hasOneSpecialChar()
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          this.passwordReqService.isGreaterThanEightChars(),
          this.passwordReqService.hasOneLowerCaseChar(),
          this.passwordReqService.hasOneUpperCaseChar(),
          this.passwordReqService.hasOneDigitChar(),
          this.passwordReqService.hasOneSpecialChar(),
          this.passwordReqService.passwordsMatch()
        ]
      ],
      agreeToTerms: [false, [Validators.requiredTrue]]
    });
  }

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
   * Attempts to create a new account with the provided form information.
   */
  createAccount(): void {
    this.isLoading = true;
    const formValues = this.signUpForm.value;
    this.userService.register(formValues.firstName, formValues.lastName, formValues.email, formValues.password)
      .pipe(first())
      .subscribe(() => {
        this.isLoading = false;
        this.openValidateEmailModal();
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        const errorMessage: string = error.error.error;

        if (errorMessage === 'This username has already been used.') {
          this.popupService.alert({
            title: 'Account Already Exists',
            message: 'An account has already been created for this email address. Try signing into this account instead.'
          });
        } else {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error,
            true
          );
        }
      });
  }

  /**
   * Open the terms and conditions modal.
   */
  openTerms(): void {
    const data = {
      title: 'Terms and Conditions',
      message: this.modalMessage,
      okButtonText: 'Agree',
      width: '90%'
    };

    this.popupService.confirm(data).then((result) => {
      this.signUpForm.get('agreeToTerms')?.setValue(result);
    });
  }

  /**
   * Open the alert to validate their email address.
   */
  openValidateEmailModal(): void {
    const data: DialogData = {
      title: 'Validate your email address',
      message: 'Almost there! Please check your email for a link to validate your Rithm account.'
    };

    this.popupService.alert(data).then(() => {
      this.router.navigate(['']);
    });
  }

}
