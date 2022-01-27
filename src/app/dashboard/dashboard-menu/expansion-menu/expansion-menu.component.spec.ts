import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ExpansionMenuComponent } from './expansion-menu.component';
import { MockComponent } from 'ng-mocks';
import { OptionsMenuComponent } from '../options-menu/options-menu.component';
import { ErrorService } from 'src/app/core/error.service';
import { MockDashboardService, MockErrorService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { RoleDashboardMenu } from 'src/models';
import { throwError } from 'rxjs';

describe('ExpansionMenuComponent', () => {
  let component: ExpansionMenuComponent;
  let fixture: ComponentFixture<ExpansionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExpansionMenuComponent,
        MockComponent(OptionsMenuComponent),
      ],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
      imports: [MatExpansionModule, MatListModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should returns the organization`s dashboard list', () => {
    component.dashboardRole = RoleDashboardMenu.OrganizationDashboard;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getOrganizationDashboard'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith();
  });

  it('should catch an error if the request to obtain the organization`s list of dashboards fails', () => {
    component.dashboardRole = RoleDashboardMenu.OrganizationDashboard;
    spyOn(
      TestBed.inject(DashboardService),
      'getOrganizationDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });

  it('should returns user`s customized dashboards', () => {
    component.dashboardRole = RoleDashboardMenu.PersonalDashboard;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getPersonalDashboard'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith();
  });

  it('should catch an error if the request to get user`s customized dashboard fails', () => {
    component.dashboardRole = RoleDashboardMenu.PersonalDashboard;
    spyOn(
      TestBed.inject(DashboardService),
      'getPersonalDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });
});
