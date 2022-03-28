import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupStationAdminComponent } from './user-group-station-admin.component';

describe('UserGroupStationAdminComponent', () => {
  let component: UserGroupStationAdminComponent;
  let fixture: ComponentFixture<UserGroupStationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserGroupStationAdminComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupStationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
