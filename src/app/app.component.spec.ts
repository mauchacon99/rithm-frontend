import { TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockUserService } from 'src/mocks';
import { AppComponent } from './app.component';
import { UserService } from './core/user.service';
import { MockComponent } from 'ng-mocks';
import { NotificationToastsContainerComponent } from './navigation/notification-toasts-container/notification-toasts-container.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MatSidenavModule],
      declarations: [
        AppComponent,
        MockComponent(NotificationToastsContainerComponent),
      ],
      providers: [{ provide: UserService, useClass: MockUserService }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
