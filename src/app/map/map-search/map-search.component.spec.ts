import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { StationGroupMapElement, StationMapElement } from 'src/helpers';
import { MockMapService } from 'src/mocks';
import {
  CenterPanType,
  MapItemStatus,
  MapMode,
  StationInfoDrawerData,
} from 'src/models';
import { MapService } from '../map.service';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MapSearchComponent } from './map-search.component';
import { FormBuilder, FormsModule } from '@angular/forms';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationService } from 'src/app/core/station.service';

describe('MapSearchComponent', () => {
  let component: MapSearchComponent;
  let fixture: ComponentFixture<MapSearchComponent>;
  const formBuilder = new FormBuilder();
  let service: MapService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapSearchComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        NoopAnimationsModule,
        MatInputModule,
        MatAutocompleteModule,
      ],
      providers: [
        { provide: MapService, useClass: MockMapService },
        { provide: FormBuilder, useValue: formBuilder },
      ],
    }).compileComponents();
    service = TestBed.inject(MapService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display station or group name when a station is selected', () => {
    const station = new StationMapElement({
      rithmId: '',
      stationName: 'Untitled Station',
      mapPoint: {
        x: 12,
        y: 15,
      },
      noOfDocuments: 0,
      previousStations: [],
      nextStations: [],
      status: MapItemStatus.Created,
      notes: '',
    });
    const result = component.displayStationName(station);
    expect(result).toEqual(station.stationName);
  });

  it('should return 0 stations when search text is empty', () => {
    component.searchText = '';
    component.searchStationsStationGroups();
    expect(component.filteredStationsStationGroups.length).toEqual(0);
  });

  it('should return filtered stations when search text is not empty', () => {
    component.searchText = 'untitled';
    component.searchStationsStationGroups();
    expect(
      component.filteredStationsStationGroups.length
    ).toBeGreaterThanOrEqual(1);
  });

  it('should clear search box text', () => {
    const mapServiceSpy = spyOn(
      TestBed.inject(MapService),
      'handleDrawerClose'
    );
    component.clearSearchText();
    expect(component.searchText).toEqual('');
    expect(component.filteredStationsStationGroups.length).toEqual(0);
    expect(mapServiceSpy).toHaveBeenCalled();
  });

  it('should store Input search text', () => {
    component.onBlur();
    localStorage.setItem(
      'placeHolderText',
      JSON.stringify(component.searchText)
    );
    expect(component.searchInput).toBeFalse();
  });

  it('should returns to current search text & close the infoDrawer', () => {
    component.returnSearchText();
    expect(component.searchInput).toBeTrue();
    expect(component.searchText).toEqual(component.placeHolderText);
  });

  it('should open drawer when any autocomplete option is selected', fakeAsync(() => {
    const sideNavSpy = spyOn(
      TestBed.inject(SidenavDrawerService),
      'openDrawer'
    );
    const stationServiceSpy = spyOn(
      TestBed.inject(StationService),
      'updatedStationNameText'
    );
    const mapServiceSpy = spyOn(TestBed.inject(MapService), 'center');
    const station = new StationMapElement({
      rithmId: '',
      stationName: 'Untitled Station',
      mapPoint: {
        x: 12,
        y: 15,
      },
      noOfDocuments: 0,
      previousStations: [],
      nextStations: [],
      status: MapItemStatus.Normal,
      notes: '',
    });
    const dataInfoDrawer: StationInfoDrawerData = {
      stationRithmId: '',
      stationName: 'Untitled Station',
      editMode: true,
      stationStatus: MapItemStatus.Normal,
      mapMode: MapMode.Build,
      openedFromMap: true,
      notes: '',
    };
    const drawerWidth = 0;
    component.openDrawer(station);
    expect(sideNavSpy).toHaveBeenCalledWith('stationInfo', dataInfoDrawer);
    expect(stationServiceSpy).toHaveBeenCalledWith(dataInfoDrawer.stationName);
    expect(station.drawerOpened).toBeTrue();
    expect(component.searchText).toEqual('');
    expect(component.filteredStationsStationGroups.length).toEqual(0);
    service.matMenuStatus$.subscribe((res) => expect(res).toBe(true));
    service.centerActive$.subscribe((res) => expect(res).toBe(true));
    service.centerCount$.subscribe((res) => expect(res).toBe(1));
    tick(1);
    expect(mapServiceSpy).toHaveBeenCalledWith(
      CenterPanType.Station,
      drawerWidth
    );
  }));

  it('should distinguish between element types', () => {
    const station = new StationMapElement({
      rithmId: '',
      stationName: 'Untitled Station',
      mapPoint: {
        x: 12,
        y: 15,
      },
      noOfDocuments: 0,
      previousStations: [],
      nextStations: [],
      status: MapItemStatus.Normal,
      notes: '',
    });

    const group = new StationGroupMapElement({
      rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
      title: ' Sub RithmGroup',
      organizationRithmId: '',
      stations: [
        'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
        'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
        'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
      ],
      subStationGroups: [],
      status: MapItemStatus.Normal,
      isReadOnlyRootStationGroup: false,
      isChained: false,
    });

    expect(component.isStation(station)).toBeTrue();
    expect(component.optionTitle).toEqual(station.stationName);
    expect(component.isStation(group)).toBeFalse();
    expect(component.optionTitle).toEqual(group.title);
  });

  it('should toggle mobileSearchOpen', () => {
    component.toggleMobileSearch();
    expect(component.mobileSearchOpen).toBeTrue();
    component.toggleMobileSearch();
    expect(component.mobileSearchOpen).toBeFalse();
  });

  it('should call open drawer', () => {
    spyOn(component, 'toggleMobileSearch');
    spyOn(component, 'openDrawer');

    const station = new StationMapElement({
      rithmId: '',
      stationName: 'Untitled Station',
      mapPoint: {
        x: 12,
        y: 15,
      },
      noOfDocuments: 0,
      previousStations: [],
      nextStations: [],
      status: MapItemStatus.Normal,
      notes: '',
    });

    component.openDrawerMobileSearch(station);
    expect(component.toggleMobileSearch).toHaveBeenCalled();
    expect(component.openDrawer).toHaveBeenCalled();
  });

  it('should call clearSearchText', () => {
    spyOn(component, 'toggleMobileSearch');
    spyOn(component, 'clearSearchText');

    component.closeMobileSearch();
    expect(component.toggleMobileSearch).toHaveBeenCalled();
    expect(component.clearSearchText).toHaveBeenCalled();
  });
});
