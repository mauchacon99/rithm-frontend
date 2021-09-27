import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FlowElementService } from './flow-element.service';

describe('FlowElementService', () => {
  let service: FlowElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(FlowElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
