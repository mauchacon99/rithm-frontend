import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPopupService, MockUserService } from 'src/mocks';
import { UserService } from 'src/app/core/user.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AccountCreateComponent } from './account-create.component';
import { PopupService } from 'src/app/core/popup.service';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

describe('AccountCreateComponent', () => {
  let component: AccountCreateComponent;
  let fixture: ComponentFixture<AccountCreateComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountCreateComponent],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatInputModule,
        MatCardModule,
        MatDialogModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: PopupService, useClass: MockPopupService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the validation of the first name field', () => {
    const firstName = component.signUpForm.controls['firstName'];
    expect(firstName.valid).toBeFalsy();

    firstName.setValue('');
    expect(firstName.hasError('required')).toBeTruthy();
  });

  it('should check the last name field validation', () => {
    const lastName = component.signUpForm.controls['lastName'];
    expect(lastName.valid).toBeFalsy();

    lastName.setValue('');
    expect(lastName.hasError('required')).toBeTruthy();
  });

  it('should check the validation of the email field', () => {
    const email = component.signUpForm.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

    email.setValue('test.com');
    expect(email.hasError('email')).toBeTruthy();
  });

  it('should check the validation of the password field', () => {
    const password = component.signUpForm.controls['password'];
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();

    password.setValue('1234567');
    expect(password.hasError('missingPassLength')).toBeTruthy();
    expect(password.hasError('missingLowerChar')).toBeTruthy();
    expect(password.hasError('missingUpperChar')).toBeTruthy();
    expect(password.hasError('missingSpecialChar')).toBeTruthy();

    password.setValue('abcde');
    expect(password.hasError('missingPassLength')).toBeTruthy();
    expect(password.hasError('missingUpperChar')).toBeTruthy();
    expect(password.hasError('missingSpecialChar')).toBeTruthy();
    // expect(password.hasError('mismatchingPasswords')).toBeTruthy();
  });

  it('should check the validation of the confirm password field', () => {
    const confirmPassword = component.signUpForm.controls['confirmPassword'];
    expect(confirmPassword.valid).toBeFalsy();

    confirmPassword.setValue('');
    expect(confirmPassword.hasError('required')).toBeTruthy();

    confirmPassword.setValue('1234567');
    expect(confirmPassword.hasError('missingPassLength')).toBeTruthy();
    expect(confirmPassword.hasError('missingLowerChar')).toBeTruthy();
    expect(confirmPassword.hasError('missingUpperChar')).toBeTruthy();
    expect(confirmPassword.hasError('missingSpecialChar')).toBeTruthy();

    confirmPassword.setValue('abcde');
    expect(confirmPassword.hasError('missingPassLength')).toBeTruthy();
    expect(confirmPassword.hasError('missingUpperChar')).toBeTruthy();
    expect(confirmPassword.hasError('missingSpecialChar')).toBeTruthy();
  });

  xit('should check if the password and confirm password fields are matching', () => {
    const password = component.signUpForm.controls['password'];
    const confirmPassword = component.signUpForm.controls['confirmPassword'];

    password.setValue('Password!2');
    confirmPassword.setValue('Password!3');

    expect(confirmPassword.hasError('mismatchedPasswords')).toBeTruthy();
  });

  it('should open terms and conditions pop up', () => {
    const notificationsSpy = spyOn(component, 'openTerms');
    const link = fixture.debugElement.nativeElement.querySelector('#terms');
    link.click();
    expect(notificationsSpy).toHaveBeenCalled();
  });

  describe('createAccount button', () => {
    let buttonHarness: MatButtonHarness;
    let formGroup: FormGroup;

    beforeEach(async () => {
      formGroup = component.signUpForm;
      buttonHarness = await loader.getHarness(MatButtonHarness);
      spyOn(component, 'createAccount');
    });

    it('should exist', () => {
      expect(formGroup).toBeTruthy();
      expect(buttonHarness).toBeTruthy();
    });

    it('should be disabled when form is empty', async () => {
      expect(await buttonHarness.isDisabled()).toBeTrue();
    });

    it('should be disabled when form is invalid', async () => {
      formGroup.controls['firstName'].setValue('');
      formGroup.controls['lastName'].setValue('');
      formGroup.controls['email'].setValue('test@email....com');
      formGroup.controls['password'].setValue('password1234');
      formGroup.controls['confirmPassword'].setValue('password1234');
      formGroup.controls['agreeToTerms'].setValue(false);
      expect(await buttonHarness.isDisabled()).toBeTrue();
    });

    it('should be enabled when form is filled out', async () => {
      formGroup.controls['firstName'].setValue('Adam');
      formGroup.controls['lastName'].setValue('Jones');
      formGroup.controls['email'].setValue('test@email.com');
      formGroup.controls['password'].setValue('Password@123');
      formGroup.controls['confirmPassword'].setValue('Password@123');
      formGroup.controls['agreeToTerms'].setValue(true);
      expect(await buttonHarness.isDisabled()).toBeFalse();
    });

    it('should sign in when clicked', async () => {
      formGroup.controls['firstName'].setValue('Adam');
      formGroup.controls['lastName'].setValue('Jones');
      formGroup.controls['email'].setValue('test@email.com');
      formGroup.controls['password'].setValue('Password@123');
      formGroup.controls['confirmPassword'].setValue('Password@123');
      formGroup.controls['agreeToTerms'].setValue(true);
      expect(await buttonHarness.isDisabled()).toBeFalse(); // This needs to be present for some reason...

      const spy = spyOn(component, 'openValidateEmailModal');
      component.openValidateEmailModal();
      expect(spy).toHaveBeenCalled();

      await buttonHarness.click();
      expect(component.createAccount).toHaveBeenCalled();
    });

    it('should open validate email modal', async () => {
      const spy = spyOn(component, 'openValidateEmailModal');
      component.openValidateEmailModal();
      expect(spy).toHaveBeenCalled();
    });
  });

});
