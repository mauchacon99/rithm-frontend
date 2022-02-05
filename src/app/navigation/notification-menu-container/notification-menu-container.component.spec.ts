import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MockComponent } from 'ng-mocks';
import { NotificationCardComponent } from '../notification-card/notification-card.component';

import { NotificationMenuContainerComponent } from './notification-menu-container.component';

describe('NotificationMenuContainerComponent', () => {
  let component: NotificationMenuContainerComponent;
  let fixture: ComponentFixture<NotificationMenuContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NotificationMenuContainerComponent,
        MockComponent(NotificationCardComponent),
      ],
      imports: [MatCardModule],
    }).compileComponents();
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
