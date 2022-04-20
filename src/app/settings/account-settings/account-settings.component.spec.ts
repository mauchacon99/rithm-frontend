import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MockComponent } from 'ng-mocks';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import {
  MockErrorService,
  MockPopupService,
  MockSplitService,
  MockUserService,
} from 'src/mocks';
import { NotificationSettingsComponent } from '../notification-settings/notification-settings.component';
import { AccountSettingsComponent } from './account-settings.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';
import { ErrorService } from 'src/app/core/error.service';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SplitService } from 'src/app/core/split.service';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  const formBuilder = new FormBuilder();

  const dialogRefSpyObj = jasmine.createSpyObj({
    // eslint-disable-next-line rxjs/finnish
    afterClosed: of({}),
    close: null,
  });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountSettingsComponent,
        MockComponent(UserFormComponent),
        MockComponent(NotificationSettingsComponent),
        MockComponent(UserAvatarComponent),
      ],
      imports: [MatCardModule, MatDialogModule, ReactiveFormsModule],
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
    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    let userService: UserService;
    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
      userService = TestBed.inject(UserService);
    });

    it('should call split and treatments.', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();
      const methodShowProfilePhoto = spyOn(
        splitService,
        'getAccountProfilePhotoTreatment'
      ).and.returnValue('on');

      splitService.sdkReady$.next();
      component.ngOnInit();

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

      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(methodShowProfilePhoto).toHaveBeenCalled();
      expect(component.showProfilePhoto).toBeFalse();
    });

    it('should catch split error ', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      splitService.sdkReady$.error('error');
      const errorService = spyOn(
        TestBed.inject(ErrorService),
        'logError'
      ).and.callThrough();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(errorService).toHaveBeenCalled();
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
    const spyAlert = spyOn(
      TestBed.inject(PopupService),
      'alert'
    ).and.callThrough();
    const mockFile = new File([''], 'name', { type: 'document/pdf' });
    const mockEvt = { target: { files: [mockFile] } };
    component.uploadImage(mockEvt as unknown as Event);
    expect(spyAlert).toHaveBeenCalled();
  });
});
