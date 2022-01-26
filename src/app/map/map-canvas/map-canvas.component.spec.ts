import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockMapService, MockPopupService } from 'src/mocks';
import { MapItemStatus, MapMode } from 'src/models';
import { MapService } from '../map.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MapCanvasComponent } from './map-canvas.component';
import { PopupService } from 'src/app/core/popup.service';
import { StationGroupMapElement, StationMapElement } from 'src/helpers';

describe('MapCanvasComponent', () => {
  let component: MapCanvasComponent;
  let fixture: ComponentFixture<MapCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapCanvasComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: MapService, useClass: MockMapService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should add a new station to the stations array', () => {
    //TODO: get this test working.
    const stationsLength = component.stations.length;

    //nothing should happen.
    window.dispatchEvent(new Event('click'));
    expect(component.stations.length).toEqual(stationsLength);

    //should add a station.
    component.mapMode = MapMode.StationAdd;
    window.dispatchEvent(new Event('click'));
    expect(component.stations.length).toEqual(stationsLength + 1);
  });

  xit('should move the map', () => {
    //TODO: get this working.
  });

  xit('should move a station', () => {
    //TODO: get this working.
  });

  it('should set the drag on the stations in the station group.', () => {
    const stationGroups = [
      new StationGroupMapElement({
        isReadOnlyRootStationGroup: false,
        rithmId: '6BB87093-B9B9-4A96-9696-5F0CC31382EA',
        stations: [
          '247cf568-27a4-4968-9338-046ccfee24f3',
          '4eca65f1-89ef-4970-8aa5-8a26a5e45628',
        ],
        status: MapItemStatus.Normal,
        subStationGroups: [],
        title: 'RithmGroup',
      }),
    ];

    const stations = [
      new StationMapElement({
        mapPoint: { x: 100, y: 250 },
        nextStations: ['3813442c-82c6-4035-893a-86fa9deca7c4'],
        noOfDocuments: 7,
        previousStations: [],
        rithmId: '247cf568-27a4-4968-9338-046ccfee24f3',
        stationName: 'Step 1 Hola Mundo',
        status: MapItemStatus.Normal,
        notes: '',
      }),
      new StationMapElement({
        mapPoint: { x: 500, y: 250 },
        nextStations: [
          '73d47261-1932-4fcf-82bd-159eb1a7243f',
          '48298bf8-a590-4943-9478-602226daf7c1',
        ],
        noOfDocuments: 2,
        notes: '',
        previousStations: [
          '3813442c-82c6-4035-893a-86fa9deca7c4',
          '67393fae-5e8b-4067-b004-d888be7a2ef5',
        ],
        rithmId: '4eca65f1-89ef-4970-8aa5-8a26a5e45628',
        stationName: 'Step 3',
        status: MapItemStatus.Normal,
      }),
      new StationMapElement({
        mapPoint: { x: 300, y: 250 },
        nextStations: ['4eca65f1-89ef-4970-8aa5-8a26a5e45628'],
        noOfDocuments: 21,
        notes: '',
        previousStations: ['247cf568-27a4-4968-9338-046ccfee24f3'],
        rithmId: '3813442c-82c6-4035-893a-86fa9deca7c4',
        stationName: 'New Test Station Name',
        status: MapItemStatus.Normal,
      }),
    ];

    component.stationGroups = stationGroups;
    component.stations = stations;
    component.stationGroups[0].dragging = true;
    component.setDraggingStationGroup();

    component.stationGroups[0].stations.forEach((stationId) => {
      const stationIndex = component.stations.findIndex(
        (station) => station.rithmId === stationId
      );
      expect(component.stations[stationIndex].dragging).toBeTruthy();
    });
  });
});
