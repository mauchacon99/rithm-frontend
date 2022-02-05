import { convertToParamMap, Params } from '@angular/router';
import { EmailLinkParams } from './email-link-params';

describe('EmailLinkParams', () => {
  let params: Params;

  beforeEach(() => {
    params = {
      type: 'register',
      email: 'test@email.com',
      guid: 'fe7d733b-521a-4f68-91fc-0d59ac7bbf31',
    };
  });

  it('should create an instance', () => {
    const paramMap = convertToParamMap(params);
    expect(new EmailLinkParams(paramMap)).toBeTruthy();
  });

  it('should report invalid params when type is missing', () => {
    delete params.type;
    const paramMap = convertToParamMap(params);
    const emailLinkParams = new EmailLinkParams(paramMap);
    expect(emailLinkParams.valid).toBeFalse();
  });

  it('should report invalid params when email is missing', () => {
    delete params.email;
    const paramMap = convertToParamMap(params);
    const emailLinkParams = new EmailLinkParams(paramMap);
    expect(emailLinkParams.valid).toBeFalse();
  });

  it('should report invalid params when GUID is missing', () => {
    delete params.guid;
    const paramMap = convertToParamMap(params);
    const emailLinkParams = new EmailLinkParams(paramMap);
    expect(emailLinkParams.valid).toBeFalse();
  });

  it('should report invalid params when email and GUID missing', () => {
    delete params.email;
    delete params.guid;
    const paramMap = convertToParamMap(params);
    const emailLinkParams = new EmailLinkParams(paramMap);
    expect(emailLinkParams.valid).toBeFalse();
  });

  it('should report valid params when all params are present', () => {
    const paramMap = convertToParamMap(params);
    const emailLinkParams = new EmailLinkParams(paramMap);
    expect(emailLinkParams.valid).toBeTrue();
  });
});
