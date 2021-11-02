import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MockComponent } from 'ng-mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { StationMapElement } from 'src/helpers';
import { MapItemStatus, StationMapData } from 'src/models';

import { ConnectionInfoDrawerComponent } from './connection-info-drawer.component';

const STATIONS: StationMapData[] = [
  {
    rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
    stationName: 'Development',
    noOfDocuments: 5,
    mapPoint: {
      x: 12,
      y: 15
    },
    previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C', 'AAAEBE98-YU01-97ER-A7BB-285PP25B0989'],
    nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989', 'CCCAAA00-IO01-97QW-Z7LK-877MM25Z0989'],
    status: MapItemStatus.Normal
  },
  {
    rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
    stationName: 'Step 1',
    noOfDocuments: 5,
    mapPoint: {
      x: 200,
      y: 80
    },
    previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
    nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'],
    status: MapItemStatus.Normal
  }
];

describe('ConnectionInfoDrawerComponent', () => {
  let component: ConnectionInfoDrawerComponent;
  let fixture: ComponentFixture<ConnectionInfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConnectionInfoDrawerComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports:[
        MatButtonModule,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionInfoDrawerComponent);
    component = fixture.componentInstance;
    component.connectedStations = STATIONS.map((e) => new StationMapElement(e));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
