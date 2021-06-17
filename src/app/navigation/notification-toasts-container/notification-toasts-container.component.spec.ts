import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationToastsContainerComponent } from './notification-toasts-container.component';

describe('NotificationToastsContainerComponent', () => {
  let component: NotificationToastsContainerComponent;
  let fixture: ComponentFixture<NotificationToastsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationToastsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationToastsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
