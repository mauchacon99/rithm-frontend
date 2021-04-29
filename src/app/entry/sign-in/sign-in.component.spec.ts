import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInComponent ],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        CoreModule,
        SharedModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.signInForm.valid).toBeFalsy();
  });

  it('should check the validation of the email field', () => {
    const email = component.signInForm.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

    email.setValue('test.com');
    expect(email.hasError('email')).toBeTruthy();
  });

  it('should check the validation of the password field', () => {
    const password = component.signInForm.controls['password'];
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();
  });

  it('should navigate to forgot password on text click', () => {
    // TODO: add unit test
  });

  it('should navigate to account create on text click', () => {
    // TODO: add unit test
  });

  it('should display error popup if request fails', () => {
    // TODO: add unit test
  });

  // sign in form
  describe('sign in form', () => {
    it('should exist', () => {
      // TODO: add unit test
    });

    it('should display invalid credentials message', () => {
      // TODO: add unit test
    });

    it('should navigate to dashboard upon successful sign in', () => {
      // TODO: add unit test
    });

    // email field
    describe('email field', () => {
      it('should exist', () => {
        // TODO: add unit test
      });

      it('should show errors on invalid email', () => {
        // TODO: add unit test
      });
    });

    // password field
    describe('password field', () => {
      it('should exist', () => {
        // TODO: add unit test
      });
    });

    // sign in button
    describe('sign in button', () => {
      it('should exist', () => {
        // TODO: add unit test
      });

      it('should be disabled without input', () => {
        // TODO: add unit test
      });

      it('should be enabled when form is filled out', () => {
        // TODO: add unit test
      });
    });

  });

});
