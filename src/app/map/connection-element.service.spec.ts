import { TestBed } from '@angular/core/testing';
import { MockMapService } from 'src/mocks';

import { ConnectionElementService } from './connection-element.service';
import { MapService } from './map.service';

describe('ConnectionElementService', () => {
  let service: ConnectionElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MapService, useClass: MockMapService }],
    });
    service = TestBed.inject(ConnectionElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
