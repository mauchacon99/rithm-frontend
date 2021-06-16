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

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;
  let loader: HarnessLoader;
  let notificationButtonHarness: MatButtonHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopNavComponent],
      imports: [
        MatMenuModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    notificationButtonHarness = await loader.getHarness(MatButtonHarness.with({ selector: '#notification-button' }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display logo', () => {
    const logo = fixture.debugElement.query(By.css('.logo'));
    expect(logo).toBeTruthy();
  });

  it('should have notifications button', async () => {
    expect(notificationButtonHarness).toBeTruthy();
  });

  xit('should toggle notifications pane when button clicked', async () => {
    const notificationsSpy = spyOn(component, 'toggleNotifications');
    await notificationButtonHarness.click();
    expect(notificationsSpy).toHaveBeenCalledOnceWith();
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
