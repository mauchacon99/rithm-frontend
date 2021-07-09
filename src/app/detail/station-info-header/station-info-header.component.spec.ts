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
      documentName: 'Requirement',
      documentPriority: 1,
      currentAssignedUser: 'WU',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationName: 'Development',
      stationPriority: 2,
      supervisorRoster: ['MP', 'RU', 'HP'],
      workerRoster: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
