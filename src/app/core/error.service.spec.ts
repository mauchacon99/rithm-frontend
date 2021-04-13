import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatButtonModule
      ]
    });
    service = TestBed.inject(ErrorService);

    spyOn(window.console, 'error');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log errors to the console', () => {
    service.logError(new Error('This is an example of some error'));
    expect(window.console.error).toHaveBeenCalled();
  });

  it('should display important errors to user', () => {
    service.displayError('Ruh roh, Raggy', new Error('Zoinks'));
  });

  it('should display minor errors to user', () => {
    service.displayError('Ruh roh, Raggy', new Error('Zoinks'));

  });

  // TODO: Add error log reporting test
  // it('should report errors to SOME_THIRD_PARTY_SERVICE', () => {});
});
