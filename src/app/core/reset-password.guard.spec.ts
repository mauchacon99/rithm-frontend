import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ResetPasswordGuard } from './reset-password.guard';

describe('ResetPasswordGuard', () => {
  let guard: ResetPasswordGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ]
    });
    guard = TestBed.inject(ResetPasswordGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  xit('should navigate back to sign in if params are invalid', () => {
    expect(guard).toBeTruthy();
  });

  xit('should navigate back to sign in if params are valid, but type is not register', () => {
    expect(guard).toBeTruthy();
  });

  xit('should allow navigation if params are valid and type is register', () => {
    expect(guard).toBeTruthy();
  });
});
