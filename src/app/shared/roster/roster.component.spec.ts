import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockStationService, MockErrorService } from 'src/mocks';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { RosterComponent } from './roster.component';

describe('RosterComponent', () => {
  let component: RosterComponent;
  let fixture: ComponentFixture<RosterComponent>;
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RosterComponent,
        MockComponent(UserAvatarComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [MatDialogModule],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterComponent);
    component = fixture.componentInstance;
    component.rosterMembers = [
      {
        rithmId: '',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isWorker: true,
        isOwner: false,
      },
      {
        rithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com',
        isWorker: true,
        isOwner: false,
      },
    ];
    component.isWorker = true;
    component.stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a loading indicator when calling getStationRoster method', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.loadingRoster).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#loading-roster-indicator'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should return the station owners roster members', () => {
    const rosterSpy = spyOn(
      TestBed.inject(StationService),
      'getStationOwnerRoster'
    ).and.callThrough();
    component.isWorker = false;
    component.ngOnInit();
    expect(rosterSpy).toHaveBeenCalledOnceWith(stationId);
  });

  it('should return the station workers roster members', () => {
    const rosterSpy = spyOn(
      TestBed.inject(StationService),
      'getStationWorkerRoster'
    ).and.callThrough();
    component.isWorker = true;
    component.ngOnInit();
    expect(rosterSpy).toHaveBeenCalledOnceWith(stationId);
  });
});
