import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordRequirements } from 'src/helpers/password-requirements';

import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UserFormComponent
      ],
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: FormBuilder, useValue: formBuilder }]
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

  it('should require a first name', () => {
    const firstName = component.userForm.controls['firstName'];
    expect(firstName.valid).toBeFalse();
    expect(firstName.hasError('required')).toBeTrue();
    expect(component.userForm.valid).toBeFalse();
  });

  it('should require a last name', () => {
    const lastName = component.userForm.controls['lastName'];
    expect(lastName.valid).toBeFalse();
    expect(lastName.hasError('required')).toBeTrue();
    expect(component.userForm.valid).toBeFalse();
  });

  it('should require an email', () => {
    const email = component.userForm.controls['email'];
    expect(email.valid).toBeFalse();
    expect(email.hasError('required')).toBeTrue();
    expect(component.userForm.valid).toBeFalse();
  });

  it('should require a valid email', () => {
    const email = component.userForm.controls['email'];
    email.setValue('test.com');
    expect(email.valid).toBeFalse();
    expect(email.hasError('email')).toBeTrue();
    expect(component.userForm.valid).toBeFalse();
  });

  it('should require a password', () => {
    const password = component.userForm.controls['password'];
    expect(password.valid).toBeFalse();
    expect(password.hasError('required')).toBeTrue();
    expect(component.userForm.valid).toBeFalse();
  });

  it('should require password to pass criteria', () => {
    const password = component.userForm.controls['password'];
    password.setValue('1234567');
    expect(password.hasError('missingPassLength')).toBeTrue();
    expect(password.hasError('missingLowerChar')).toBeTrue();
    expect(password.hasError('missingUpperChar')).toBeTrue();
    expect(password.hasError('missingSpecialChar')).toBeTrue();
    expect(component.userForm.valid).toBeFalse();

    password.setValue('abcde');
    expect(password.hasError('missingPassLength')).toBeTrue();
    expect(password.hasError('missingUpperChar')).toBeTrue();
    expect(password.hasError('missingSpecialChar')).toBeTrue();
    expect(component.userForm.valid).toBeFalse();
  });

  it('should require a confirm password entry', () => {
    const confirmPassword = component.userForm.controls['confirmPassword'];
    expect(confirmPassword.valid).toBeFalse();
    expect(confirmPassword.hasError('required')).toBeTrue();
    expect(component.userForm.valid).toBeFalse();
  });

  it('should check that the password and confirm password fields are matching', () => {
    const password = component.userForm.controls['password'];
    const confirmPassword = component.userForm.controls['confirmPassword'];

    password.setValue('Password!2');
    confirmPassword.setValue('Password!3');

    expect(confirmPassword.hasError('mismatchingPasswords')).toBeTrue();
    expect(component.userForm.valid).toBeFalse();
  });


});
