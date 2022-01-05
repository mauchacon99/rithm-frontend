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
    spyOn(Date, 'now').and.returnValue(1623864707350);

    expect(conversion.getMillisecondsElapsed(SAMPLE_TIME)).toEqual(300000);
  });

  it('should return date and time', () => {
    const useDate = '2021-07-12T17:26:47.3506612Z';

    expect(conversion.getDateAndTime(useDate)).toMatch(/Jul 12, 2021/);
  });

  it('should return text with minutes elapsed', () => {
    const now = new Date().getTime();
    const adjustTime = now - 1000 * 60 * 15;
    const elapsed = Date.now() - adjustTime;

    expect(conversion.getElapsedTimeText(elapsed)).toMatch(/15 minutes/);
  });

  it('should return text with hours elapsed', () => {
    const now = new Date().getTime();
    const adjustTime = now - 1000 * 60 * 60 * 15;
    const elapsed = Date.now() - adjustTime;

    expect(conversion.getElapsedTimeText(elapsed)).toMatch(/15 hours/);
  });

  it('should return text with days elapsed', () => {
    const now = new Date().getTime();
    const adjustTime = now - 1000 * 60 * 60 * 24 * 5;
    const elapsed = Date.now() - adjustTime;

    expect(conversion.getElapsedTimeText(elapsed)).toMatch(/5 days/);
  });
});
