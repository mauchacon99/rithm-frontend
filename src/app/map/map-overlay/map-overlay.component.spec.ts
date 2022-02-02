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
import { StationMapElement } from 'src/helpers';
import { MapItemStatus } from 'src/models';

describe('MapOverlayComponent', () => {
  let component: MapOverlayComponent;
  let fixture: ComponentFixture<MapOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MapOverlayComponent,
        MockComponent(LoadingIndicatorComponent),
        MockComponent(ConnectionInfoDrawerComponent),
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        MatMenuModule,
        MatSidenavModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: MapService, useClass: MockMapService },
        { provide: UserService, useClass: MockUserService },
      ],
    }).compileComponents();
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
    spyOnProperty(TestBed.inject(MapService), 'mapHasChanges').and.returnValue(
      true
    );
    component.mapHasChanges;

    const dialogSpy = spyOn(TestBed.inject(PopupService), 'confirm');
    component.cancel();
    expect(dialogSpy).toHaveBeenCalledWith({
      title: 'Confirmation',
      message: `Are you sure you want to cancel these changes? All map changes will be lost`,
      okButtonText: 'Confirm',
    });
  });

  it('should disable zoom buttons while the map is loading', () => {
    component.mapDataLoading = true;
    fixture.detectChanges();
    const zoomInButton =
      fixture.debugElement.nativeElement.querySelector('#zoomIn');
    expect(zoomInButton.disabled).toBeTruthy();
    const zoomOutButton =
      fixture.debugElement.nativeElement.querySelector('#zoomOut');
    expect(zoomOutButton.disabled).toBeTruthy();
  });

  it('should disable center button while the map is loading', () => {
    component.mapDataLoading = true;
    fixture.detectChanges();
    const centerButton =
      fixture.debugElement.nativeElement.querySelector('#centerButton');
    expect(centerButton.disabled).toBeTruthy();
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
