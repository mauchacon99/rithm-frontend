import { TestBed } from '@angular/core/testing';

import { AccountSettingsService } from './account-settings.service';

describe('AccountSettingsService', () => {
  let service: AccountSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be false the emit and subscribe to subject updatedUser$', () => {
    const expectedData = {
      firstName: 'Test',
      lastName: 'Test2',
      profileImageRithmId: '123-654-789',
    };
    service.currentUser$.subscribe((data) => {
      expect(data).toEqual(expectedData);
    });

    service.setUser(expectedData);
  });
});
