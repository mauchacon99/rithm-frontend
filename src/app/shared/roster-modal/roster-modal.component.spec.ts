import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupService } from 'src/app/core/popup.service';
import { StationService } from 'src/app/core/station.service';
import { MockPopupService, MockStationService } from 'src/mocks';
import { DialogData } from 'src/models';
import { RosterModalComponent } from './roster-modal.component';

const DIALOG_TEST_DATA: DialogData = {
  title: 'Roster',
  message: 'This is an example alert used for testing.',
  okButtonText: 'Understood',
  cancelButtonText: 'Cancel'
};

describe('RosterModalComponent', () => {
  let component: RosterModalComponent;
  let fixture: ComponentFixture<RosterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosterModalComponent ],
      imports: [],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: StationService, useClass: MockStationService },
        { provide: PopupService, useClass: MockPopupService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return worker roster list', () => {
    expect(component.users).toBeGreaterThanOrEqual(0);
  });
});
