import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        MatButtonModule
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
