import { TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockUserService } from 'src/mocks';
import { AppComponent } from './app.component';
import { SidenavService } from './core/sidenav.service';
import { UserService } from './core/user.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        MatSidenavModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: UserService, useValue: MockUserService },
        { provide: SidenavService, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
