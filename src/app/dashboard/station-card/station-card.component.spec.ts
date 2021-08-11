import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { UserService } from 'src/app/core/user.service';
import { RosterComponent } from 'src/app/shared/roster/roster.component';
import { MockUserService } from 'src/mocks';

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
        RouterTestingModule,
        MatDialogModule,
        MatCardModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService }
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
        { userRithmId: '', firstName: 'Supervisor', lastName: 'User', isAssigned: false, email: 'supervisoruser@inpivota.com' },
        { userRithmId: '', firstName: 'Harry', lastName: 'Potter', isAssigned: false, email: 'harrypotter@inpivota.com' }
      ]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
