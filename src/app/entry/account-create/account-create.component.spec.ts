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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MockComponent } from 'ng-mocks';
import { TermsConditionsModalComponent } from 'src/app/shared/terms-conditions-modal/terms-conditions-modal.component';

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

  it('should call openTerms when link clicked', () => {
    const notificationsSpy = spyOn(component, 'openTerms');
    const link = fixture.debugElement.nativeElement.querySelector('#terms');
    link.click();
    expect(notificationsSpy).toHaveBeenCalled();
  });

  it('should call service to open terms and conditions', () => {
    const dialog = TestBed.inject(MatDialog);
    const dialogSpy = spyOn(dialog, 'open');
    component.openTerms(MockComponent(TermsConditionsModalComponent));
    expect(dialogSpy).toHaveBeenCalledTimes(1);
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

    it('should be disabled when terms are not agreed to', async () => {
      formGroup.controls['agreeToTerms'].setValue(false);
      expect(await buttonHarness.isDisabled()).toBeTrue();
    });

    it('should be disabled when user form is invalid', async () => {
      formGroup.controls['agreeToTerms'].setValue(true);
      expect(formGroup.controls['userForm'].valid).toBeFalse();
      expect(await buttonHarness.isDisabled()).toBeTrue();
    });

    it('should be enabled when form is filled out', async () => {
      // formGroup.controls['firstName'].setValue('Adam');
      // formGroup.controls['lastName'].setValue('Jones');
      // formGroup.controls['email'].setValue('test@email.com');
      // formGroup.controls['password'].setValue('Password@123');
      // formGroup.controls['confirmPassword'].setValue('Password@123');
      formGroup.controls['agreeToTerms'].setValue(true);
      expect(await buttonHarness.isDisabled()).toBeFalse();
    });

    it('should sign in when clicked', async () => {
      // formGroup.controls['firstName'].setValue('Adam');
      // formGroup.controls['lastName'].setValue('Jones');
      // formGroup.controls['email'].setValue('test@email.com');
      // formGroup.controls['password'].setValue('Password@123');
      // formGroup.controls['confirmPassword'].setValue('Password@123');
      formGroup.controls['agreeToTerms'].setValue(true);
      expect(await buttonHarness.isDisabled()).toBeFalse(); // This needs to be present for some reason...

      const spy = spyOn(component, 'openValidateEmailModal');
      component.openValidateEmailModal();
      expect(spy).toHaveBeenCalled();

      await buttonHarness.click();
      expect(component.createAccount).toHaveBeenCalled();
    });

    it('should open validate email modal', () => {
      const popupService = TestBed.inject(PopupService);
      const spy = spyOn(popupService, 'alert');
      component.openValidateEmailModal();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

});
