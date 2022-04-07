import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MockComponent } from 'ng-mocks';
import { StationListGroup, StationGroupData } from 'src/models';
import { ExpansionMemberGroupAdminComponent } from '../expansion-member-group-admin/expansion-member-group-admin.component';

import { UserGroupStationAdminComponent } from './user-group-station-admin.component';
import { MapService } from 'src/app/map/map.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockMapService } from 'src/mocks';
import { Router } from '@angular/router';

describe('UserGroupStationAdminComponent', () => {
  let component: UserGroupStationAdminComponent;
  let fixture: ComponentFixture<UserGroupStationAdminComponent>;

  const stations: StationListGroup = {
    rithmId: '123-321-456',
    name: 'station 1',
    workers: [
      {
        rithmId: '123-321-456',
        firstName: 'John',
        lastName: 'Wayne',
        email: 'name@company.com',
        isWorker: true,
        isOwner: true,
      },
    ],
    stationOwners: [
      {
        rithmId: '789-798-456',
        firstName: 'Peter',
        lastName: 'Doe',
        email: 'name1@company.com',
        isWorker: true,
        isOwner: true,
      },
    ],
  };

  const subStationGroups: StationGroupData = {
    rithmId: '1375027-78345-73824-54244',
    title: 'Sub Station Group',
    subStationGroups: [],
    stations: [],
    users: [
      {
        rithmId: '789-798-456',
        firstName: 'Noah',
        lastName: 'Smith',
        email: 'name2@company.com',
        isWorker: true,
        isOwner: true,
      },
    ],
    admins: [
      {
        rithmId: '159-753-456',
        firstName: 'Taylor',
        lastName: 'Du',
        email: 'name3@company.com',
        isWorker: true,
        isOwner: true,
      },
    ],
    isChained: true,
    isImplicitRootStationGroup: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UserGroupStationAdminComponent,
        MockComponent(ExpansionMemberGroupAdminComponent),
      ],
      imports: [MatExpansionModule, RouterTestingModule],
      providers: [{ provide: MapService, useClass: MockMapService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupStationAdminComponent);
    component = fixture.componentInstance;
    component.selectedItem = stations;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should  return true or false in isGroup', () => {
    const result = component.isGroup;
    expect(result).toBeFalse();
    component.selectedItem = subStationGroups;
    const result2 = component.isGroup;
    expect(result2).toBeTrue();
  });

  it('should  return nameElement when selectedItem is stations', () => {
    const result = component.nameElement;
    expect(result).toEqual(stations.name);
  });

  it('should  return nameElement when selectedItem is group stations', () => {
    component.selectedItem = subStationGroups;
    const result = component.nameElement;
    expect(result).toEqual(subStationGroups.title);
  });

  describe('Redirect to map', () => {
    let mapService: MapService;
    let router: Router;

    beforeEach(() => {
      mapService = TestBed.inject(MapService);
      router = TestBed.inject(Router);
    });

    it('should redirect to map and center station', () => {
      component.selectedItem = stations;
      const spyMethod = spyOn(component, 'goToStationOnMap').and.callThrough();
      const spySubjectCenter = spyOn(
        mapService.mapStationHelper.centerStationRithmId$,
        'next'
      );
      const spySubjectViewButton = spyOn(
        mapService.mapHelper.viewStationButtonClick$,
        'next'
      );
      const spyRouter = spyOn(router, 'navigateByUrl').and.callThrough();
      fixture.detectChanges();
      const btnRedirectToMap =
        fixture.debugElement.nativeElement.querySelector('#redirect-to-map');
      expect(btnRedirectToMap).toBeTruthy();
      btnRedirectToMap.click();

      expect(spySubjectCenter).toHaveBeenCalledOnceWith(stations.rithmId);
      expect(spySubjectViewButton).toHaveBeenCalledOnceWith(true);
      expect(spyRouter).toHaveBeenCalledOnceWith('/map');
      expect(spyMethod).toHaveBeenCalled();
    });

    it('should redirect to map and center stationGroup', () => {
      component.selectedItem = subStationGroups;
      const spyMethod = spyOn(component, 'goToStationOnMap').and.callThrough();
      const spySubjectCenter = spyOn(
        mapService.mapStationGroupHelper.centerStationGroupRithmId$,
        'next'
      );
      const spySubjectViewButton = spyOn(
        mapService.mapHelper.viewStationButtonClick$,
        'next'
      );
      const spyRouter = spyOn(router, 'navigateByUrl').and.callThrough();
      fixture.detectChanges();

      const btnRedirectToMap =
        fixture.debugElement.nativeElement.querySelector('#redirect-to-map');
      expect(btnRedirectToMap).toBeTruthy();
      btnRedirectToMap.click();

      expect(spySubjectCenter).toHaveBeenCalledOnceWith(
        subStationGroups.rithmId
      );
      expect(spySubjectViewButton).toHaveBeenCalledOnceWith(true);
      expect(spyMethod).toHaveBeenCalled();
      expect(spyRouter).toHaveBeenCalledOnceWith('/map');
    });
  });
});
