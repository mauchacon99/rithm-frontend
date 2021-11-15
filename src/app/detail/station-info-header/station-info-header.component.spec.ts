import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/core/user.service';
import { MockUserService } from 'src/mocks';

import { StationInfoHeaderComponent } from './station-info-header.component';
import { StationService } from '../../core/station.service';
import { StationInfoDrawerData } from 'src/models';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

describe('StationInfoHeaderComponent', () => {
  let component: StationInfoHeaderComponent;
  let fixture: ComponentFixture<StationInfoHeaderComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoHeaderComponent,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: UserService, useClass: MockUserService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the current station name', () => {
      expect(component.stationName).toEqual('Station 1');
    });

    it('should display the priority of the station', () => {
      expect(component.priority).toEqual(1);
    });

    it('should update the station info drawer name', () => {
      const currentStationName = 'Station 1';
      const stationNameSpy = spyOn(TestBed.inject(StationService), 'updatedStationNameText').and.callThrough();
      component.updStationInfoDrawerName();

      expect(stationNameSpy).toHaveBeenCalledOnceWith(currentStationName);
    });

    it('should display/hide the station info drawer in station', () => {
      const drawerItem = 'stationInfo';
      const dataInformation: StationInfoDrawerData = {
        stationInformation: {
          rithmId: 'E204F369-386F-4E41',
          name: 'Station Name',
          instructions: 'General instructions',
          nextStations: [{
            stationName: 'Development',
            totalDocuments: 5,
            isGenerator: true
          }],
          previousStations: [{
            stationName: 'Station-1',
            totalDocuments: 2,
            isGenerator: true
          }],
          stationOwners: [{
            rithmId: '',
            firstName: 'Marry',
            lastName: 'Poppins',
            email: 'marrypoppins@inpivota.com',
            isWorker: true,
            isOwner: false
          }],
          workers: [{
            rithmId: '',
            firstName: 'Harry',
            lastName: 'Potter',
            email: 'harrypotter@inpivota.com',
            isWorker: true,
            isOwner: false
          }],
          createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
          createdDate: '2021-07-16T17:26:47.3506612Z',
          updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
          updatedDate: '2021-07-18T17:26:47.3506612Z',
          questions: [],
          priority: 1,
        },
        stationName: 'Station 1',
        editMode: false,
      };
      const toogleDrawerSpy = spyOn(TestBed.inject(SidenavDrawerService), 'toggleDrawer');
      component.toggleDrawer(drawerItem);
      expect(toogleDrawerSpy).toHaveBeenCalledOnceWith(drawerItem, dataInformation);
    });
  });

});
