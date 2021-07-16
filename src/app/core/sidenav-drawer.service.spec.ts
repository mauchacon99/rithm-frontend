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
});
