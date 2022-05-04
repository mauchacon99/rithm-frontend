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
import { RoleDashboardMenu, User } from 'src/models';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let loader: HarnessLoader;
  let errorService: ErrorService;
  let popupService: PopupService;
  let userService: UserService;
  const formBuilder = new FormBuilder();
  const user: User = {
    rithmId: '69B5A6C1-D380-40DD-BA6D-AABF86E98C4A',
    firstName: 'Admin',
    lastName: 'User',
    email: 'rithmadmin@inpivota.com',
    role: 'admin',
    createdDate: '2021-08-23T15:35:42.2234693',
    isEmailVerified: true,
    notificationSettings: null,
    organization: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
    dashboardType: RoleDashboardMenu.Personal,
    dashboardRithmId: '147cf568-27a4-4968-5628-046ddfee24fd',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UserFormComponent,
        MockComponent(UserAvatarComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
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
    component.currentUser = user;
    loader = TestbedHarnessEnvironment.loader(fixture);
    errorService = TestBed.inject(ErrorService);
    popupService = TestBed.inject(PopupService);
    userService = TestBed.inject(UserService);
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
    const spyAlert = spyOn(popupService, 'alert').and.callThrough();
    const mockFile = new File([''], 'name', { type: 'document/pdf' });
    const mockEvt = { target: { files: [mockFile] } };
    component.uploadImage(mockEvt as unknown as Event);
    expect(spyAlert).toHaveBeenCalledOnceWith(paramExpected);
  });

  it('should catch error if petition upload imageUser fails', () => {
    const serviceMethod = spyOn(userService, 'uploadImageUser').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(errorService, 'displayError').and.callThrough();
    const mockFile = new File([''], 'name', { type: 'image/png' });
    component['uploadImageUser'](mockFile);
    expect(serviceMethod).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call upload imageUser', () => {
    const spyMethod = spyOn(userService, 'uploadImageUser').and.callThrough();
    const mockFile = new File([''], 'name', { type: 'image/png' });
    component['uploadImageUser'](mockFile);
    expect(spyMethod).toHaveBeenCalledWith(mockFile);
  });

  it('should show change and delete button when user image is true', () => {
    component.profileImageRithmId = '12313212323';
    component.accountCreate = false;
    component.showProfilePhoto = true;
    fixture.detectChanges();
    const changeButton = fixture.debugElement.nativeElement.querySelector(
      '#change-image-button'
    );
    const deleteButton = fixture.debugElement.nativeElement.querySelector(
      '#delete-image-button'
    );
    const uploadButton = fixture.debugElement.nativeElement.querySelector(
      '#upload-image-button'
    );
    expect(changeButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
    expect(uploadButton).toBeNull();
  });

  it('should show upload button when user image is true', () => {
    component.profileImageRithmId = '';
    component.accountCreate = false;
    component.showProfilePhoto = true;
    fixture.detectChanges();
    const changeButton = fixture.debugElement.nativeElement.querySelector(
      '#change-image-button'
    );
    const deleteButton = fixture.debugElement.nativeElement.querySelector(
      '#delete-image-button'
    );
    const uploadButton = fixture.debugElement.nativeElement.querySelector(
      '#upload-image-button'
    );
    expect(changeButton).toBeNull();
    expect(deleteButton).toBeNull();
    expect(uploadButton).toBeTruthy();
  });

  it('should show loading  when user image is uploading', () => {
    component.profileImageRithmId = '';
    component.accountCreate = false;
    component.showProfilePhoto = true;
    component.isLoadingUploadImageUser = true;
    fixture.detectChanges();
    const isLoading = fixture.debugElement.nativeElement.querySelector(
      '#loading-upload-photo'
    );
    expect(isLoading).toBeTruthy();
  });

  it('should show error  when user image is uploading', () => {
    component.profileImageRithmId = '';
    component.accountCreate = false;
    component.showProfilePhoto = true;
    component.errorUploadImageUser = true;
    fixture.detectChanges();
    const error = fixture.debugElement.nativeElement.querySelector(
      '#error-loading-upload-photo'
    );
    expect(error).toBeTruthy();
  });

  it('should display a confirmation pop up', async () => {
    component.profileImageRithmId = '12312313212';
    const confirmationData = {
      title: 'Delete image user?',
      message: 'This cannot be undone!',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      important: true,
    };

    const popUpConfirmSpy = spyOn(popupService, 'confirm').and.callThrough();
    await component.confirmRemoveUserImage();
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(confirmationData);
    expect(component.profileImageRithmId).toEqual('');
  });

  it('should delete image user', () => {
    component.profileImageRithmId = '13213211315';
    component['deleteImageUser']();
    expect(component.profileImageRithmId).toEqual('');
  });
});
