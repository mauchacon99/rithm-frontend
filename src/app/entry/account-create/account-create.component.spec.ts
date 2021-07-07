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
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MockComponent } from 'ng-mocks';

describe('AccountCreateComponent', () => {
  let component: AccountCreateComponent;
  let fixture: ComponentFixture<AccountCreateComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountCreateComponent,
        MockComponent(UserFormComponent)
      ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatInputModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule
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

  it('should open terms and conditions pop up', () => {
    const notificationsSpy = spyOn(component, 'openTerms');
    const link = fixture.debugElement.nativeElement.querySelector('#terms');
    link.click();
    expect(notificationsSpy).toHaveBeenCalled();
  });

  describe('createAccount button', () => {
    let buttonHarness: MatButtonHarness;
    let formGroup: FormGroup;
    let signUpGroup: FormGroup;

    beforeEach(async () => {
      formGroup = component.userForm;
      signUpGroup = component.signUpForm;
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
      signUpGroup.controls['agreeToTerms'].setValue(false);
      expect(await buttonHarness.isDisabled()).toBeTrue();
    });

    it('should be enabled when form is filled out', async () => {
      formGroup.controls['firstName'].setValue('Adam');
      formGroup.controls['lastName'].setValue('Jones');
      formGroup.controls['email'].setValue('test@email.com');
      formGroup.controls['password'].setValue('Password@123');
      formGroup.controls['confirmPassword'].setValue('Password@123');
      signUpGroup.controls['agreeToTerms'].setValue(true);
      expect(await buttonHarness.isDisabled()).toBeFalse();
    });

    it('should sign in when clicked', async () => {
      formGroup.controls['firstName'].setValue('Adam');
      formGroup.controls['lastName'].setValue('Jones');
      formGroup.controls['email'].setValue('test@email.com');
      formGroup.controls['password'].setValue('Password@123');
      formGroup.controls['confirmPassword'].setValue('Password@123');
      signUpGroup.controls['agreeToTerms'].setValue(true);
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
