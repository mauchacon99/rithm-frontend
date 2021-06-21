import { UtcTimeConversion } from './utc-time-conversion';

const SAMPLE_TIME = '2021-06-18T17:26:47.3506612Z';

describe('UtcTimeConversion', () => {
  let conversion: UtcTimeConversion;

  beforeEach(() => {
    conversion = new UtcTimeConversion();
  });

  it('should return a number', () => {
    expect(conversion.updateTimeInStation(SAMPLE_TIME)).toBeTruthy();
  })

  it('should return a string', () => {
    expect(conversion.convertElapsedTime(conversion.updateTimeInStation(SAMPLE_TIME))).toMatch(/days/)
  })
});
