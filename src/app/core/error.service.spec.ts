import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockPopupService } from 'src/mocks';

import { ErrorService } from './error.service';
import { PopupService } from './popup.service';

describe('ErrorService', () => {
  let service: ErrorService;
  let popupService: PopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
      ],
      providers: [
        { provide: PopupService, useClass: MockPopupService }
      ]
    });
    service = TestBed.inject(ErrorService);
    popupService = TestBed.inject(PopupService);

    spyOn(window.console, 'error');
    spyOn(popupService, 'alert');
    spyOn(popupService, 'notify');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log errors to the console', () => {
    service.logError(new Error('This is an example of some error'));
    expect(window.console.error).toHaveBeenCalled();
  });

  it('should display important errors to user', () => {
    service.displayError('Ruh roh, Raggy', new Error('Zoinks'), true);
    expect(popupService.alert).toHaveBeenCalled();
  });

  it('should display minor errors to user', () => {
    service.displayError('Ruh roh, Raggy', new Error('Zoinks'));
    expect(popupService.notify).toHaveBeenCalled();
  });

});
