import { TestBed } from '@angular/core/testing';

import { FlowElementService } from './flow-element.service';

describe('FlowElementService', () => {
  let service: FlowElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
