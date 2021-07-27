/* eslint-disable  */
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TokenInterceptor } from './token.interceptor';
import { MockPopupService, MockUserService } from 'src/mocks';
import { UserService } from './user.service';
import { PopupService } from './popup.service';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard/dashboard.service';

const MICROSERVICE_PATH = '/userservice/api/user';

describe('TokenInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        TokenInterceptor,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: PopupService, useClass: MockPopupService },
        UserService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
        DashboardService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const interceptor: TokenInterceptor = TestBed.inject(TokenInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should add a token on auth-required routes', () => {
    // http.post('domain.com/api/createflow', {flow: 'some flow info...'})
    // .subscribe((response) => {
    //   expect(response).toBeFalsy();
    // });
    // const httpRequest = httpTesting.expectOne('domain.com/api/createflow');
    // expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    // expect(httpRequest.request.headers.get('Authorization')).toBe('');
  });

  it('should pass the request on regular routes', () => {
    const service = TestBed.inject(UserService);
    service.getTermsConditions().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const httpRequest = http.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/gettermsandconditions`);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
  });

  it('should sign the user out if an auth-required request is made when the user is not signed in', () => {
    const service = TestBed.inject(DashboardService);
    service.getDashboardHeader().subscribe(response => {
      expect(response).toBeFalsy();
    });
  });

});

