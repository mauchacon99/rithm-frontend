import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockMapService } from 'src/mocks';
import { MapService } from '../map.service';

import { MapCanvasComponent } from './map-canvas.component';

describe('MapCanvasComponent', () => {
  let component: MapCanvasComponent;
  let fixture: ComponentFixture<MapCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapCanvasComponent ],
      providers: [
        { provide: MapService, useClass: MockMapService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should create a new station', () => {
    expect(component).toBeTruthy();
  });
});
