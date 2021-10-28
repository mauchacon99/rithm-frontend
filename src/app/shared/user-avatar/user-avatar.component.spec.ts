import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { By } from '@angular/platform-browser';
import { UserAvatarComponent } from './user-avatar.component';

describe('UserAvatarComponent', () => {
  let component: UserAvatarComponent;
  let fixture: ComponentFixture<UserAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAvatarComponent ],
      imports: [ MatTooltipModule, MatBadgeModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAvatarComponent);
    component = fixture.componentInstance;
    component.firstName = 'Tyler';
    component.lastName = 'Hendrickson';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct initials', () => {
    expect(component.initials).toEqual('TH');
  });

  it('should display avatar', () => {
    const avatar = fixture.debugElement.query(By.css('#avatar'));
    expect(avatar).toBeTruthy();
    expect(component.initials).toBeTruthy();
  });
});
