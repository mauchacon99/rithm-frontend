import { TestBed } from '@angular/core/testing';

import { ConnectionElementService } from './connection-element.service';

describe('ConnectionElementService', () => {
  let service: ConnectionElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});