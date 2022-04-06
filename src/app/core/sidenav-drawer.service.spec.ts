import { TestBed } from '@angular/core/testing';

import { SidenavDrawerService } from './sidenav-drawer.service';

describe('SidenavDrawerService', () => {
  let service: SidenavDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidenavDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get drawerDisableClose', () => {
    service.setDisableCloseDrawerOutside(true);
    expect(service.getDisableCloseDrawerOutside).toBeTrue();
  });
});
