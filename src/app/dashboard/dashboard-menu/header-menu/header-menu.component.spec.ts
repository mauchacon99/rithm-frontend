import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';

import { HeaderMenuComponent } from './header-menu.component';

describe('HeaderMenuComponent', () => {
  let component: HeaderMenuComponent;
  let fixture: ComponentFixture<HeaderMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HeaderMenuComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call to toggle sidenavService and hidden menu dashboard', () => {
    const spyMenu = spyOn(TestBed.inject(SidenavDrawerService), 'toggleDrawer');
    component.toggleMenu('menuDashboard');
    expect(spyMenu).toHaveBeenCalledOnceWith('menuDashboard');
  });

  it('should call method toggleMenu if clicked button close', () => {
    const spyMethod = spyOn(component, 'toggleMenu');
    const buttonClose = fixture.debugElement.nativeElement.querySelector(
      '#close-menu-dashboard'
    );
    expect(buttonClose).toBeTruthy();
    buttonClose.click();
    expect(spyMethod).toHaveBeenCalledOnceWith('menuDashboard');
  });

  it('should show loading organization name while data is loading', () => {
    component.organizationName = '';
    fixture.detectChanges();
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#organizationName-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });
});
