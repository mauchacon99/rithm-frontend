import { AccessToken } from './access-token';

const SAMPLE_ACCESS_TOKEN = 'dj0yJmk9N2pIazlsZk1iTzIxJmQ9WVdrOWVEUmpVMFpWTXpRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00NA--';

describe('AccessToken', () => {
  it('should create an instance', () => {
    expect(new AccessToken(SAMPLE_ACCESS_TOKEN)).toBeTruthy();
  });
});
