import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { StationMapElement } from 'src/helpers';
import { MockMapService } from 'src/mocks';
import { MapItemStatus, MapMode, StationInfoDrawerData } from 'src/models';
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
    component.searchStations();
    expect(component.filteredStations.length).toEqual(0);
  });

  it('should return filtered stations when search text is not empty', () => {
    component.searchText = 'untitled';
    component.searchStations();
    expect(component.filteredStations.length).toBeGreaterThanOrEqual(1);
  });

  it('should clear search box text', () => {
    const mapServiceSpy = spyOn(TestBed.inject(MapService), 'handleDrawerClose');
    component.clearSearchText();
    expect(component.searchText).toEqual('');
    expect(component.filteredStations.length).toEqual(0);
    expect(mapServiceSpy).toHaveBeenCalledWith('stationInfo');
  });

  it('should store Input search text', () => {
    component.onBlur();
    localStorage.setItem('placeHolderText', JSON.stringify(component.searchText));
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
    const mapServiceSpy = spyOn(TestBed.inject(MapService), 'centerStation');
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
    expect(component.filteredStations.length).toEqual(0);
    service.matMenuStatus$.subscribe((res) => expect(res).toBe(true));
    service.centerActive$.subscribe((res) => expect(res).toBe(true));
    service.centerStationCount$.subscribe((res) => expect(res).toBe(1));
    tick(1);
    expect(mapServiceSpy).toHaveBeenCalledWith(station, drawerWidth);
  }));
});
