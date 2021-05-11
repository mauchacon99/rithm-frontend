import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AccountCreateComponent } from './account-create.component';

describe('AccountCreateComponent', () => {
  let component: AccountCreateComponent;
  let fixture: ComponentFixture<AccountCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCreateComponent ],
      imports: [
        ReactiveFormsModule,
        MatCheckboxModule,
        OverlayModule,
        MatDialogModule,
        MatSnackBarModule
      ],
      providers: [
        MatDialog
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
});
