import { UtcTimeConversion } from './utc-time-conversion';

const SAMPLE_TIME = '2021-06-18T17:26:47.3506612Z';

describe('UtcTimeConversion', () => {
  let conversion = UtcTimeConversion;

  beforeEach() {
    conversion = new UtcTimeConversion;
  }

  it('should return a string', () => {
    expect(conversion.convertElapsedTime())
  })

  // beforeEach(() => {
  //   token = new AccessToken(SAMPLE_ACCESS_TOKEN);
  // });

  // it('should create an instance', () => {
  //   expect(token).toBeTruthy();
  // });

  // it('should report a non-expired token', () => {
  //   expect(token.isExpired()).toBeFalse();
  // });

  // it('should report an expired token', () => {
  //   const dateOfExpiration = Date.now() + environment.accessTokenLifetime;
  //   spyOn(Date, 'now').and.returnValue(dateOfExpiration);
  //   expect(Date.now()).toEqual(dateOfExpiration);
  //   expect(token.isExpired()).toBeTrue();
  // });

});
