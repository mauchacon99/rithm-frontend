import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PasswordRequirements } from 'src/helpers/password-requirements';

import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFormComponent ],
      imports: [
        MatFormFieldModule,
        ReactiveFormsModule
      ],
      providers: [ { provide: FormBuilder, useValue: formBuilder } ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    const passwordRequirements = new PasswordRequirements();
    component.userForm = formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          passwordRequirements.isGreaterThanEightChars(),
          passwordRequirements.hasOneLowerCaseChar(),
          passwordRequirements.hasOneUpperCaseChar(),
          passwordRequirements.hasOneDigitChar(),
          passwordRequirements.hasOneSpecialChar()
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          passwordRequirements.isGreaterThanEightChars(),
          passwordRequirements.hasOneLowerCaseChar(),
          passwordRequirements.hasOneUpperCaseChar(),
          passwordRequirements.hasOneDigitChar(),
          passwordRequirements.hasOneSpecialChar(),
          passwordRequirements.passwordsMatch()
        ]
      ],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the validation of the first name field', () => {
    const firstName = component.userForm.controls['firstName'];
    expect(firstName.valid).toBeFalsy();

    firstName.setValue('');
    expect(firstName.hasError('required')).toBeTruthy();
  });

  it('should check the last name field validation', () => {
    const lastName = component.userForm.controls['lastName'];
    expect(lastName.valid).toBeFalsy();

    lastName.setValue('');
    expect(lastName.hasError('required')).toBeTruthy();
  });

  it('should check the validation of the email field', () => {
    const email = component.userForm.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

    email.setValue('test.com');
    expect(email.hasError('email')).toBeTruthy();
  });

  it('should check the validation of the password field', () => {
    const password = component.userForm.controls['password'];
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
    const confirmPassword = component.userForm.controls['confirmPassword'];
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
    const password = component.userForm.controls['password'];
    const confirmPassword = component.userForm.controls['confirmPassword'];

    password.setValue('Password!2');
    confirmPassword.setValue('Password!3');

    expect(confirmPassword.hasError('mismatchedPasswords')).toBeTruthy();
  });


});
