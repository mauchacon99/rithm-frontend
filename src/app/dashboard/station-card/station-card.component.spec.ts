import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { RosterComponent } from 'src/app/shared/roster/roster.component';

import { StationCardComponent } from './station-card.component';

describe('StationCardComponent', () => {
  let component: StationCardComponent;
  let fixture: ComponentFixture<StationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationCardComponent,
        MockComponent(RosterComponent)
      ],
      imports: [
        MatDialogModule,
        MatCardModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationCardComponent);
    component = fixture.componentInstance;
    component.station = {
      rithmId: '2',
      numberOfDocuments: 2,
      stationName: 'station-2',
      numberOfWorkers: 6,
      worker: [
        {
          rithmId: '',
          firstName: 'Supervisor',
          lastName: 'User',
          isAssigned: false,
          email: 'supervisoruser@inpivota.com',
          isWorker: true,
          isOwner: false
        },
        {
          rithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          isAssigned: false,
          email: 'harrypotter@inpivota.com',
          isWorker: true,
          isOwner: false
        }
      ]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
