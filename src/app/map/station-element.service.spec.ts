import { TestBed } from '@angular/core/testing';

import { StationElementService } from './station-element.service';

describe('StationElementService', () => {
  let service: StationElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
