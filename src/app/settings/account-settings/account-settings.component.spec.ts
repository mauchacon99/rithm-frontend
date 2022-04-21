import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MockComponent } from 'ng-mocks';
import { NotificationSettingsComponent } from '../notification-settings/notification-settings.component';
import { AccountSettingsComponent } from './account-settings.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/user.service';
import { MockPopupService, MockUserService } from 'src/mocks';
import { PopupService } from 'src/app/core/popup.service';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  const formBuilder = new FormBuilder();

  const dialogRefSpyObj = jasmine.createSpyObj({
    // eslint-disable-next-line rxjs/finnish
    afterClosed: of({}),
    close: null,
  });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountSettingsComponent,
        MockComponent(UserFormComponent),
        MockComponent(NotificationSettingsComponent),
      ],
      imports: [MatCardModule, MatDialogModule, ReactiveFormsModule],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: UserService, useClass: MockUserService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
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
