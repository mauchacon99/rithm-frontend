import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

import { RosterComponent } from './roster.component';

describe('RosterComponent', () => {
  let component: RosterComponent;
  let fixture: ComponentFixture<RosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RosterComponent,
        MockComponent(UserAvatarComponent)
      ],
      imports: [
        MatDialogModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterComponent);
    component = fixture.componentInstance;
    component.rosterSize = 7;
    component.rosterMembers = [
      { userRithmId: '', firstName: 'Worker', lastName: 'User', isAssigned: false, email: 'workeruser@inpivota.com' },
      { userRithmId: '', firstName: 'Harry', lastName: 'Potter', isAssigned: false, email: 'harrypotter@inpivota.com' }
    ];
    component.isWorker = true;
    component.stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      component.stationName = 'Samus Returns',
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
