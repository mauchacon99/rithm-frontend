import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPopupService } from 'src/mocks';

import { AuthGuard } from './auth.guard';
import { PopupService } from './popup.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        { provide: PopupService, useClass: MockPopupService }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  xit('should navigate back to login if not signed in', () => {
    // TODO: Test navigation
  });

  xit('should display an alert if not signed in', () => {
    // TODO: Test display of alert
  });

  xit('should not allow navigation if not signed in', () => {
    // TODO: Test allowance of navigation
    //   expect(service.canActivate()).toBeFalse();
  });

  xit('should allow navigation if signed in', () => {
    // TODO: Test allowance of navigation
    //   expect(service.canActivate()).toBeFalse();
  });
});
