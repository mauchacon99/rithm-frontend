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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RosterComponent,
        MockComponent(UserAvatarComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        MatDialogModule
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
      ]
    })
      .compileComponents();
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
        isOwner: false
      },
      {
        rithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com',
        isWorker: true,
        isOwner: false
      }
    ];
    component.isWorker = true;
    component.stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
