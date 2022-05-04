import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { MockStationService, MockErrorService, MockUserService, MockOrganizationService } from 'src/mocks';
import { User } from 'src/models';

import { UserListModalComponent } from './user-list-modal.component';

const DATA_TEST = 'E204F369-386F-4E41';
const USER: User = {
  rithmId: "B5702D6F-0C35-4EB2-9062-C895E22EAEEF",
  firstName: "admin",
  lastName: "user",
  email: "rithmadmin@inpivota.com",
  role: "admin",
  isEmailVerified: true,
  notificationSettings: null,
  organization: "kdjfkd-kjdkfjd-jkjdfkdjk",
  profileImageId: "CC792DCD-26C7-4856-A8E6-2191A7DAECA5",
  createdDate: ''
};

describe('UserListModalComponent', () => {
  let component: UserListModalComponent;
  let fixture: ComponentFixture<UserListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: DATA_TEST },
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: UserService, useClass: MockUserService },
        { provide: OrganizationService, useClass: MockOrganizationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListModalComponent);
    component = fixture.componentInstance;
    component.stationRithmId = DATA_TEST;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when close-modal-btn clicked', () => {
    const spyMatDialogRef = spyOn(TestBed.inject(MatDialogRef), 'close');
    const spyMethod = spyOn(component, 'closeModal').and.callThrough();
    const btnClose = fixture.nativeElement.querySelector('#close-modal-btn');
    expect(btnClose).toBeTruthy();
    btnClose.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyMatDialogRef).toHaveBeenCalled();
  });

  it('should call getAllowAllOrgWorkers within the ngOnInit', () => {
    const spyStationAllowOrg = spyOn( TestBed.inject(StationService), 'getAllowAllOrgWorkers').and.callThrough();
    component.ngOnInit();
    expect(spyStationAllowOrg).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  it('should call getStationAllRoster if allowAllOrgWorkers is false', () => {
    spyOn( TestBed.inject(StationService), 'getAllowAllOrgWorkers').and.returnValue(of(false));
    const spyStationAllRoster = spyOn( TestBed.inject(StationService), 'getStationAllRoster').and.callThrough();
    component.ngOnInit();
    expect(spyStationAllRoster).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  it('should call getOrganizationUsers if allowAllOrgWorkers is true', () => {
    spyOn( TestBed.inject(StationService), 'getAllowAllOrgWorkers').and.returnValue(of(true));
    const spyOrganizationUsers = spyOn( TestBed.inject(OrganizationService), 'getUsersForOrganization').and.callThrough();
    component.ngOnInit();
    expect(spyOrganizationUsers).toHaveBeenCalledOnceWith(USER.organization, 1);
  });
});
