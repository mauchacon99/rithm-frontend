import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { MockUserService } from 'src/mocks';
import { UserService } from 'src/app/core/user.service';

import { TopNavComponent } from './top-nav.component';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MockComponent } from 'ng-mocks';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;
  let loader: HarnessLoader;
  let notificationButtonHarness: MatButtonHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopNavComponent, MockComponent(UserAvatarComponent)],
      imports: [MatMenuModule, RouterTestingModule],
      providers: [{ provide: UserService, useClass: MockUserService }],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    notificationButtonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '#notification-button' })
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display logo', () => {
    const logo = fixture.debugElement.query(By.css('img'));
    expect(logo).toBeTruthy();
  });

  it('should have notifications button', async () => {
    expect(notificationButtonHarness).toBeTruthy();
  });

  it('should call the `signOut` method on the `UserService`', () => {
    const signOutSpy = spyOn(TestBed.inject(UserService), 'signOut');
    component.signOut();
    expect(signOutSpy).toHaveBeenCalledOnceWith();
  });

  it('should call the `toggle` method on the `SidenavService`', async () => {
    const spy = spyOn(TestBed.inject(SidenavDrawerService), 'toggleSidenav');
    component.toggle();
    expect(spy).toHaveBeenCalledOnceWith();
  });

  it('should hide the notifications pane when clicked outside', () => {
    component.notificationsVisible = true;
    component.clickedOutside();
    expect(component.notificationsVisible).toBeFalse();
  });

  it('should toggle notifications pane when button clicked', () => {
    expect(component.notificationsVisible).toBeFalse();
    component.toggleNotifications();
    expect(component.notificationsVisible).toBeTrue();
  });

  // TODO: research karma-viewport for testing the following

  xit('should display a tab for every nav item', () => {
    expect(component).toBeTruthy();
  });

  xit('should display user profile', () => {
    expect(component).toBeTruthy();
  });

  xit('should allow the user to sign out', () => {
    expect(component).toBeTruthy();
  });
});
