import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { RosterComponent } from 'src/app/shared/roster/roster.component';

import { StationInfoHeaderComponent } from './station-info-header.component';

describe('StationInfoHeaderComponent', () => {
  let component: StationInfoHeaderComponent;
  let fixture: ComponentFixture<StationInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoHeaderComponent,
        MockComponent(RosterComponent)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoHeaderComponent);
    component = fixture.componentInstance;
    component.stationInformation = {
      documentName: 'Metroid Dread',
      documentPriority: 5,
      documentRithmId:'E204F369-386F-4E41',
      currentAssignedUser: 'NS',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      stationName: 'Development',
      stationPriority: 2,
      stationInstruction: 'This is an instruction',
      numberOfSupervisors: 7,
      supervisorRoster: [],
      numberOfWorkers: 7,
      workerRoster: [],
      questions: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
