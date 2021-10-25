import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterManagementModalComponent } from './roster-management-modal.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { MockComponent } from 'ng-mocks';

describe('RosterManagementModalComponent', () => {
  let component: RosterManagementModalComponent;
  let fixture: ComponentFixture<RosterManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosterManagementModalComponent,
        MockComponent(UserAvatarComponent)
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
