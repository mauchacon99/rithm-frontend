import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { MockErrorService, MockStationService, MockUserService } from 'src/mocks';

import { RosterManagementModalComponent } from './roster-management-modal.component';

describe('RosterManagementModalComponent', () => {
  let component: RosterManagementModalComponent;
  let fixture: ComponentFixture<RosterManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RosterManagementModalComponent],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: UserService, useClass: MockUserService }
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
});
