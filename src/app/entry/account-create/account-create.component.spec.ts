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
import { MatDialogModule } from '@angular/material/dialog';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MockComponent } from 'ng-mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';

describe('AccountCreateComponent', () => {
  let component: AccountCreateComponent;
  let fixture: ComponentFixture<AccountCreateComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountCreateComponent,
        MockComponent(UserFormComponent),
        MockComponent(LoadingIndicatorComponent)
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
    expect(notificationsSpy).toHaveBeenCalledTimes(1);
  });

  describe('createAccount button', () => {
    let buttonHarness: MatButtonHarness;
    let formGroup: FormGroup;

    beforeEach(async () => {
      formGroup = component.signUpForm;
      buttonHarness = await loader.getHarness(MatButtonHarness);
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
      formGroup.controls['userForm'].setErrors({ error: true });
      expect(formGroup.valid).toBeFalse();
      expect(await buttonHarness.isDisabled()).toBeTrue();
    });

    it('should be enabled when form is filled out', async () => {
      formGroup.controls['agreeToTerms'].setValue(true);
      expect(formGroup.valid).toBeTrue();
      expect(await buttonHarness.isDisabled()).toBeFalse();
    });

    it('should create an account when clicked', async () => {
      const createAccountSpy = spyOn(component, 'createAccount').and.callFake(() => null);
      formGroup.controls['agreeToTerms'].setValue(true);
      expect(await buttonHarness.isDisabled()).toBeFalse(); // This needs to be present for some reason...

      await buttonHarness.click();
      expect(createAccountSpy).toHaveBeenCalled();
    });

    it('should open validate email modal', () => {
      const alertSpy = spyOn(TestBed.inject(PopupService), 'alert').and.callThrough();
      component.openValidateEmailModal();
      expect(alertSpy).toHaveBeenCalledOnceWith({
        title: 'Validate your email address',
        message: 'Almost there! Please check your email for a link to validate your Rithm account.'
      });
    });
  });

});
