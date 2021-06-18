import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserService } from 'src/app/core/user.service';
import { MockUserService } from 'src/mocks';

import { UserAvatarComponent } from './user-avatar.component';

describe('UserAvatarComponent', () => {
  let component: UserAvatarComponent;
  let fixture: ComponentFixture<UserAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAvatarComponent ],
      providers: [
        {
          provide: UserService,
          useClass: MockUserService
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAvatarComponent);
    component = fixture.componentInstance;
    component.user = {
      rithmId: '123',
      firstName: 'Testy',
      lastName: 'Test',
      email: 'test@test.com',
      objectPermissions: [],
      groups: [],
      createdDate: '1/2/34'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display avatar', () => {
    const avatar = fixture.debugElement.query(By.css('.profile'));
    expect(avatar).toBeTruthy();
    expect(component.initials).toBeTruthy();
  });
});
