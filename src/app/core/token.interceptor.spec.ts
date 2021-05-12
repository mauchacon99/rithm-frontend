import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TokenInterceptor } from './token.interceptor';
import { MockUserService } from './user-service-mock';
import { UserService } from './user.service';

describe('TokenInterceptor', () => {
  // let http: HttpClient;
  // let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        TokenInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        },
        {
          provide: UserService,
          useClass: MockUserService
        }
      ]
    });
    // http = TestBed.inject(HttpClient);
    // httpTesting = TestBed.inject(HttpTestingController);
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
    // add test
  });

  it('should sign the user out if an auth-required request is made when the user is not signed in', () => {
    // add test
  });

});

