import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockMapService, MockPopupService } from 'src/mocks';
import {
  MapItemStatus,
  MapMode,
  Point,
  StationGroupElementHoverItem,
} from 'src/models';
import { MapService } from '../map.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MapCanvasComponent } from './map-canvas.component';
import { PopupService } from 'src/app/core/popup.service';
import { StationGroupMapElement, StationMapElement } from 'src/helpers';
import { DEFAULT_SCALE } from '../map-constants';

describe('MapCanvasComponent', () => {
  let component: MapCanvasComponent;
  let fixture: ComponentFixture<MapCanvasComponent>;
  let service: MapService;

  const stationGroupAddGroups = [
    {
      boundaryPoints: [
        {
          x: -164.85872329855573,
          y: 306.0491896659986,
        },
        {
          x: -164.85872329855573,
          y: 306.0491896659986,
        },
      ],
      dragging: false,
      disabled: false,
      selected: false,
      hoverItem: 'none',
      rithmId: '6BB87093-B9B9-4A96-9696-5F0CC31382EB',
      title: 'RithmGroup',
      organizationRithmId: '7D9854CF-1070-4F4C-81C1-7ACD433A2EE1',
      stations: ['6D8976EF-F9A2-40E3-957E-CAAAE2AA2DA8'],
      subStationGroups: ['6BB87093-B9B9-4A96-9696-5F0CC31382EA'],
      isReadOnlyRootStationGroup: true,
      status: 3,
      isChained: false,
      path: {},
    },
    {
      boundaryPoints: [
        {
          x: 61.63740387995753,
          y: 236.68595642892657,
        },
        {
          x: 126.74904432445813,
          y: 313.8350430060239,
        },
        {
          x: 268.4626147036653,
          y: 412.87039527875163,
        },
        {
          x: 377.8939431818175,
          y: 412.87039527875163,
        },
        {
          x: 509.7586939979909,
          y: 295.23171716473803,
        },
        {
          x: 509.7586939979909,
          y: 213.15822080612384,
        },
        {
          x: 428.7795109241583,
          y: 20.5590826845759,
        },
        {
          x: 319.3481824460061,
          y: 20.5590826845759,
        },
        {
          x: 152.4654065168239,
          y: 52.8413245856308,
        },
        {
          x: 61.63740387995753,
          y: 154.61246007031238,
        },
      ],
      dragging: false,
      disabled: false,
      selected: false,
      hoverItem: 'boundary',
      rithmId: '6BB87093-B9B9-4A96-9696-5F0CC31382EA',
      title: 'RithmGroup',
      organizationRithmId: '7D9854CF-1070-4F4C-81C1-7ACD433A2EE1',
      stations: ['247cf568-27a4-4968-9338-046ccfee24f3'],
      subStationGroups: ['24b9accd-5d1c-4292-a723-a3f2ca80ceed'],
      isReadOnlyRootStationGroup: false,
      status: 3,
      isChained: false,
      path: {},
    },
    {
      boundaryPoints: [
        {
          x: 599.5191061213377,
          y: 310.9735994475154,
        },
        {
          x: 762.0246289113937,
          y: 371.1608301104991,
        },
        {
          x: 926.1716216286223,
          y: 371.1608301104991,
        },
        {
          x: 926.1716216286223,
          y: 212.4854038171784,
        },
        {
          x: 762.0246289113937,
          y: 212.4854038171784,
        },
        {
          x: 599.5191061213377,
          y: 228.90010308890126,
        },
      ],
      dragging: false,
      disabled: false,
      selected: false,
      hoverItem: 'none',
      rithmId: '24b9accd-5d1c-4292-a723-a3f2ca80ceed',
      title: 'SubRithmFlow',
      organizationRithmId: '7D9854CF-1070-4F4C-81C1-7ACD433A2EE1',
      stations: ['6D8976EF-F9A2-40E3-957E-CAAAE2AA2DA8'],
      subStationGroups: [],
      isReadOnlyRootStationGroup: false,
      status: 3,
      path: {},
      isChained: false,
    },
  ];

  const stationGroupAddStations = [
    {
      canvasPoint: {
        x: 661.5835290871864,
        y: 196.24212562782168,
      },
      dragging: false,
      hoverItem: 'station',
      isAddingConnected: false,
      disabled: false,
      selected: false,
      drawerOpened: false,
      rithmId: 'efe04642-37bf-4264-b303-ccd051ff0a0c',
      status: 3,
      stationName: 'Flow Test 4',
      noOfDocuments: 4,
      mapPoint: {
        x: 720,
        y: -1076,
      },
      previousStations: [],
      nextStations: [],
      notes: '',
      isRestricted: true,
    },
    {
      canvasPoint: {
        x: 1799.6693452599698,
        y: -176.91870448267747,
      },
      dragging: false,
      hoverItem: 'none',
      isAddingConnected: false,
      disabled: false,
      selected: false,
      drawerOpened: false,
      rithmId: '8b3b1a78-d66d-4b8b-a20d-0e925a45f3fe',
      status: 3,
      stationName: 'Vanessa FLOW / Candidate review',
      noOfDocuments: 2,
      mapPoint: {
        x: 2800,
        y: -1758,
      },
      previousStations: [],
      nextStations: [],
      notes: '',
      isRestricted: true,
    },
  ];

  const stationGroups = [
    new StationGroupMapElement({
      isReadOnlyRootStationGroup: false,
      rithmId: '6BB87093-B9B9-4A96-9696-5F0CC31382EA',
      stations: [
        '247cf568-27a4-4968-9338-046ccfee24f3',
        '4eca65f1-89ef-4970-8aa5-8a26a5e45628',
      ],
      status: MapItemStatus.Normal,
      subStationGroups: ['24b9accd-5d1c-4292-a723-a3f2ca80ceed'],
      title: 'RithmGroup',
      isChained: false,
    }),
    new StationGroupMapElement({
      isReadOnlyRootStationGroup: false,
      rithmId: '24b9accd-5d1c-4292-a723-a3f2ca80ceed',
      stations: ['6D8976EF-F9A2-40E3-957E-CAAAE2AA2DA8'],
      status: MapItemStatus.Normal,
      subStationGroups: [],
      title: 'SubRithmFlow',
      isChained: false,
    }),
    new StationGroupMapElement({
      isReadOnlyRootStationGroup: false,
      rithmId: '9724A1FB-426D-4826-8FF2-F0752979155E',
      stations: [
        '6B6CEFB1-C1C0-4516-86BD-271E5A4E825B',
        'A0E85C0C-3957-4DF5-8364-8A044ED5B44D',
        '82670F79-8662-48F9-9DF4-2BD29E85B803',
        '6DEDBFB6-B462-47E3-AB68-F7B006CD55C1',
        'A7E49099-76A5-4D7C-8A25-D54378C3490F',
        'C2D2C042-272D-43D9-96C4-BA791612273F',
      ],
      status: MapItemStatus.Normal,
      subStationGroups: [],
      title: 'Add New Employee Group',
      isChained: false,
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
    new StationMapElement({
      mapPoint: { x: 1096, y: 318 },
      nextStations: [],
      noOfDocuments: 4,
      notes: '',
      previousStations: ['3a97bead-e698-45ea-a1d9-51f4513a909a'],
      rithmId: '6D8976EF-F9A2-40E3-957E-CAAAE2AA2DA8',
      stationName: 'Step 6',
      status: 3,
    }),
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapCanvasComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: MapService, useClass: MockMapService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
    service = TestBed.inject(MapService);
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
    component.stationGroups = stationGroups;
    component.stations = stations;
    component.stationGroups[0].dragging = true;
    component.setDraggingStationGroup();

    expect(component.stations[0].dragging).toBeTruthy();
    expect(component.stations[1].dragging).toBeTruthy();
    expect(component.stations[2].dragging).toBeFalsy();
    expect(component.stations[3].dragging).toBeTruthy();

    expect(component.stationGroups[0].dragging).toBeTruthy();
    expect(component.stationGroups[1].dragging).toBeTruthy();
    expect(component.stationGroups[2].dragging).toBeFalsy();
  });

  it('should move the stations', () => {
    const expectMapPoints: Point[] = [];
    const eventCanvasPoint: Point = { x: 0, y: 0 };
    const moveAmountX = 1;
    const moveAmountY = 2;

    component.stations = stations;
    component.stations.forEach((station, index) => {
      if (index !== 2) {
        // Stations that move.
        station.dragging = true;
        expectMapPoints.push({
          x: station.mapPoint.x - moveAmountX / DEFAULT_SCALE,
          y: station.mapPoint.y - moveAmountY / DEFAULT_SCALE,
        });
      } else {
        // Stations that don't move.
        station.dragging = false;
        expectMapPoints.push({
          x: station.mapPoint.x,
          y: station.mapPoint.y,
        });
      }
    });

    component.moveStation(eventCanvasPoint, moveAmountX, moveAmountY);

    component.stations.forEach((station, index) => {
      expect(station.mapPoint).toEqual(expectMapPoints[index]);
    });
  });

  xit('should be able to set station group as selected', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(800);
    window.dispatchEvent(new Event('resize'));
    spyOnProperty(window, 'innerHeight').and.returnValue(600);
    window.dispatchEvent(new Event('resize'));
    const setStatusSpy = spyOn(
      TestBed.inject(MapService),
      'setStationGroupStationStatus'
    );
    const setStationGroupStatusSpy = spyOn(
      TestBed.inject(MapService),
      'setStationGroupStatus'
    );
    const updatePendingGroupStatusSpy = spyOn(
      TestBed.inject(MapService),
      'updatePendingStationGroup'
    );

    const groups = stationGroupAddGroups.map(
      (e) => new StationGroupMapElement(e)
    );
    const updatedStations = stations.map((e) => new StationMapElement(e));
    groups.map((e) => {
      const path = new Path2D();
      path.moveTo(e.boundaryPoints[0].x, e.boundaryPoints[0].y);
      e.boundaryPoints = e.boundaryPoints.concat(e.boundaryPoints.splice(0, 1));
      for (const boundaryPoint of e.boundaryPoints) {
        path.lineTo(boundaryPoint.x, boundaryPoint.y);
      }
      e.path = path;
    });
    component['context'] = component['mapCanvas'].nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    service.registerCanvasContext(component['context']);
    component.mapMode = MapMode.StationGroupAdd;
    component.stationGroups = groups;
    component.stations = updatedStations;
    service.stationGroupElements = groups;
    const contextPoint = { x: 117, y: 96 };
    component.checkStationGroupClick(contextPoint);
    groups[1].hoverItem = StationGroupElementHoverItem.Boundary;
    expect(setStatusSpy).toHaveBeenCalled();
    expect(groups[1].disabled).toBe(false);
    expect(setStationGroupStatusSpy).toHaveBeenCalled();
    expect(updatePendingGroupStatusSpy).toHaveBeenCalled();
  });

  it('should not be able to set disabled station group as selected', () => {
    const setStatusSpy = spyOn(
      TestBed.inject(MapService),
      'setStationGroupStationStatus'
    );
    const setStationGroupStatusSpy = spyOn(
      TestBed.inject(MapService),
      'setStationGroupStatus'
    );
    const updatePendingGroupStatusSpy = spyOn(
      TestBed.inject(MapService),
      'updatePendingStationGroup'
    );

    const groups = stationGroupAddGroups.map(
      (e) => new StationGroupMapElement(e)
    );
    const updatedStations = stations.map((e) => new StationMapElement(e));
    groups.map((e) => {
      const path = new Path2D();
      path.moveTo(e.boundaryPoints[0].x, e.boundaryPoints[0].y);
      e.boundaryPoints = e.boundaryPoints.concat(e.boundaryPoints.splice(0, 1));
      for (const boundaryPoint of e.boundaryPoints) {
        path.lineTo(boundaryPoint.x, boundaryPoint.y);
      }
      e.path = path;
      e.disabled = true;
    });
    component.mapMode = MapMode.StationGroupAdd;
    component.stationGroups = groups;
    component.stations = updatedStations;
    service.stationGroupElements = groups;
    const contextPoint = { x: 606, y: 158 };
    component.checkStationGroupClick(contextPoint);
    expect(setStatusSpy).toHaveBeenCalledTimes(0);
    expect(groups[1].disabled).toBe(true);
    expect(setStationGroupStatusSpy).toHaveBeenCalledTimes(0);
    expect(updatePendingGroupStatusSpy).toHaveBeenCalledTimes(0);
  });

  it('should be able to select station to create new group', () => {
    const setStatusSpy = spyOn(
      TestBed.inject(MapService),
      'setStationGroupStationStatus'
    );
    const setStationStatusSpy = spyOn(
      TestBed.inject(MapService),
      'setSelectedStation'
    );
    const updatePendingGroupStatusSpy = spyOn(
      TestBed.inject(MapService),
      'updatePendingStationGroup'
    );

    const testStations = stationGroupAddStations.map(
      (e) => new StationMapElement(e)
    );
    component.mapMode = MapMode.StationGroupAdd;
    component['scale'] = 0.547;
    component.stations = testStations;
    service.stationElements = testStations;
    const point = { x: 708, y: 236 };
    const contextPoint = { x: 885, y: 295 };
    component['clickEventHandler'](point, contextPoint);
    expect(setStatusSpy).toHaveBeenCalled();
    expect(testStations[0].disabled).toBe(false);
    expect(setStationStatusSpy).toHaveBeenCalledWith(testStations[0]);
    expect(updatePendingGroupStatusSpy).toHaveBeenCalled();
  });

  it('should be not be able to select any station as they are disabled', () => {
    const setStatusSpy = spyOn(
      TestBed.inject(MapService),
      'setStationGroupStationStatus'
    );
    const setStationStatusSpy = spyOn(
      TestBed.inject(MapService),
      'setSelectedStation'
    );
    const updatePendingGroupStatusSpy = spyOn(
      TestBed.inject(MapService),
      'updatePendingStationGroup'
    );

    const testStations = stationGroupAddStations.map(
      (e) => new StationMapElement(e)
    );
    testStations.map((e) => {
      e.disabled = true;
    });
    component.mapMode = MapMode.StationGroupAdd;
    component['scale'] = 0.547;
    component.stations = testStations;
    service.stationElements = testStations;
    const point = { x: 708, y: 236 };
    const contextPoint = { x: 885, y: 295 };
    component['clickEventHandler'](point, contextPoint);
    expect(setStatusSpy).toHaveBeenCalledTimes(0);
    expect(testStations[0].disabled).toBe(true);
    expect(setStationStatusSpy).toHaveBeenCalledTimes(0);
    expect(updatePendingGroupStatusSpy).toHaveBeenCalledTimes(0);
  });
});
