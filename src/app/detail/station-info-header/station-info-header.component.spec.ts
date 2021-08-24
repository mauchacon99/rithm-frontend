import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { UserService } from 'src/app/core/user.service';
import { RosterComponent } from 'src/app/shared/roster/roster.component';
import { MockUserService } from 'src/mocks';

import { StationInfoHeaderComponent } from './station-info-header.component';

describe('StationInfoHeaderComponent', () => {
  let component: StationInfoHeaderComponent;
  let fixture: ComponentFixture<StationInfoHeaderComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoHeaderComponent,
        MockComponent(RosterComponent)
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: UserService, useValue: MockUserService }
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
      stationId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      stationName: 'Development',
      stationPriority: 2,
      stationInstruction: 'This is an instruction',
      numberOfSupervisors: 7,
      supervisors: [],
      numberOfWorkers: 7,
      workers: [],
      questions: []
    };
    fixture.detectChanges();

    it('should create', () => {
      expect(component.user).toBeDefined();
      expect(component).toBeTruthy();
    });
  });

});
