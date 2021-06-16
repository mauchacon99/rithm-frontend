import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockUserService } from 'src/mocks';
import { UserService } from 'src/app/core/user.service';

import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatDialogModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    jasmine.clock().install();
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading indicator during request', async () => {
    component.signIn();
    const spinnerHarness = await loader.getHarness(MatProgressSpinnerHarness);
    expect(spinnerHarness).toBeTruthy();
  });

  it('should display invalid credentials message', () => {
    const message = fixture.debugElement.query(By.css('#invalid'));
    expect(component.invalidCredentials).toBeFalse();
    expect(message.classes['transparent']).toBeTrue();

    component.signInForm.controls['email'].setValue('incorrect@email.com');
    component.signInForm.controls['password'].setValue('password1234');
    component.signIn();
    jasmine.clock().tick(1000);
    fixture.detectChanges();

    expect(component.invalidCredentials).toBeTrue();
    expect(message.classes['transparent']).toBeFalsy();
  });

  xit('should display message to verify email if not validated', async () => {
    // TODO: Add test for verify email message
  });

  xit('should display error popup if request fails', async () => {
    // TODO: Add test for verify email message
  });

  xit('should navigate to dashboard upon successful sign in', () => {
    // const routerSpy = spyOn(router, 'navigateByUrl');
    component.signInForm.controls['email'].setValue('someone@email.com');
    component.signInForm.controls['password'].setValue('password1234');
    component.signIn();
    jasmine.clock().tick(1001);
    fixture.detectChanges();
    // expect(routerSpy).toHaveBeenCalledOnceWith('dashboard');
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
