import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockMapService } from 'src/mocks';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { MapOverlayComponent } from '../map-overlay/map-overlay.component';
import { MapToolbarComponent } from '../map-toolbar/map-toolbar.component';
import { MapService } from '../map.service';

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
      ],
      providers: [
        { provide: MapService, useClass: MockMapService },
        { provide: ErrorService, useClass: MockErrorService }
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
