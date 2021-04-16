import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { UserService } from './user.service';

// const routerSpy =  jasmine.createSpyObj('Router', ['navigateByUrl']);


describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [
        // { provide: Router, useClass: routerSpy }
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow sign in', () => {
    expect(service).toBeTruthy();
  });

  it('should clear local storage on sign out', () => {
    localStorage.setItem('test', 'test');
    service.signOut();
    expect(localStorage.getItem('test')).toBeNull();
  });

  it('should clear local storage on sign out', () => {
    sessionStorage.setItem('test', 'test');
    service.signOut();
    expect(sessionStorage.getItem('test')).toBeNull();
  });

  it('should clear cookies on sign out', () => {
    document.cookie = 'test=test';
    service.signOut();
    const cookies = document.cookie;
    expect(cookies).toBeFalsy();
  });

  it('should return to sign in page on sign out', () => {
    // service.signOut();

    // const spy = routerSpy.navigateByUrl as jasmine.Spy;
    // const navArgs = spy.calls.first().args[0];


    // expect(navArgs).toBe(['']);
  });

  it('should report sign in status', () => {
    expect(service).toBeTruthy();
  });

  it('should refresh expired access tokens', () => {
    expect(service).toBeTruthy();
  });
});
