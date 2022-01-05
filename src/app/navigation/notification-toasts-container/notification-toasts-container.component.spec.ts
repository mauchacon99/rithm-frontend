import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { NotificationCardComponent } from '../notification-card/notification-card.component';

import { NotificationToastsContainerComponent } from './notification-toasts-container.component';

describe('NotificationToastsContainerComponent', () => {
  let component: NotificationToastsContainerComponent;
  let fixture: ComponentFixture<NotificationToastsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NotificationToastsContainerComponent,
        MockComponent(NotificationCardComponent),
      ],
    }).compileComponents();
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
