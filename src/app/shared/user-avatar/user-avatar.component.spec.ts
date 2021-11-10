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

  it('should return a check badge', async () => {
    component.badgeHover = false;
    component.badge = 'check';
    const badgeValue = component.getBadges();
    expect(badgeValue).toEqual('\u2714');
  });

  it('should return a plus badge', () => {
    component.badgeHover = false;
    component.badge = 'plus';
    const badgeValue = component.getBadges();
    expect(badgeValue).toEqual('\u002b');
  });

  it('should return a minus badge', async () => {
    component.badgeHover = false;
    component.badge = 'minus';
    const badgeValue = component.getBadges();
    expect(badgeValue).toEqual('\u2212');
  });

  it('should return a minus badge on mouseover', async () => {
    component.badgeHover = true;
    const badgeValue = component.getBadges();
    expect(badgeValue).toEqual('\u2212');
  });

});
