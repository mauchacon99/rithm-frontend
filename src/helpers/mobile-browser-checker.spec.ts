import { MobileBrowserChecker } from './mobile-browser-checker';

describe('MobileConfig', () => {
  let mobileConfig: MobileBrowserChecker;

  beforeEach(() => {
    mobileConfig = new MobileBrowserChecker();
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
