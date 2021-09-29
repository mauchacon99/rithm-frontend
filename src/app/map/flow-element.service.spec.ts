import { TestBed } from '@angular/core/testing';
import { MockMapService } from 'src/mocks';

import { FlowElementService } from './flow-element.service';
import { MapService } from './map.service';

describe('FlowElementService', () => {
  let service: FlowElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MapService, useClass: MockMapService }
      ]
    });
    service = TestBed.inject(FlowElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
