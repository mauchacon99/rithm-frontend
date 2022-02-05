import { environment } from 'src/environments/environment';
import { AccessToken } from './access-token';

const SAMPLE_ACCESS_TOKEN =
  'dj0yJmk9N2pIazlsZk1iTzIxJmQ9WVdrOWVEUmpVMFpWTXpRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00NA--';

describe('AccessToken', () => {
  let token: AccessToken;

  beforeEach(() => {
    token = new AccessToken(SAMPLE_ACCESS_TOKEN);
  });

  it('should create an instance', () => {
    expect(token).toBeTruthy();
  });

  it('should report a non-expired token', () => {
    expect(token.isExpired()).toBeFalse();
  });

  it('should report an expired token', () => {
    const dateOfExpiration = Date.now() + environment.accessTokenLifetime;
    spyOn(Date, 'now').and.returnValue(dateOfExpiration);
    expect(Date.now()).toEqual(dateOfExpiration);
    expect(token.isExpired()).toBeTrue();
  });
});
