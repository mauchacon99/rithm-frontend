import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
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
import { User } from 'src/models';

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

  fit('should get splits for the menu', () => {
    const idOrganization = TestBed.inject(UserService).user.organization;
    const splitInitMethod = spyOn(
      TestBed.inject(SplitService),
      'initSdk'
    ).and.callThrough();
    const spyGetManageUserTreatment = spyOn(
      TestBed.inject(SplitService),
      'getManageUserTreatment'
    ).and.callThrough();
    component.ngOnInit();
    //component['split']();
    expect(splitInitMethod).toHaveBeenCalledOnceWith(idOrganization);
    expect(spyGetManageUserTreatment).toHaveBeenCalled();
  });

  xit('should catch error the splits for the menu', () => {
    const dataOrganization = TestBed.inject(UserService).user.organization;
    const splitInitMethod = spyOn(
      TestBed.inject(SplitService),
      'initSdk'
    ).and.callThrough();
    const errorService = spyOn(
      TestBed.inject(ErrorService),
      'logError'
    ).and.callThrough();
    component.ngOnInit();
    component['split']();
    expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
    expect(errorService).toHaveBeenCalled();
  });
});
