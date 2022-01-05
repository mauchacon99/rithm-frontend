import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockMapService } from 'src/mocks';
import { MapService } from './map.service';

import { StationElementService } from './station-element.service';

describe('StationElementService', () => {
  let service: StationElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: MapService, useClass: MockMapService }],
    });
    service = TestBed.inject(StationElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
