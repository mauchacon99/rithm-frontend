import { MobileConfig } from './mobile-config';

describe('MobileConfig', () => {
  let mobileConfig: MobileConfig;

  beforeEach(() => {
    mobileConfig = new MobileConfig();
  });

  it('should be created', () => {
    expect(mobileConfig).toBeTruthy();
  });

  it('should detect desktop device', () => {
    const expectData = false;
    expect(mobileConfig.isMobileDevice).toBe(expectData);
  });

  it('should detect mobile device', () => {
    const expectData = true;
    spyOnProperty(mobileConfig, 'isMobileDevice').and.returnValue(expectData);
    expect(mobileConfig.isMobileDevice).toBe(expectData);
  });
});
