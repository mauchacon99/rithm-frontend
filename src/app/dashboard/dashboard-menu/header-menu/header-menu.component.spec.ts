import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

import { HeaderMenuComponent } from './header-menu.component';
import { throwError } from 'rxjs';
import { UserService } from 'src/app/core/user.service';
import { ErrorService } from 'src/app/core/error.service';
import { OrganizationService } from 'src/app/core/organization.service';
import {
  MockUserService,
  MockErrorService,
  MockOrganizationService,
} from 'src/mocks';

describe('HeaderMenuComponent', () => {
  let component: HeaderMenuComponent;
  let fixture: ComponentFixture<HeaderMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderMenuComponent],
      providers: [
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: OrganizationService, useClass: MockOrganizationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call to toggle sidenavService and hidden menu dashboard', () => {
    const spyMenu = spyOn(TestBed.inject(SidenavDrawerService), 'toggleDrawer');
    component.toggleMenu('menuDashboard');
    expect(spyMenu).toHaveBeenCalledOnceWith('menuDashboard');
  });

  it('should call method toggleMenu if clicked button close', () => {
    const spyMethod = spyOn(component, 'toggleMenu');
    const buttonClose = fixture.debugElement.nativeElement.querySelector(
      '#close-menu-dashboard'
    );
    expect(buttonClose).toBeTruthy();
    buttonClose.click();
    expect(spyMethod).toHaveBeenCalledOnceWith('menuDashboard');
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

  it('should show error message when fail request get name', () => {
    const OrganizationInfoShow =
      fixture.debugElement.nativeElement.querySelector('#info-organization');
    expect(OrganizationInfoShow).toBeTruthy();

    const showErrorHidden = fixture.debugElement.nativeElement.querySelector(
      '#failed-info-organization'
    );
    expect(showErrorHidden).toBeNull();

    component.failedGetOrganization = true;
    fixture.detectChanges();

    const OrganizationInfo =
      fixture.debugElement.nativeElement.querySelector('#info-organization');
    expect(OrganizationInfo).toBeNull();

    const showError = fixture.debugElement.nativeElement.querySelector(
      '#failed-info-organization'
    );
    expect(showError).toBeTruthy();
  });
});
