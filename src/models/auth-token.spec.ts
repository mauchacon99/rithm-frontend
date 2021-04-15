import { AuthToken } from './auth-token';

const SAMPLE_AUTH_TOKEN = 'dj0yJmk9N2pIazlsZk1iTzIxJmQ9WVdrOWVEUmpVMFpWTXpRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00NA--';

describe('AuthToken', () => {
  it('should create an instance', () => {
    expect(new AuthToken(SAMPLE_AUTH_TOKEN)).toBeTruthy();
  });
});
