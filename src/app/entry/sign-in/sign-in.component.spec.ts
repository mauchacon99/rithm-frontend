import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { CoreModule } from 'src/app/core/core.module';
import { UserService } from 'src/app/core/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignInResponse } from 'src/models';

import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let loader: HarnessLoader;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInComponent],
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
      ],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading indicator during request', () => {
    // TODO: add unit test
  });

  it('should display invalid credentials message', () => {
    const message = fixture.debugElement.query(By.css('.invalid-message'));
    expect(message.classes['transparent']).toBeFalsy();

    component.signInForm.controls['email'].setValue('incorrect@email.com');
    component.signInForm.controls['password'].setValue('password1234');
    component.signIn();
    expect(component.invalidCredentials).toBeTrue;

    expect(message).toBeTruthy();
  });

  it('should display message to verify email if not validated', () => {
    // TODO: add unit test
  });

  it('should display error popup if request fails', () => {
    // TODO: add unit test
  });

  it('should navigate to dashboard upon successful sign in', () => {
    const routerSpy = spyOn(router, 'navigateByUrl');
    component.signInForm.controls['email'].setValue('someone@email.com');
    component.signInForm.controls['password'].setValue('password1234');
    component.signIn();
    expect(routerSpy).toHaveBeenCalledOnceWith('dashboard');

    // TODO: add unit test
  });

  // sign in form
  describe('sign in form', () => {
    let formGroup: FormGroup;
    let emailControl: AbstractControl;
    let passwordControl: AbstractControl;

    beforeEach(() => {
      formGroup = component.signInForm;
      emailControl = formGroup.controls['email'];
      passwordControl = component.signInForm.controls['password'];
    });

    it('should exist', () => {
      expect(formGroup).toBeTruthy();
    });

    it('should be invalid when empty', () => {
      expect(formGroup.valid).toBeFalse();
    });

    // email field
    describe('email field', () => {
      let emailInputHarness: MatInputHarness;

      beforeEach(async () => {
        emailInputHarness = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
      });

      it('should exist', () => {
        expect(emailInputHarness).toBeTruthy();
      });

      it('should require a value', () => {
        expect(emailControl.valid).toBeFalsy();
        expect(emailControl.hasError('required')).toBeTrue();
      });

      it('should check for a valid email', () => {
        emailControl.setValue('test.com');
        expect(emailControl.hasError('email')).toBeTrue();
        emailControl.setValue('test@email.com');
        expect(emailControl.hasError('email')).toBeFalse();
      });
    });

    // password field
    describe('password field', () => {
      let passwordInputHarness: MatInputHarness;

      beforeEach(async () => {
        passwordInputHarness = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      });

      it('should exist', () => {
        expect(passwordInputHarness).toBeTruthy();
      });

      it('should require a value', () => {
        expect(passwordControl.valid).toBeFalse();
        expect(passwordControl.hasError('required')).toBeTrue();
      });
    });

    // sign in button
    describe('sign in button', () => {
      let buttonHarness: MatButtonHarness;

      beforeEach(async () => {
        buttonHarness = await loader.getHarness(MatButtonHarness);
        spyOn(component, 'signIn');
      });

      it('should exist', () => {
        expect(buttonHarness).toBeTruthy();
      });

      it('should be disabled when form is empty', async () => {
        expect(await buttonHarness.isDisabled()).toBeTrue();
      });

      it('should be disabled when form is invalid', async () => {
        formGroup.controls['email'].setValue('test@email....com');
        formGroup.controls['password'].setValue('password1234');
        expect(await buttonHarness.isDisabled()).toBeTrue();
      });

      it('should be enabled when form is filled out', async () => {
        formGroup.controls['email'].setValue('test@email.com');
        formGroup.controls['password'].setValue('password1234');
        expect(await buttonHarness.isDisabled()).toBeFalse();
      });

      it('should sign in when clicked', async () => {
        formGroup.controls['email'].setValue('test@email.com');
        formGroup.controls['password'].setValue('password1234');
        expect(await buttonHarness.isDisabled()).toBeFalse(); // This needs to be present for some reason...

        await buttonHarness.click();
        expect(component.signIn).toHaveBeenCalled();
      });
    });

  });

});

// eslint-disable-next-line
class MockUserService {

  // eslint-disable-next-line
  signIn(email: string, password: string): Observable<SignInResponse> {
    let response;

    if (email.includes('unverified')) {
      response = new HttpErrorResponse({
        error: {
          error: 'Unable to login before email has been verified.'
        }
      });
    } else if (email.includes('incorrect')) {
      response = new HttpErrorResponse({
        error: {
          error: 'Invalid username or password.'
        }
      });
    } else {
      return of({
        accessToken: 'wowowowo',
        user: undefined
      });
    }

    return throwError(response);

  }
}
