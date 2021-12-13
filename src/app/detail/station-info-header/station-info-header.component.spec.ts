import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { MockStationService, MockUserService, MockErrorService } from 'src/mocks';
import { DocumentStationInformation, StationInfoDrawerData, StationInformation } from 'src/models';
import { StationInfoHeaderComponent } from './station-info-header.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorService } from 'src/app/core/error.service';

describe('StationInfoHeaderComponent', () => {
  let component: StationInfoHeaderComponent;
  let fixture: ComponentFixture<StationInfoHeaderComponent>;
  const stationInformation: StationInformation = {
    rithmId: 'E204F369-386F-4E41',
    name: 'Dry Goods & Liquids',
    instructions: '',
    nextStations: [{
      name: 'Development',
      rithmId: '147-852-369'
    }],
    previousStations: [{
      name: 'Station-1',
      rithmId: '963-258-741'
    }, {
      name: 'Station-2',
      rithmId: '753-951-842'
    }],
    stationOwners: [{
      rithmId: '',
      firstName: 'Marry',
      lastName: 'Poppins',
      email: 'marrypoppins@inpivota.com',
      isWorker: false,
      isOwner: true
    }, {
      rithmId: '',
      firstName: 'Worker',
      lastName: 'User',
      email: 'workeruser@inpivota.com',
      isWorker: false,
      isOwner: true
    }],
    workers: [{
      rithmId: '',
      firstName: 'Harry',
      lastName: 'Potter',
      email: 'harrypotter@inpivota.com',
      isWorker: false,
      isOwner: false
    }, {
      rithmId: '',
      firstName: 'Supervisor',
      lastName: 'User',
      email: 'supervisoruser@inpivota.com',
      isWorker: true,
      isOwner: false
    }],
    createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
    createdDate: '2021-07-16T17:26:47.3506612Z',
    updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
    updatedDate: '2021-07-18T17:26:47.3506612Z',
    questions: [],
    priority: 2
  };
  const documentStationInformation: DocumentStationInformation = {
    documentName: 'Metroid Dread',
    documentPriority: 5,
    documentRithmId: 'E204F369-386F-4E41',
    currentAssignedUser: 'NS',
    flowedTimeUTC: '1943827200000',
    lastUpdatedUTC: '1943827200000',
    stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
    stationName: 'Development',
    stationPriority: 2,
    stationInstruction: 'This is an instruction',
    stationOwners: [],
    workers: [],
    questions: [],
    instructions: 'General instructions'
  };
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoHeaderComponent,
      ],
      imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: UserService, useClass: MockUserService },
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoHeaderComponent);
    component = fixture.componentInstance;
    component.stationInformation = stationInformation;
    component.stationEditMode = true;
    formGroup = component.stationNameForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the station name from a StationInformation Object', () => {
    expect(component.stationName).toEqual(stationInformation.name);
  });

  it('should return the station priority from a StationInformation Object', () => {
    expect(component.priority).toBeTruthy();
    expect(component.priority).toEqual(stationInformation.priority);
  });

  it('should show/hide the station info drawer', () => {
    const drawerItem = 'stationInfo';
    formGroup.controls['name'].setValue('Station Name');
    const stationInfoDrawer: StationInfoDrawerData = {
      stationInformation: component.stationInformation as StationInformation,
      stationName: component.stationName,
      editMode: component.stationEditMode,
      openedFromMap: false
    };
    const infoDrawerSpy = spyOn(TestBed.inject(SidenavDrawerService), 'toggleDrawer');
    const stationSpy = spyOn(TestBed.inject(StationService), 'updatedStationNameText');

    component.toggleDrawer(drawerItem);
    expect(infoDrawerSpy).toHaveBeenCalledOnceWith(drawerItem, stationInfoDrawer);
    expect(stationSpy).toHaveBeenCalledWith(formGroup.controls['name'].value);
  });

  it('should update the name in station info drawer', () => {
    formGroup.controls['name'].setValue('Station Name');
    const updateStationNameSpy = spyOn(TestBed.inject(StationService),'updatedStationNameText');
    component.updateStationInfoDrawerName();
    expect(updateStationNameSpy).toHaveBeenCalledOnceWith(formGroup.controls['name'].value);
  });

  describe('StationInfoHeaderComponent with DocumentStationInformation model', () => {

    beforeEach(() => {
      component.stationInformation = documentStationInformation;
      fixture.detectChanges();
    });

    it('should return the station name from a DocumentStationInformation Object', () => {
      expect(component.stationName).toEqual(documentStationInformation.stationName);
    });

  });
});
