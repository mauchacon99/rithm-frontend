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
});
