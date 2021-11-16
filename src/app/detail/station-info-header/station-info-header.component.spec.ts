import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/core/user.service';
import { MockUserService, MockStationService } from 'src/mocks';

import { StationInfoHeaderComponent } from './station-info-header.component';
import { StationService } from 'src/app/core/station.service';
import { StationInformation } from 'src/models/station-info';

describe('StationInfoHeaderComponent', () => {
  let component: StationInfoHeaderComponent;
  const stationInformation: StationInformation = {
    rithmId: 'E204F369-386F-4E41',
    name: 'stationName',
    instructions: '',
    nextStations: [{
      stationName: 'Development',
      totalDocuments: 5,
      isGenerator: true
    }],
    previousStations: [{
      stationName: 'Station-1',
      totalDocuments: 2,
      isGenerator: true
    }, {
      stationName: 'Station-2',
      totalDocuments: 0,
      isGenerator: false
    }],
    stationOwners: [{
      rithmId: '',
      firstName: 'Marry',
      lastName: 'Poppins',
      email: 'marrypoppins@inpivota.com',
      isWorker: false,
      isOwner: true
    }, {
      rithmId: '',
      firstName: 'Worker',
      lastName: 'User',
      email: 'workeruser@inpivota.com',
      isWorker: false,
      isOwner: true
    }],
    workers: [{
      rithmId: '',
      firstName: 'Harry',
      lastName: 'Potter',
      email: 'harrypotter@inpivota.com',
      isWorker: false,
      isOwner: false
    }, {
      rithmId: '',
      firstName: 'Supervisor',
      lastName: 'User',
      email: 'supervisoruser@inpivota.com',
      isWorker: true,
      isOwner: false
    }],
    createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
    createdDate: '2021-07-16T17:26:47.3506612Z',
    updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
    updatedDate: '2021-07-18T17:26:47.3506612Z',
    questions: [],
    priority: 2
  };
  let fixture: ComponentFixture<StationInfoHeaderComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoHeaderComponent,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: UserService, useClass: MockUserService },
        { provide: StationService, useClass: MockStationService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current station name', () => {
    component.stationInformation = stationInformation as StationInformation;
    expect(component.stationName).toEqual(stationInformation.name);
  });

  it('should display the priority of the station', () => {
    component.stationInformation = stationInformation;
    expect(component.priority).toEqual(stationInformation.priority);
  });
});
