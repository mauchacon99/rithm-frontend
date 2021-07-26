import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmailLinkParams } from 'src/helpers';
import { EmailLinkType } from 'src/models';

import { ResetPasswordGuard } from './reset-password.guard';

describe('ResetPasswordGuard', () => {
  let guard: ResetPasswordGuard;
  let route: ActivatedRouteSnapshot;
  const data = { queryParamMap: convertToParamMap({ type: 'reset', guid: 'kj343kh2o3ih23ih423', email: 'johndoe@email.com' }) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRouteSnapshot, useValue: data }
      ]
    });
    guard = TestBed.inject(ResetPasswordGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should determine if the path has valid query params', () => {
    route = TestBed.inject(ActivatedRouteSnapshot);
    guard.canActivate(route);
    const linkParams = new EmailLinkParams(route.queryParamMap);
    expect(linkParams.valid).toBeTrue();
    expect(linkParams.type).toBe(EmailLinkType.forgotPassword);
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
