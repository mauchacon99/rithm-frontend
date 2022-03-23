import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { UserService } from 'src/app/core/user.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import {
  MockUserService,
  MockErrorService,
  MockOrganizationService,
  MockSplitService,
} from 'src/mocks';
import { MatListModule } from '@angular/material/list';
import { ListAdminOptionMenuType } from 'src/models/enums/admin-option-menu-type';

import { AdminMenuComponent } from './admin-menu.component';
import { SplitService } from 'src/app/core/split.service';

describe('AdminMenuComponent', () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminMenuComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: OrganizationService, useClass: MockOrganizationService },
        { provide: SplitService, useClass: MockSplitService },
      ],
      imports: [MatListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be to get information about organization', () => {
    const expectOrganizationId = TestBed.inject(UserService).user.organization;
    const expectSpyService = spyOn(
      TestBed.inject(OrganizationService),
      'getOrganizationInfo'
    ).and.callThrough();

    component.ngOnInit();
    expect(expectSpyService).toHaveBeenCalledOnceWith(expectOrganizationId);
  });

  it('should show error message when request information about organization', () => {
    spyOn(
      TestBed.inject(OrganizationService),
      'getOrganizationInfo'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const expectSpyService = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.ngOnInit();
    expect(expectSpyService).toHaveBeenCalled();
  });

  it('should show name organization', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const organizationInfo =
      fixture.debugElement.nativeElement.querySelector('#info-organization');
    expect(organizationInfo).toBeTruthy();

    const showError = fixture.debugElement.nativeElement.querySelector(
      '#failed-info-organization'
    );
    expect(showError).toBeNull();
  });

  it('should show error message when fail request get name', () => {
    component.failedGetOrganization = true;
    fixture.detectChanges();

    const organizationInfo =
      fixture.debugElement.nativeElement.querySelector('#info-organization');
    expect(organizationInfo).toBeNull();

    const showError = fixture.debugElement.nativeElement.querySelector(
      '#failed-info-organization'
    );
    expect(showError).toBeTruthy();
  });

  it('should show loading organization info while data is loading', () => {
    const data = '123-123';
    component['getOrganizationInfo'](data);
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#organization-name-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should emit itemMenuSelected', () => {
    const itemToEmit = ListAdminOptionMenuType.GroupHierarchy;
    const spyEmit = spyOn(component.itemMenuSelected, 'emit').and.callThrough();
    component.getItemSelected(itemToEmit);
    expect(spyEmit).toHaveBeenCalledOnceWith(itemToEmit);
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    let userService: UserService;
    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
      userService = TestBed.inject(UserService);
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
    });

    it('should get split for group hierarchy menu.', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const method = spyOn(
        splitService,
        'getGroupHierarchyMenuTreatment'
      ).and.callThrough();
      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(method).toHaveBeenCalled();
    });

    it('should show group hierarchy when split is true', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const method = spyOn(
        splitService,
        'getGroupHierarchyMenuTreatment'
      ).and.returnValue('on');
      splitService.sdkReady$.next();
      component.ngOnInit();
      const groupMenu = fixture.debugElement.nativeElement.querySelector(
        '#' + ListAdminOptionMenuType.GroupHierarchy
      );
      expect(groupMenu).toBeDefined();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(method).toHaveBeenCalled();
    });

    it('should not show group hierarchy when split is false', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const method = spyOn(
        splitService,
        'getGroupHierarchyMenuTreatment'
      ).and.returnValue('off');
      splitService.sdkReady$.next();
      component.ngOnInit();
      const groupMenu = fixture.debugElement.nativeElement.querySelector(
        '#' + ListAdminOptionMenuType.GroupHierarchy
      );
      expect(groupMenu).toBeNull();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(method).toHaveBeenCalled();
    });
  });
});
