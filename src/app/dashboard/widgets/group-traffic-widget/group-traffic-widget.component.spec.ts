import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { GroupTrafficWidgetComponent } from './group-traffic-widget.component';
import { throwError } from 'rxjs';
import { StationService } from 'src/app/core/station.service';

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
        { provide: StationService, useClass: MockStationService },
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

  it('should call getGroupTrafficData', () => {
    const spyMethod = spyOn(component, 'getGroupTrafficData').and.callThrough();
    const spyGetGroupTrafficData = spyOn(
      TestBed.inject(StationService),
      'getGroupTrafficData'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyGetGroupTrafficData).toHaveBeenCalled();
  });

  it('should catch an error if the request getGroupTrafficData fails', () => {
    const spyError = spyOn(
      TestBed.inject(StationService),
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
