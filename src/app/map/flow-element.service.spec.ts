import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockMapService } from 'src/mocks';

import { StationGroupElementService } from './station-group-element.service';
import { MapService } from './map.service';

describe('FlowElementService', () => {
  let service: StationGroupElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: MapService, useClass: MockMapService }
      ]
    });
    service = TestBed.inject(StationGroupElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
