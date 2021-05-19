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
});
