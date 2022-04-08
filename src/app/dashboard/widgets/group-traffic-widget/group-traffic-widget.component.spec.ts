import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockDashboardService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

import { GroupTrafficWidgetComponent } from './group-traffic-widget.component';
import { throwError } from 'rxjs';

describe('GroupTrafficWidgetComponent', () => {
  let component: GroupTrafficWidgetComponent;
  let fixture: ComponentFixture<GroupTrafficWidgetComponent>;
  const dataWidget =
    '{"stationGroupRithmId":"4fb462ec-0772-49dc-8cfb-3849d70ad168"}';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupTrafficWidgetComponent],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTrafficWidgetComponent);
    component = fixture.componentInstance;
    component.dataWidget = dataWidget;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getGroupTrafficData in dashboard service', () => {
    const spyMethod = spyOn(component, 'getGroupTrafficData').and.callThrough();
    const spyGetGroupTrafficData = spyOn(
      TestBed.inject(DashboardService),
      'getGroupTrafficData'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyGetGroupTrafficData).toHaveBeenCalled();
  });

  it('should catch an error if the request getGroupTrafficData fails', () => {
    const spyError = spyOn(
      TestBed.inject(DashboardService),
      'getGroupTrafficData'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });
});
