import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from 'src/app/core/user.service';
import {
  MockErrorService,
  MockPopupService,
  MockSplitService,
  MockUserService,
} from 'src/mocks';
import { PasswordRequirementsModule } from 'src/app/shared/password-requirements/password-requirements.module';

import { UserFormComponent } from './user-form.component';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { SplitService } from 'src/app/core/split.service';
import { MockComponent } from 'ng-mocks';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';
import { throwError } from 'rxjs';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let loader: HarnessLoader;
  let errorService: ErrorService;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFormComponent, MockComponent(UserAvatarComponent)],
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        PasswordRequirementsModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: UserService, useClass: MockUserService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SplitService, useClass: MockSplitService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    component.accountCreate = true;
    loader = TestbedHarnessEnvironment.loader(fixture);
    errorService = TestBed.inject(ErrorService);
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

  it('should have correct password labels for account create', () => {
    component.accountCreate = true;
    component.ngOnInit();
    expect(component.passwordLabel).toEqual('Password');
    expect(component.confirmPasswordLabel).toEqual('Confirm password');
  });

  it('should have correct password labels for general account settings', () => {
    component.accountCreate = false;
    component.ngOnInit();
    expect(component.passwordLabel).toEqual('New password');
    expect(component.confirmPasswordLabel).toEqual('Confirm new password');
  });

  it('should show password requirements based on focus', async () => {
    const passwordRequirementsSpy = spyOn(
      component,
      'togglePasswordRequirements'
    ).and.callThrough();
    const passwordHarness = await loader.getHarness(
      MatInputHarness.with({ selector: '#password' })
    );

    await passwordHarness.focus();
    expect(passwordRequirementsSpy).toHaveBeenCalledOnceWith('password');
    // await passwordHarness.blur();
    // expect(passwordRequirementsSpy).toHaveBeenCalledOnceWith('password');
  });

  it('should show confirm password requirements based on focus', async () => {
    const passwordRequirementsSpy = spyOn(
      component,
      'togglePasswordRequirements'
    );
    const confirmPasswordHarness = await loader.getHarness(
      MatInputHarness.with({ selector: '#confirmPassword' })
    );

    await confirmPasswordHarness.focus();
    expect(passwordRequirementsSpy).toHaveBeenCalledOnceWith('confirmPassword');
    // await confirmPasswordHarness.blur();
    // expect(passwordRequirementsSpy).toHaveBeenCalledOnceWith('confirmPassword');
  });

  it('should toggle password requirements', () => {
    expect(component.passwordRequirementsVisible).toBeFalse();
    component.togglePasswordRequirements('password');
    expect(component.errorsToGet).toEqual('password');
    expect(component.passwordRequirementsVisible).toBeTrue();
    expect(component.showMatch).toBeFalse();
    component.togglePasswordRequirements('');
    expect(component.passwordRequirementsVisible).toBeFalse();
  });

  it('should toggle confirm password requirements', () => {
    expect(component.passwordRequirementsVisible).toBeFalse();
    component.togglePasswordRequirements('confirmPassword');
    expect(component.errorsToGet).toEqual('confirmPassword');
    expect(component.passwordRequirementsVisible).toBeTrue();
    expect(component.showMatch).toBeTrue();
    component.togglePasswordRequirements('');
    expect(component.passwordRequirementsVisible).toBeFalse();
  });

  it('should disable email when accountCreate is false', () => {
    component.accountCreate = false;
    //TODO: See if there's a cleaner way to do this than call ngOnInit.
    component.ngOnInit();

    const email = component.userForm.controls['email'];

    expect(email.disabled).toBeTrue();
  });

  it('should make password fields optional when accountCreate is false', () => {
    component.accountCreate = false;
    //TODO: See if there's a cleaner way to do this than call ngOnInit.
    component.ngOnInit();

    expect(component.userForm.valid).toBeTrue();
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    let userService: UserService;
    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
      userService = TestBed.inject(UserService);
      component.accountCreate = false;
      fixture.detectChanges();
    });

    it('should call split and treatments.', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();
      const methodShowProfilePhoto = spyOn(
        splitService,
        'getAccountProfilePhotoTreatment'
      ).and.returnValue('on');
      component.ngOnInit();
      splitService.sdkReady$.next();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(methodShowProfilePhoto).toHaveBeenCalled();
      expect(component.showProfilePhoto).toBeTrue();
    });

    it('should not show treatments when permission does not exits.', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();
      const methodShowProfilePhoto = spyOn(
        splitService,
        'getAccountProfilePhotoTreatment'
      ).and.returnValue('off');
      component.ngOnInit();
      splitService.sdkReady$.next();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(methodShowProfilePhoto).toHaveBeenCalled();
      expect(component.showProfilePhoto).toBeFalse();
    });

    it('should catch split error ', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      splitService.sdkReady$.error('error');
      const spyErrorService = spyOn(
        TestBed.inject(ErrorService),
        'logError'
      ).and.callThrough();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(spyErrorService).toHaveBeenCalled();
      expect(component.showProfilePhoto).toBeFalse();
    });
  });

  it('should call uploadImage', () => {
    const spyMethod = spyOn(component, 'uploadImage').and.callThrough();
    const mockFile = new File([''], 'name', { type: 'image/png' });
    const mockEvt = { target: { files: [mockFile] } };
    component.uploadImage(mockEvt as unknown as Event);
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should call alert invalid extension when upload file with extension invalid', () => {
    const paramExpected = {
      title: 'Image format is not valid.',
      message: 'Please select a file with extension jpeg, jpg, png.',
      important: true,
    };
    const spyAlert = spyOn(
      TestBed.inject(PopupService),
      'alert'
    ).and.callThrough();
    const mockFile = new File([''], 'name', { type: 'document/pdf' });
    const mockEvt = { target: { files: [mockFile] } };
    component.uploadImage(mockEvt as unknown as Event);
    expect(spyAlert).toHaveBeenCalledOnceWith(paramExpected);
  });

  it('should catch error if petition upload imageUser fails', () => {
    spyOn(TestBed.inject(UserService), 'uploadImageUser').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(errorService, 'displayError').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spyMethod = spyOn<any>(
      component,
      'uploadImageUser'
    ).and.callThrough();
    const mockFile = new File([''], 'name', { type: 'image/png' });
    component['uploadImageUser'](mockFile);
    expect(spyMethod).toHaveBeenCalledWith(mockFile);
    expect(spyError).toHaveBeenCalled();
  });

  it('should call upload imageUser', () => {
    spyOn(TestBed.inject(UserService), 'uploadImageUser').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spyMethod = spyOn<any>(
      component,
      'uploadImageUser'
    ).and.callThrough();
    const mockFile = new File([''], 'name', { type: 'image/png' });
    component['uploadImageUser'](mockFile);
    expect(spyMethod).toHaveBeenCalledWith(mockFile);
  });
});
