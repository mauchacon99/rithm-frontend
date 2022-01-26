import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ExpansionMenuComponent } from './expansion-menu.component';
import { MockComponent } from 'ng-mocks';
import { OptionsMenuComponent } from '../options-menu/options-menu.component';
import { ErrorService } from 'src/app/core/error.service';
import { MockDashboardService, MockErrorService } from 'src/mocks';
import { DashboardService } from '../../dashboard.service';
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

  it('should return dashboards for organization', () => {
    component.dashboardRole = RoleDashboardMenu.DashboardOrganization;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getDashboardOrganization'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith();
  });

  it('should catch error if petition return dashboard for organization is fail', () => {
    component.dashboardRole = RoleDashboardMenu.DashboardOrganization;
    spyOn(
      TestBed.inject(DashboardService),
      'getDashboardOrganization'
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

  it('should return dashboards how user', () => {
    component.dashboardRole = RoleDashboardMenu.DashboardPersonal;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getDashboardPersonal'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith();
  });

  it('should catch error if petition return dashboard how user is fail', () => {
    component.dashboardRole = RoleDashboardMenu.DashboardPersonal;
    spyOn(
      TestBed.inject(DashboardService),
      'getDashboardPersonal'
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
