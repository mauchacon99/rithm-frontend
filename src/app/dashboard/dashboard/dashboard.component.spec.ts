import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '../header/header.component';
import { PriorityQueueComponent } from '../priority-queue/priority-queue.component';
import { PreviouslyStartedDocumentsComponent } from '../previously-started-documents/previously-started-documents.component';
import { MyStationsComponent } from '../my-stations/my-stations.component';
import { StationService } from 'src/app/core/station.service';
import {
  MockErrorService,
  MockStationService,
  MockUserService,
  MockDashboardService,
} from 'src/mocks';
import { UserService } from 'src/app/core/user.service';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { DashboardService } from '../dashboard.service';
import { throwError } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        MockComponent(HeaderComponent),
        MockComponent(PriorityQueueComponent),
        MockComponent(PreviouslyStartedDocumentsComponent),
        MockComponent(MyStationsComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SplitService },
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service from return data widgets', () => {
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getDashboardWidgets'
    ).and.callThrough();

    component.ngOnInit();

    expect(spyService).toHaveBeenCalled();
  });

  it('should catch error if petition to service fails', () => {
    spyOn(
      TestBed.inject(DashboardService),
      'getDashboardWidgets'
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

  it('should show error message when request for station widgets', () => {
    spyOn(
      TestBed.inject(DashboardComponent),
      'getDashboardWidgets'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    fixture.detectChanges();
    expect(component.errorLoadingWidgets).toBeTrue();
    const errorComponent = fixture.debugElement.nativeElement.querySelector(
      '#error-loading-widgets'
    );
    expect(errorComponent).toBeTruthy();
  });
});
