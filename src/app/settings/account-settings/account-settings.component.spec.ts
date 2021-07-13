import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MockComponent } from 'ng-mocks';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { MockPopupService, MockUserService } from 'src/mocks';
import { GeneralAccountSettingsComponent } from '../general-account-settings/general-account-settings.component';
import { NotificationSettingsComponent } from '../notification-settings/notification-settings.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AccountSettingsComponent } from './account-settings.component';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountSettingsComponent,
        MockComponent(GeneralAccountSettingsComponent),
        MockComponent(NotificationSettingsComponent)
      ],
      imports: [
        MatCardModule,
        MatDialogModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: PopupService, useClass: MockPopupService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
