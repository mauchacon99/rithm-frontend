import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { RosterComponent } from './roster.component';

describe('RosterComponent', () => {
  let component: RosterComponent;
  let fixture: ComponentFixture<RosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosterComponent ],
      imports: [
        MatDialogModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterComponent);
    component = fixture.componentInstance;
    component.station = {
      rithmId: '2',
      numberOfDocuments: 2,
      stationName: 'station-2',
      numberOfWorkers: 6,
      workerInitials: [
        'XR', 'PD'
      ]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
