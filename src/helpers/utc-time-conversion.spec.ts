import { UtcTimeConversion } from './utc-time-conversion';

const SAMPLE_TIME = '2021-06-16T17:26:47.3506612Z';

describe('UtcTimeConversion', () => {
  let conversion: UtcTimeConversion;

  beforeEach(() => {
    conversion = new UtcTimeConversion();
  });

  it('should be created', () => {
    expect(conversion).toBeTruthy();
  });

  it('should calculate UTC milliseconds from timestamp', () => {
    expect(conversion.getMilliseconds(SAMPLE_TIME)).toEqual(1623864407350);
  });

  it('should calculate milliseconds elapsed since timestamp', () => {
    expect(conversion.getMillisecondsElapsed(SAMPLE_TIME)).toBeTruthy();
  });

  it('should return text with minutes elapsed', () => {
    const now: number = new Date().getTime();
    const adjustTime: number = now - (1000 * 60 * 15);
    const elapsed: number = Date.now() - adjustTime;

    expect(conversion.getElapsedTimeText(elapsed)).toMatch(/minutes/);
  });

  it('should return text with hours elapsed', () => {
    const now: number = new Date().getTime();
    const adjustTime: number = now - (1000 * 60 * 60 * 15);
    const elapsed: number = Date.now() - adjustTime;

    expect(conversion.getElapsedTimeText(elapsed)).toMatch(/hours/);
  });

  it('should return text with days elapsed', () => {
    const now: number = new Date().getTime();
    const adjustTime: number = now - (1000 * 60 * 60 * 24 * 5);
    const elapsed: number = Date.now() - adjustTime;

    expect(conversion.getElapsedTimeText(elapsed)).toMatch(/days/);
  });
});
