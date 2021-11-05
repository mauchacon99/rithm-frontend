import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';

import { RosterManagementModalComponent } from './roster-management-modal.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { MockComponent } from 'ng-mocks';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';

const DIALOG_TEST_DATA: {/** The station rithmId. */ stationId: string } = {
  stationId: 'jk34jk34jk34'
};

describe('RosterManagementModalComponent', () => {
  let component: RosterManagementModalComponent;
  let fixture: ComponentFixture<RosterManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RosterManagementModalComponent,
        MockComponent(UserAvatarComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if you have error when adding or removing station worker', () => {
    const rithmId = '12434567';
    component.addingStationRosterError = false;
    component.removingStationRosterError = true;
    component.lastRithmIdPerformed = rithmId;
    const errorToWorker = component.checkErrorMessageStationWorker(rithmId);
    expect(errorToWorker).toEqual(true);
  });

  it('should return false if you have error when adding or removing station worker', () => {
    const rithmId = '12434567';
    component.addingStationRosterError = false;
    component.removingStationRosterError = true;
    component.lastRithmIdPerformed = rithmId+1;
    const errorToWorker = component.checkErrorMessageStationWorker(rithmId);
    expect(errorToWorker).toEqual(false);
  });

});
