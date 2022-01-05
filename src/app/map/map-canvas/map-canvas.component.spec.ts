import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockMapService, MockPopupService } from 'src/mocks';
import { MapMode } from 'src/models';
import { MapService } from '../map.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MapCanvasComponent } from './map-canvas.component';
import { PopupService } from 'src/app/core/popup.service';

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
});
