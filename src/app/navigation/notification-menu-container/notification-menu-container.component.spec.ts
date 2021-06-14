import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationMenuContainerComponent } from './notification-menu-container.component';

describe('NotificationMenuContainerComponent', () => {
  let component: NotificationMenuContainerComponent;
  let fixture: ComponentFixture<NotificationMenuContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationMenuContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationMenuContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
