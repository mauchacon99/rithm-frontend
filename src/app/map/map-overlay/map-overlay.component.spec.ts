import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockErrorService, MockPopupService, MockUserService } from 'src/mocks';
import { MockMapService } from 'src/mocks';
import { MapService } from '../map.service';
import { MatMenuModule } from '@angular/material/menu';
import { MapOverlayComponent } from './map-overlay.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from 'src/app/core/user.service';
import { MockComponent } from 'ng-mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { ConnectionInfoDrawerComponent } from '../connection-info-drawer/connection-info-drawer.component';
import {StationMapElement} from 'src/helpers';
import {v4 as uuidv4} from 'uuid';
import {MapItemStatus} from 'src/models';

describe('MapOverlayComponent', () => {
  let component: MapOverlayComponent;
  let fixture: ComponentFixture<MapOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MapOverlayComponent,
        MockComponent(LoadingIndicatorComponent),
        MockComponent(ConnectionInfoDrawerComponent)
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        MatMenuModule,
        MatSidenavModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: MapService, useClass: MockMapService },
        { provide: UserService, useClass: MockUserService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display confirmation prompt when cancel', () => {
    const stationElementsArray: StationMapElement[] = [];
    for (let i = 0; i < 4; i++) {
      const newStation = new StationMapElement({
        rithmId: uuidv4(),
        stationName: 'Untitled Station',
        mapPoint: {
          x: 12,
          y: 15
        },
        noOfDocuments: 0,
        previousStations: [],
        nextStations: [],
        status: MapItemStatus.Created,
        notes: ''
      });
      stationElementsArray.push(newStation);
    }
    component.stations = stationElementsArray;

    const dialogSpy = spyOn(TestBed.inject(PopupService), 'confirm');
    component.cancel();
    expect(dialogSpy).toHaveBeenCalledWith({
      title: 'Confirmation',
      message: `Are you sure you want to cancel these changes? All map changes will be lost`,
      okButtonText: 'Confirm',
    });
  });
});
