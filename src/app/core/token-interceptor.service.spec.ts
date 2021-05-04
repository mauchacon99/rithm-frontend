import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TokenInterceptorService } from './token-interceptor.service';
import { MockUserService } from './user-service-mock';
import { UserService } from './user.service';

describe('TokenInterceptorService', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptorService,
          multi: true
        },
        {
          provide: UserService,
          useClass: MockUserService
        }
      ]
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });

  it('should add a token on auth-required routes', () => {
    http.post('domain.com/api/createflow', {flow: 'some flow info...'}).subscribe();
    const httpRequest = httpTesting.expectOne('domain.com/api/createflow');
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toBe('');
  });

  it('should pass the request on regular routes', () => {
    // add test
  });

  it('should sign the user out if an auth-required request is made when the user is not signed in', () => {
    // add test
  });

});

