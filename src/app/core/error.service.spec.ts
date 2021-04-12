import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log errors to the console', () => {
    // write test
  });

  it('should display errors to the user', () => {
    // write test
  });

  // TODO: Add error log reporting test
  // it('should report errors to SOME_THIRD_PARTY_SERVICE', () => {});
});
