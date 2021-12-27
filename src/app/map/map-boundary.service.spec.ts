import { TestBed } from '@angular/core/testing';
import { MockMapService } from 'src/mocks';

import { MapBoundaryService } from './map-boundary.service';
import { MapService } from './map.service';

describe('MapBoundaryService', () => {
  let service: MapBoundaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: MapService, useClass: MockMapService }
      ]
    });
    service = TestBed.inject(MapBoundaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
