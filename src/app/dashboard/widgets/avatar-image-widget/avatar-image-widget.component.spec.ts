import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarImageWidgetComponent } from './avatar-image-widget.component';

describe('AvatarImageWidgetComponent', () => {
  let component: AvatarImageWidgetComponent;
  let fixture: ComponentFixture<AvatarImageWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvatarImageWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarImageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show profile image', () => {
    component.profileImage = 'image-base-64';
    fixture.detectChanges();

    const profileImg =
      fixture.debugElement.nativeElement.querySelector('#profile-image');
    const profileIcon =
      fixture.debugElement.nativeElement.querySelector('#profile-icon');

    expect(profileImg).toBeTruthy();
    expect(profileIcon).toBeNull();
  });

  it('should show profile icon', () => {
    component.profileImage = '';
    fixture.detectChanges();

    const profileImg =
      fixture.debugElement.nativeElement.querySelector('#profile-image');
    const profileIcon =
      fixture.debugElement.nativeElement.querySelector('#profile-icon');

    expect(profileImg).toBeNull();
    expect(profileIcon).toBeTruthy();
  });
});
