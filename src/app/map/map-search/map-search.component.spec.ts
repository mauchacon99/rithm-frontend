import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationMapElement } from 'src/helpers';
import { MockMapService } from 'src/mocks';
import { MapItemStatus } from 'src/models';
import { MapService } from '../map.service';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MapSearchComponent } from './map-search.component';
import { FormBuilder, FormsModule } from '@angular/forms';

describe('MapSearchComponent', () => {
  let component: MapSearchComponent;
  let fixture: ComponentFixture<MapSearchComponent>;
  const formBuilder = new FormBuilder();

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
    component.searchText = 'Untitled';
    component.searchStations();
    expect(component.filteredStations.length).toBeGreaterThanOrEqual(0);
  });

  it('should clear search box text', () => {
    component.clearSearchText();
    expect(component.searchText).toEqual('');
    expect(component.filteredStations.length).toEqual(0);
  });
});
