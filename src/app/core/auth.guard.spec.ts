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

  it('should navigate back to login if not signed in', () => {
    // test here
  });

  it('should display an alert if not signed in', () => {
  //   service.canActivate();
  });

  it('should not allow navigation if not signed in', () => {
  //   expect(service.canActivate()).toBeFalse();
  });

  // TODO: Test allowance of navigation
  it('should allow navigation if signed in', () => {
  //   expect(service.canActivate()).toBeFalse();
  });
});
