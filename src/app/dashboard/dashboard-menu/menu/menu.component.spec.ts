import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MockComponent } from 'ng-mocks';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { OptionsMenuComponent } from '../options-menu/options-menu.component';
import { ExpansionMenuComponent } from '../expansion-menu/expansion-menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockSplitService, MockUserService } from 'src/mocks';
import { UserService } from 'src/app/core/user.service';
import { SplitService } from 'src/app/core/split.service';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MenuComponent,
        MockComponent(HeaderMenuComponent),
        MockComponent(OptionsMenuComponent),
        MockComponent(ExpansionMenuComponent),
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: UserService, useClass: MockUserService },
        { provide: SplitService, useClass: MockSplitService },
      ],
      imports: [MatExpansionModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
    });

    it('should get splits for the menu', () => {
      const dataOrganization = TestBed.inject(UserService).user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();
      const spyGetManageUserTreatment = spyOn(
        splitService,
        'getManageUserTreatment'
      ).and.callThrough();
      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(spyGetManageUserTreatment).toHaveBeenCalled();
      expect(component.isManageMember).toBeTrue();
    });

    it('should catch error the splits for the menu', () => {
      const dataOrganization = TestBed.inject(UserService).user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();
      splitService.sdkReady$.error('error');
      const errorService = spyOn(
        TestBed.inject(ErrorService),
        'logError'
      ).and.callThrough();
      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(errorService).toHaveBeenCalled();
      expect(component.isManageMember).toBeFalse();
    });
  });
});
