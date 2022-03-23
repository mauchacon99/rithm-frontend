import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';
import { MockErrorService, MockSplitService, MockUserService } from 'src/mocks';
import { AdminMenuComponent } from 'src/app/admin/admin-menu/admin-menu/admin-menu.component';
import { OrganizationManagementComponent } from 'src/app/admin/organization-management/organization-management.component';

import { AdminComponent } from './admin.component';
import { GroupHierarchyComponent } from 'src/app/admin/action-admin-menu/group-hierarchy/group-hierarchy.component';
import { ListAdminOptionMenuType } from 'src/models/enums/admin-option-menu-type';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminComponent,
        MockComponent(OrganizationManagementComponent),
        MockComponent(AdminMenuComponent),
        MockComponent(GroupHierarchyComponent),
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

  it('should show Group Hierarchy component', () => {
    component.showAdminPortal = true;
    component.itemMenuSelected = ListAdminOptionMenuType.GroupHierarchy;
    fixture.detectChanges();
    const groupHierarchyDetail =
      fixture.debugElement.nativeElement.querySelector('#group-hierarchy');
    expect(groupHierarchyDetail).toBeTruthy();
  });

  it('should set ang get selected item menu', () => {
    const itemToSelect = ListAdminOptionMenuType.GroupHierarchy;
    component.itemMenuSelected = ListAdminOptionMenuType.AccountSettings;
    const getItemSelected = spyOn(
      component,
      'getItemSelected'
    ).and.callThrough();

    component.getItemSelected(itemToSelect);
    expect(getItemSelected).toHaveBeenCalled();
    expect(component.itemMenuSelected).toEqual(itemToSelect);
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    let userService: UserService;
    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
      userService = TestBed.inject(UserService);
    });

    it('should get split for Admin Portal.', () => {
      const dataOrganization = TestBed.inject(UserService).user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const method = spyOn(
        splitService,
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
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const method = spyOn(
        splitService,
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
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const method = spyOn(
        splitService,
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
      expect(component.showAdminPortal).toBeFalse();
    });
  });
});
