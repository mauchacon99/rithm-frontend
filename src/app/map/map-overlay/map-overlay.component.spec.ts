import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockMapService } from 'src/mocks';
import { MapService } from '../map.service';

import { MapOverlayComponent } from './map-overlay.component';

describe('MapOverlayComponent', () => {
  let component: MapOverlayComponent;
  let fixture: ComponentFixture<MapOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapOverlayComponent ],
      providers: [
        { provide: MapService, useClass: MockMapService }
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
});
