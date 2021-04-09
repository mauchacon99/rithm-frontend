import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../shared/shared.module';

import { AuthGuardService } from './auth-guard.service';

describe('AuthGuardService', () => {
  let service: AuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedModule
      ]
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should navigate back to login if not signed in', () => {

  // });

  // it('should display an alert if not signed in', () => {
  //   service.canActivate();
  // });

  it('should not allow navigation if not signed in', () => {
    expect(service.canActivate()).toBeFalse();
  });

  // TODO: Test allowance of navigation
  // it('should allow navigation if signed in', () => {
  //   expect(service.canActivate()).toBeFalse();
  // });
});
