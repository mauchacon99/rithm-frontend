import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ResetPasswordGuard } from './reset-password.guard';

describe('ResetPasswordGuard', () => {
  let guard: ResetPasswordGuard;
  let router: Router;
  let routerSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    guard = TestBed.inject(ResetPasswordGuard);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    routerSpy = spyOn(router, 'navigateByUrl');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should navigate back to sign in if params are invalid', () => {
    const invalidParams = {
      queryParamMap: convertToParamMap({
        guid: 'kj343kh2o3ih23ih423',
        email: 'johndoe@email.com',
      }),
    };
    guard.canActivate(invalidParams as ActivatedRouteSnapshot);
    expect(routerSpy).toHaveBeenCalledOnceWith('');
  });

  it('should navigate back to sign in if params are valid, but type is not reset', () => {
    const validParams = {
      queryParamMap: convertToParamMap({
        type: 'register',
        guid: 'kj343kh2o3ih23ih423',
        email: 'johndoe@email.com',
      }),
    };
    guard.canActivate(validParams as ActivatedRouteSnapshot);
    expect(routerSpy).toHaveBeenCalledOnceWith('');
  });

  it('should allow navigation if params are valid and type is reset', () => {
    const paramsToReset = {
      queryParamMap: convertToParamMap({
        type: 'reset',
        guid: 'kj343kh2o3ih23ih423',
        email: 'johndoe@email.com',
      }),
    };
    const allowNavigation = guard.canActivate(
      paramsToReset as ActivatedRouteSnapshot
    );
    expect(allowNavigation).toBe(true);
  });
});
