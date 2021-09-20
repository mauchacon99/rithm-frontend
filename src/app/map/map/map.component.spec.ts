import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { MapOverlayComponent } from '../map-overlay/map-overlay.component';
import { MapToolbarComponent } from '../map-toolbar/map-toolbar.component';

import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        MockComponent(MapToolbarComponent),
        MockComponent(MapOverlayComponent),
        MockComponent(MapCanvasComponent)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
