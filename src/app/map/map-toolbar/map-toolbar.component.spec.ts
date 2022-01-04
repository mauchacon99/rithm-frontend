import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { UserService } from 'src/app/core/user.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockErrorService, MockMapService, MockOrganizationService, MockUserService } from 'src/mocks';
import { MapMode } from 'src/models';
import { MapService } from '../map.service';

import { MapToolbarComponent } from './map-toolbar.component';

describe('MapToolbarComponent', () => {
  let component: MapToolbarComponent;
  let fixture: ComponentFixture<MapToolbarComponent>;
  let service: MapService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MapToolbarComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: OrganizationService, useClass: MockOrganizationService },
        { provide: MapService, useClass: MockMapService }
      ]
    }).compileComponents();
    service = TestBed.inject(MapService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle mapMode add station', () => {
    const mapServiceSpy = spyOn(TestBed.inject(MapService), 'disableConnectedStationMode');
    component.addStation();
    expect(component.stationAddActive).toBeTrue();
    expect(component.mapMode).toEqual(MapMode.StationAdd);
    component.addStation();
    expect(component.stationAddActive).toBeFalse();
    expect(component.mapMode).toEqual(MapMode.Build);
    const connectedStationMode = service.stationElements.some(st => st.isAddingConnected);
    expect(connectedStationMode).toBeTrue();
    expect(mapServiceSpy).toHaveBeenCalled();
    service.mapDataReceived$.subscribe(res => expect(res).toBe(true));
  });

  it('should toggle mapMode add flow', () => {
    component.addFlow();
    expect(component.flowAddActive).toBeTrue();
    expect(component.mapMode).toEqual(MapMode.StationGroupAdd);
    component.addFlow();
    expect(component.flowAddActive).toBeFalse();
    expect(component.mapMode).toEqual(MapMode.Build);
  });
});
