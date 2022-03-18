import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';
import { MockErrorService, MockSplitService, MockUserService } from 'src/mocks';
import { AdminMenuComponent } from 'src/app/admin/admin-menu/admin-menu.component';
import { OrganizationManagementComponent } from 'src/app/admin/organization-management/organization-management.component';

import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminComponent,
        MockComponent(OrganizationManagementComponent),
        MockComponent(AdminMenuComponent),
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SplitService, useClass: MockSplitService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Testing split.io', () => {
    let splitService: SplitService;
    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
    });

    it('should get split for Admin Portal.', () => {
      const dataOrganization = TestBed.inject(UserService).user.organization;
      const splitInitMethod = spyOn(
        TestBed.inject(SplitService),
        'initSdk'
      ).and.callThrough();

      const method = spyOn(
        TestBed.inject(SplitService),
        'getAdminPortalTreatment'
      ).and.callThrough();

      const sectionPermissionDenied = fixture.nativeElement.querySelector(
        '#admin-permission-denied'
      );
      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(sectionPermissionDenied).toBeDefined();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(method).toHaveBeenCalled();
      expect(component.showAdminPortal).toBeDefined();
    });

    it('should show Admin Portal when permission exits.', () => {
      const dataOrganization = TestBed.inject(UserService).user.organization;
      const splitInitMethod = spyOn(
        TestBed.inject(SplitService),
        'initSdk'
      ).and.callThrough();

      const method = spyOn(
        TestBed.inject(SplitService),
        'getAdminPortalTreatment'
      ).and.returnValue('on');

      const sectionPermissionDenied = fixture.nativeElement.querySelector(
        '#admin-permission-denied'
      );

      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(sectionPermissionDenied).toBeDefined();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(method).toHaveBeenCalled();
      expect(component.showAdminPortal).toBeTrue();
    });

    it('should not show Admin Portal when permission does not exits.', () => {
      const dataOrganization = TestBed.inject(UserService).user.organization;
      const splitInitMethod = spyOn(
        TestBed.inject(SplitService),
        'initSdk'
      ).and.callThrough();

      const method = spyOn(
        TestBed.inject(SplitService),
        'getAdminPortalTreatment'
      ).and.returnValue('off');

      const sectionPermissionDenied = fixture.nativeElement.querySelector(
        '#admin-permission-denied'
      );

      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(sectionPermissionDenied).toBeNull();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(method).toHaveBeenCalled();
      expect(component.showAdminPortal).toBeFalse();
    });
  });
});
